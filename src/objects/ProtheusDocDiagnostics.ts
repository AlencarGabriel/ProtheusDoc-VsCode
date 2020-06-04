import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Utils } from './Utils';
import { ELanguageSupport } from './ProtheusDoc';

/**
 * Classe para manupular os diagnósticos de um arquivo.
 */
export class ProtheusDocDiagnostics {
    private _expressionHeader: RegExp;
    private _expressionType: RegExp;
    private _expressionAuthor: RegExp;
    private _expressionParams: RegExp;
    private _expressionReturn: RegExp;
    private _expressionHistories: RegExp;
    private _timeout: NodeJS.Timer | undefined = undefined;

    constructor() {
        this._expressionHeader = /(\{Protheus\.doc\}\s*)([^*\n]*)(\n[^:@]*)/gmi;
        this._expressionType = /(@type\s*)(\w+)?/gi;
        this._expressionAuthor = /(@author\s*)(\w+)?/gi;
        this._expressionParams = /(@param\s*)(\w+\s*)?(,\s*\w+\s*)?(,\s*[^:@\n]*)?/img;
        this._expressionReturn = /(@return\s*)(\w+\s*)?(,\s*[^:@\n]*)?/gim;
        this._expressionHistories = /(@history\s*)([^:@\n\,]*)?(,\s*[^:@\n\,]*)?(,\s*[^:@\/]*)?/img;
    }

    /**
     * Verifica se o atributo está definido e preenchido. 
     * @param text texto a ser validado.
     */
    private validAttr(text: string | undefined): boolean {

        if (text) {
            if (text.trim() === "") {
                return false;
            }
        } else {
            return false;
        }

        return true;

    }

    /**
     * Valida o cabeçalho dasdocumentações (Identificador e descrição).
     * @param document Documento a ser validado.
     */
    private validHeader(document: vscode.TextDocument): vscode.Diagnostic[] {
        let match;
        let text = document.getText();
        let diagnostics = new Array<vscode.Diagnostic>();

        // Percorre via expressão regular todas as ocorrencias de atributos ProtheusDoc no arquivo.
        while (match = this._expressionHeader.exec(text)) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);

