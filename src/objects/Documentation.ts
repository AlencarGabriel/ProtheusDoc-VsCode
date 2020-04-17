import * as vscode from 'vscode';
import { ETypesDoc } from '../interfaces/ISyntaxProtheusDoc';
import * as path from 'path';
import { ELanguageSupport } from './ProtheusDoc';

/**
 * Interface para manipular os dados de um parâmetro.
 */
interface IParam {
    paramName: string;
    paramType: string;
    paramDescription: string;
}

/**
 * Classe para ser manipulada pelo Hover das Documentações.
 */
export class Documentation {
    public identifier: string;
    public description: string;
    public type: string;
    public className: string;
    public params: IParam[];
    public return: IParam;
    public file: vscode.Uri;

    constructor(documentation: ProtheusDocToDoc) {
        this.identifier = documentation.identifier;
        this.description = documentation.description;
        this.type = documentation.type;
        this.className = documentation.className;
        this.params = documentation.params;
        this.return = documentation.return;
        this.file = documentation.file;
    }

    /**
     * Retorna a documentação a ser exibida no Hover.
     * @Obs Cada novo marcador que for adicionado no Hover, deverá ser tratado na config `protheusDoc.marcadores_hover`
     */
    public getHover(): vscode.MarkdownString {
        let doc = new vscode.MarkdownString;

        if (this.type.trim().toUpperCase() === ETypesDoc.function.toString().toUpperCase()) {
            doc.appendCodeblock("Function " + this.identifier.trim() + "()", ELanguageSupport.advpl);
        }
        else if (this.type.trim().toUpperCase() === ETypesDoc.method.toString().toUpperCase()) {
            doc.appendCodeblock("Method " + this.identifier.trim() + "() Class " + (this.className === "" ? "Class" : this.className), ELanguageSupport.advpl);
        }
        else if (this.type.trim().toUpperCase() === ETypesDoc.class.toString().toUpperCase()) {
            doc.appendCodeblock("Class " + this.identifier.trim(), ELanguageSupport.advpl);
        }
        else {
            doc.appendMarkdown((this.type.trim() !== "" ? "(" + this.type.trim() + ") " : "") + "`" + this.identifier.trim() + "` \r\n");
        }

        if (this.description.trim() !== "") {
            doc.appendText(this.description.trim() + "\r\n");
        }

        if (this.params.length > 0) {
            this.params.forEach(param => {
                doc.appendMarkdown("\r\n *@param* `" + param.paramName.trim() + "` — " + param.paramDescription.trim() + "\r\n");
            });
        }

        if (this.return.paramDescription.trim() !== "") {
            doc.appendMarkdown("\r\n *@return* " + this.return.paramDescription.trim() + "\r\n");
        }

        let dirs = this.file.fsPath.toString().split(path.sep);
        doc.appendMarkdown("\r\n **Localização**: [" + dirs[dirs.length - 2] + path.sep + dirs[dirs.length - 1] + "](" + this.file.toString() + ") \r\n");

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
    private _expressionParams: RegExp;
    private _expressionReturn: RegExp;
    public identifier: string;
    public description: string;
    public type: string;
    public className: string;
    public params: IParam[];
    public return: IParam;
    public file: vscode.Uri;

    constructor(protheusDocBlock: string, file: vscode.Uri) {
        this._protheusDocBlock = protheusDocBlock;
        this._expressionHeader = /(\{Protheus\.doc\}\s*)([^*\n]*)(\n[^:@]*)/mi;
        this._expressionType = /(@type\s*)(\w+)/i;
        this._expressionParams = /(@param\s*)(\w+\s*)(,\s*\w+\s*)?(,\s*[^:@\n]*)?/img;
        this._expressionReturn = /(@return\s*)(\w+\s*)(,\s*[^:@\n]*)?/im;
        this.identifier = "";
        this.description = "";
        this.type = "";
        this.className = "";
        this.params = [];
        this.return = { paramName: "", paramType: "", paramDescription: "" };
        this.file = file;

        this.toBreak();
    }

    /**
     * Quebra o bloco ProtheusDoc para montar a estrutura de Documentation.
     */
    private toBreak() {
        let headerDoc = this._protheusDocBlock.match(this._expressionHeader);
        let typeDoc = this._protheusDocBlock.match(this._expressionType);
        let paramsDoc = this._protheusDocBlock.match(this._expressionParams);
        let returnDoc = this._protheusDocBlock.match(this._expressionReturn);

        // Caso tenha detectado o cabeçalho da documentação trata as informações
        if (headerDoc) {
            this.identifier = headerDoc[2];

            // Tratamento para buscar a classe referente do métodos (no else são os possíveis legados)
            if (this.identifier.indexOf("::") > 0) {
                this.identifier = this.identifier.substr(this.identifier.indexOf("::") + 2);
                this.className = headerDoc[2].substring(0, headerDoc[2].indexOf("::"));
            }
            else if (this.identifier.indexOf(":") > 0) {
                this.identifier = this.identifier.substr(this.identifier.indexOf(":") + 1);
                this.className = headerDoc[2].substring(0, headerDoc[2].indexOf(":"));
            }

            // Define a descrição do identificador
            if (headerDoc[3]) {
                this.description = headerDoc[3];
            }

            // Tratamento para buscar os parâmetros da funçao/método na documentação
            if (paramsDoc) {
                let match;
                while (match = this._expressionParams.exec(this._protheusDocBlock)) {
                    this.params.push({
                        paramName: match[2],
                        paramType: match[3] ? match[3].replace(",", "") : "",
                        paramDescription: match[4] ? match[4].replace(",", "") : ""
                    });
                }
            }

            // Tratamento para buscar o retorno da funçao na documentação
            if (returnDoc) {
                this.return.paramType = returnDoc[2] ? returnDoc[2] : "";
                this.return.paramDescription = returnDoc[3] ? returnDoc[3].replace(",", "") : "";
            }
        }

        // Caso tenha detectado o tipo do identificador, adiciona a informação
        if (typeDoc) {
            this.type = typeDoc[2];
        }
    }

    /**
     * Retorna uma instancia de Documentation baseado no bloco de documentação PDoc.
     */
    public getDocumentation(): Documentation {
        return new Documentation(this);
    }
}