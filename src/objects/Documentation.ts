import * as vscode from 'vscode';
import { ETypesDoc } from '../interfaces/ISyntaxProtheusDoc';

/**
 * Classe para ser manipulada pelo Hover das Documentações.
 */
export class Documentation {
    public identifier: string;
    public description: string;
    public type: string;
    public file: vscode.Uri;

    constructor(identifier: string, description: string, type: string, file: vscode.Uri) {
        this.identifier = identifier;
        this.description = description;
        this.type = type;
        this.file = file;
    }

    /**
     * Retotorna a documentação a ser exibida no Hover.
     */
    public getHover(): vscode.MarkdownString {
        let doc = new vscode.MarkdownString;

        doc.appendMarkdown((this.type.trim() !== "" ? "(" + this.type.trim() + ") " : "") + "`" + this.identifier.trim() + "` \n");
        // doc.appendMarkdown("--- \n");
        doc.appendMarkdown("*" + this.description.trim() + "*");

        return doc;
    }
}

/**
 * Classe para transformar um bloco ProtheusDoc em Documentation.
 */
export class ProtheusDocToDoc {
    private _protheusDocBlock: string;
    private _expressionHeader: RegExp;
    private _expressionType: RegExp;
    private _identifier: string;
    private _description: string;
    private _type: string;
    private _file: vscode.Uri;

    constructor(protheusDocBlock: string, file: vscode.Uri) {
        this._protheusDocBlock = protheusDocBlock;
        this._expressionHeader = /(\{Protheus\.doc\}\s*)([^*\n]*)(\n[^:\/\n]*)/mi;
        this._expressionType = /(@type\s*)(\w+)/i;
        this._identifier = "";
        this._description = "";
        this._type = "";
        this._file = file;

        this.toBreak();
    }

    /**
     * Quebra o bloco ProtheusDoc para montar a estrutura de Documentation.
     */
    private toBreak() {
        let headerDoc = this._protheusDocBlock.match(this._expressionHeader);
        let typeDoc = this._protheusDocBlock.match(this._expressionType);
        let className = "";

        // Caso tenha detectado o cabeçalho da documentação trata as informações
        if (headerDoc) {
            this._identifier = headerDoc[2];

            // Tratamento para buscar a classe referente do métodos (no else são os possíveis legados)
            if (this._identifier.indexOf("::") > 0) {
                this._identifier = this._identifier.substr(this._identifier.indexOf("::") + 2);
                className = headerDoc[2].substring(0, headerDoc[2].indexOf("::"));
            }
            else if (this._identifier.indexOf(":") > 0) {
                this._identifier = this._identifier.substr(this._identifier.indexOf(":") + 1);
                className = headerDoc[2].substring(0, headerDoc[2].indexOf(":"));
            }

            // Define a descrição do identificador
            if (headerDoc[3]) {
                this._description = headerDoc[3];
            }
        }

        // Caso tenha detectado o tipo do identificador, adiciona a informação
        if (typeDoc) {
            this._type = typeDoc[2];

            // Tratamento para que os métodos apresentem o nome da classe ao qual são correspondentes
            if (this._type.trim().toUpperCase() === ETypesDoc.method.toString().toUpperCase() && className !== "") {
                this._type += " of " + className;
            }
        }
    }

    /**
     * Retorna uma instancia de Documentation baseado no bloco de documentação PDoc.
     */
    public getDocumentation(): Documentation {
        return new Documentation(this._identifier, this._description, this._type, this._file);
    }
}