            if (!this.validAttr(match[3])) {
                diagnostics.push({
                    code: '',
                    message: 'Descrição ou identificador da documentação não informado.',
                    range: new vscode.Range(startPos, endPos),
                    severity: vscode.DiagnosticSeverity.Warning,
                    source: ''
                });
            }
        }

        return diagnostics;

    }

    /**
     * Valida o tipo do identificador nas documentações.
     * @param document Documento a ser validado.
     */
    private validType(document: vscode.TextDocument): vscode.Diagnostic[] {
        let match;
        let text = document.getText();
        let diagnostics = new Array<vscode.Diagnostic>();

        // Percorre via expressão regular todas as ocorrencias de atributos Type do ProtheusDoc no arquivo.
        while (match = this._expressionType.exec(text)) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);

            if (!this.validAttr(match[2])) {
                diagnostics.push({
                    code: '',
                    message: 'Tipo do identificador não informado. Deve ser function, class ou method.',
                    range: new vscode.Range(startPos, endPos),
                    severity: vscode.DiagnosticSeverity.Warning,
                    source: ''
                });
            } else if (!match[2].trim().match(/function|class|method/i)) {
                diagnostics.push({
                    code: '',
                    message: 'Tipo do identificador inválido. Deve ser function, class ou method.',
                    range: new vscode.Range(startPos, endPos),
                    severity: vscode.DiagnosticSeverity.Warning,
                    source: ''
                });
            }

        }

        return diagnostics;

    }

    /**
     * Valida o autor das documentações.
     * @param document Documento a ser validado.
     */
    private validAuthor(document: vscode.TextDocument): vscode.Diagnostic[] {
        let match;
        let text = document.getText();
        let diagnostics = new Array<vscode.Diagnostic>();

        // Percorre via expressão regular todas as ocorrencias de atributos Author do ProtheusDoc no arquivo.
        while (match = this._expressionAuthor.exec(text)) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);

            if (!this.validAttr(match[2])) {
                diagnostics.push({
                    code: '',
                    message: 'Autor não foi informado.',
                    range: new vscode.Range(startPos, endPos),
                    severity: vscode.DiagnosticSeverity.Warning,
                    source: ''
                });
            }
        }

        return diagnostics;

    }

    /**
     * Valida os parâmetros das documentações.
     * @param document Documento a ser validado.
     */
    private validParam(document: vscode.TextDocument): vscode.Diagnostic[] {
        let match;
        let text = document.getText();
        let diagnostics = new Array<vscode.Diagnostic>();

        // Percorre via expressão regular todas as ocorrencias de atributos Author do ProtheusDoc no arquivo.
        while (match = this._expressionParams.exec(text)) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);

            if (!this.validAttr(match[2]) || match[2]?.trim() === "param_name") {
                diagnostics.push({
                    code: '',
                    message: 'Nome do parâmetro não foi informado.',
                    range: new vscode.Range(startPos, endPos),
                    severity: vscode.DiagnosticSeverity.Warning,
                    source: ''
                });
            }

            if (!match[3].match(/numeric|character|date|codeblock|logical|array|object|variadic/i)) {
                diagnostics.push({
                    code: '',
                    message: 'Tipo do parâmetro não informado ou inválido.',
                    range: new vscode.Range(startPos, endPos),
                    severity: vscode.DiagnosticSeverity.Warning,
                    source: ''
                });
            }

            if (!this.validAttr(match[4]) || match[4]?.trim().match(/param_description/i)) {
                diagnostics.push({
                    code: '',
                    message: 'Descrição do parâmetro não foi informada.',
                    range: new vscode.Range(startPos, endPos),
                    severity: vscode.DiagnosticSeverity.Warning,
                    source: ''
                });
            }
        }

        return diagnostics;

    }

    /**
     * Valida os retornos das documentações.
     * @param document Documento a ser validado.
     */
    private validReturn(document: vscode.TextDocument): vscode.Diagnostic[] {
        let match;
        let text = document.getText();
        let diagnostics = new Array<vscode.Diagnostic>();

        // Percorre via expressão regular todas as ocorrencias de atributos Author do ProtheusDoc no arquivo.
        while (match = this._expressionReturn.exec(text)) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);

            if (!match[2].match(/numeric|character|date|codeblock|logical|array|object|variadic/i)) {
                diagnostics.push({
                    code: '',
                    message: 'Tipo do retorno não informado ou inválido.',
                    range: new vscode.Range(startPos, endPos),
                    severity: vscode.DiagnosticSeverity.Warning,
                    source: '',
                    relatedInformation: [
                        new vscode.DiagnosticRelatedInformation(new vscode.Location(document.uri, new vscode.Range(startPos, endPos)), 'Remova o atributo `@return` caso não seja uma função com retorno.')
                    ]
                });
            }

            if (!this.validAttr(match[3]) || match[3]?.trim().match(/return_description/i)) {
                diagnostics.push({
                    code: '',
                    message: 'Descrição do retorno não foi informada.',
                    range: new vscode.Range(startPos, endPos),
                    severity: vscode.DiagnosticSeverity.Warning,
                    source: ''
                });
            }
        }

        return diagnostics;

    }

    /**
     * Valida o histórico das documentações.
     * @param document Documento a ser validado.
     */
    private validHistory(document: vscode.TextDocument): vscode.Diagnostic[] {
        let match;
        let text = document.getText();
        let diagnostics = new Array<vscode.Diagnostic>();

        // Percorre via expressão regular todas as ocorrencias de atributos Author do ProtheusDoc no arquivo.
        while (match = this._expressionHistories.exec(text)) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);

            if (!this.validAttr(match[2]) || !match[2]?.trim().match(/\//i)) {
                diagnostics.push({
                    code: '',
                    message: 'Data do histórico não foi informada ou é inválida.',
                    range: new vscode.Range(startPos, endPos),
                    severity: vscode.DiagnosticSeverity.Warning,
                    source: ''
                });
            }

            if (!this.validAttr(match[3].replace(",", "")) || match[3]?.trim().match(/username/i)) {
                diagnostics.push({
                    code: '',
                    message: 'Autor do histórico não foi informado.',
                    range: new vscode.Range(startPos, endPos),
                    severity: vscode.DiagnosticSeverity.Warning,
                    source: ''
                });
            }

            if (!this.validAttr(match[4].replace(",", "")) || match[4]?.trim().match(/description/i)) {
                diagnostics.push({
                    code: '',
                    message: 'Descrição do histórico não foi informada.',
                    range: new vscode.Range(startPos, endPos),
                    severity: vscode.DiagnosticSeverity.Warning,
                    source: ''
                });
            }
        }

        return diagnostics;

    }

    /**
     * Chama as validações de cada atributo e monta uma coleção de diagnósticos.
     * @param document Documento a ser validado.
     * @param collection Coleção de diagnosticos.
     * @param instance Inscancia da classe. (Necessário pois como é chamada via setTimeout perde a instancia do this). 
     */
    private updateDiagnostics(document: vscode.TextDocument, collection: vscode.DiagnosticCollection, instance: ProtheusDocDiagnostics) {
        collection.clear();

        let diagnostics = new Array<vscode.Diagnostic>();

        diagnostics = diagnostics.concat(
            instance.validHeader(document),
            instance.validType(document),
            instance.validAuthor(document),
            instance.validParam(document),
            instance.validReturn(document),
            instance.validHistory(document)
        );

        collection.set(document.uri, diagnostics);
    }

    /**
     * Gatilho para adicionar os diagnosticos das documentações ProtheusDoc no arquivo.
     */
    public triggerUpdateDiagnostics(document: vscode.TextDocument, collection: vscode.DiagnosticCollection) {

        // Aplica as análises apenas em fontes suportados
        if (vscode.window.activeTextEditor?.document.languageId === ELanguageSupport.advpl ||
            vscode.window.activeTextEditor?.document.languageId === ELanguageSupport["4gl"]
        ) {

            // Verifica se o usuário deseja que os atributos sejam decorados.
            // if (this._util.getUseDecorator()) {

            if (this._timeout) {
                clearTimeout(this._timeout);
                this._timeout = undefined;
            }

            this._timeout = setTimeout(this.updateDiagnostics, 0, document, collection, this);

            // }
        }

    }
}