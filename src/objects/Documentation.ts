import * as vscode from 'vscode';
import { ETypesDoc } from '../interfaces/ISyntaxProtheusDoc';
import * as path from 'path';
import { ELanguageSupport } from './ProtheusDoc';
import { Utils } from './Utils';

/**
 * Interface para manipular os dados de um parâmetro.
 */
interface IParam {
    paramName: string;
    paramType: string;
    paramDescription: string;
}

/**
 * Interface para manupular os dados dos históricos de um identificador.
 */
interface IHistory {
    historyDate: string;
    historyAuthor: string;
    historyDescription: string;
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
    public histories: IHistory[];
    public file: vscode.Uri;
    public line: number;

    constructor(documentation: ProtheusDocToDoc) {
        this.identifier = documentation.identifier;
        this.description = documentation.description;
        this.type = documentation.type;
        this.className = documentation.className;
        this.params = documentation.params;
        this.return = documentation.return;
        this.histories = documentation.histories;
        this.file = documentation.file;
        this.line = documentation.lineNumber;
    }

    /**
     * Retorna a documentação a ser exibida no Hover.
     * @Obs Cada novo marcador que for adicionado no Hover, deverá ser tratado na config `protheusDoc.marcadores_ocultos_hover`
     */
    public getHover(): vscode.MarkdownString {
        let doc = new vscode.MarkdownString;
        let marcadoresOcultosHover = new Utils().getHiddenMarkersHover();
      
        // To enable command URIs in Markdown content, you must set the `isTrusted` flag.
        doc.isTrusted = true;

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

        if (!marcadoresOcultosHover.includes("Params") && this.params.length > 0) {
            this.params.forEach(param => {
                doc.appendMarkdown("\r\n *@param* `" + param.paramName.trim() + "` — " + param.paramDescription.trim() + "\r\n");
            });
        }

        if (!marcadoresOcultosHover.includes("Return") && this.return.paramDescription.trim() !== "") {
            doc.appendMarkdown("\r\n *@return* " + this.return.paramDescription.trim() + "\r\n");
        }

        if (!marcadoresOcultosHover.includes("History") && this.histories.length > 0) {
            this.histories.forEach(history => {
                doc.appendMarkdown("\r\n *@history* `" + history.historyDate.trim() + "` — " + history.historyAuthor.trim() + " — " + history.historyDescription.trim() + "\r\n");
            });
        }
      
        // Aciona o documento com link para a documentação do arquivo
        let dirs = this.file.fsPath.toString().split(path.sep);
        const args = [{ file: this.file.toString(), line: this.line }]; 
        const link = vscode.Uri.parse(`command:protheusdoc.openFile?${encodeURIComponent(JSON.stringify(args))}`);
        doc.appendMarkdown("\r\n **Localização**: [" + dirs[dirs.length - 2] + path.sep + dirs[dirs.length - 1] + ":" + this.line.toString() + "](" + `${link}` + ") \r\n");

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
    private _expressionHistories: RegExp;
    public identifier: string;
    public description: string;
    public type: string;
    public className: string;
    public params: IParam[];
    public return: IParam;
    public histories: IHistory[];
    public file: vscode.Uri;
    public lineNumber: number;

    constructor(protheusDocBlock: string, file: vscode.Uri) {
        this._protheusDocBlock = protheusDocBlock;
        this._expressionHeader = /(\{Protheus\.doc\}\s*)([^*\n]*)(\n[^:@]*)/mi;
        this._expressionType = /(@type\s*)(\w+)/i;
        this._expressionParams = /(@param\s*)(\w+\s*)(,\s*\w+\s*)?(,\s*[^:@\n]*)?/img;
        this._expressionReturn = /(@return\s*)(\w+\s*)(,\s*[^:@\n]*)?/im;
        this._expressionHistories = /(@history\s*)([^:@\n\,]*)(,\s*[^:@\n\,]*)?(,\s*[^:@\/]*)?/img;
        this.identifier = "";
        this.description = "";
        this.type = "";
        this.className = "";
        this.params = [];
        this.return = { paramName: "", paramType: "", paramDescription: "" };
        this.histories = [];
        this.file = file;
        this.lineNumber = 0;

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
        let historyDoc = this._protheusDocBlock.match(this._expressionHistories);

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
            
            // Tratamento para buscar os históricos de alteração na documentação
            if (historyDoc) {
                let match;
                while (match = this._expressionHistories.exec(this._protheusDocBlock)) {
                    this.histories.push({
                        historyDate: match[2],
                        historyAuthor: match[3] ? match[3].replace(",", "") : "",
                        historyDescription: match[4] ? match[4].replace(",", "") : "",
                    });
                }
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