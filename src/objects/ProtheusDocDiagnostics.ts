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
    private _expressionSince: RegExp;
    private _expressionVersion: RegExp;
    private _expressionExample: RegExp;
    private _expressionSee: RegExp;
    private _expressionObs: RegExp;
    private _expressionLink: RegExp;
    private _expressionProtheusDoc: RegExp;
    private _timeout: NodeJS.Timer | undefined = undefined; private _util: Utils;

    constructor() {
        this._util = new Utils();

        this._expressionHeader = /(\{Protheus\.doc\}\s*)([^*\n]*)(\n[^:@]*)/gmi;
        this._expressionType = /(@type\s*)(\w+)?/gi;
        this._expressionAuthor = /(@author\s*)(\w+)?/gi;
        this._expressionParams = /(@param\s*)(\w+\s*)?(,\s*\w+\s*)?(,\s*[^:@\n]*)?/img;
        this._expressionReturn = /(@return\s*)(\w+\s*)?(,\s*[^:@\n]*)?/gim;
        // FIXME: Melhorar essa expressão, pois tem itens com: "*=", ":" e "@" não estão sendo conderados.
        this._expressionHistories = /(@history\s*)([^:@\n\,]*)?(,\s*[^:@\n\,]*)?(,\s*[^:@\/]*)?/img;
        this._expressionSince = /(@since\s*)([^:@\n\,]*)?/gi;
        this._expressionVersion = /(@version\s*)([^:@\n\,]*)?/gi;
        this._expressionExample = /(@example\s*)(\s*[^:@\/]*)/img;
        this._expressionSee = /(@see\s*)([^:@\n\,]*)/gi;
        this._expressionObs = /(@obs\s*)([^\º\/@]*)/img;
        this._expressionLink = /(@link\s*)([^:@\n\,]*)/gi;
        this._expressionProtheusDoc = /(\{Protheus\.doc\}\s*)([^*]*)(\n[^:\n]*)/mig;
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

            if (!this.validAttr(match[3]) || match[3].trim().match(/description/i)) {
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

            if (!this.validAttr(match[2]) || match[2].trim().match(/author/i)) {
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

        if (this._util.getMarkersDontValid().includes("Params")){
            return diagnostics;
        }

        // Percorre via expressão regular todas as ocorrencias de atributos Param do ProtheusDoc no arquivo.
        while (match = this._expressionParams.exec(text)) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);

            if (!this.validAttr(match[2]) || match[2].trim() === "param_name") {
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

            if (!this.validAttr(match[4]) || match[4].trim().match(/param_description/i)) {
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

        if (this._util.getMarkersDontValid().includes("Return")) {
            return diagnostics;
        }

        // Percorre via expressão regular todas as ocorrencias de atributos Return do ProtheusDoc no arquivo.
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

            if (!this.validAttr(match[3]) || match[3].trim().match(/return_description/i)) {
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

        if (this._util.getMarkersDontValid().includes("History")) {
            return diagnostics;
        }

        // Percorre via expressão regular todas as ocorrencias de atributos History do ProtheusDoc no arquivo.
        while (match = this._expressionHistories.exec(text)) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);

            if (!this.validAttr(match[2]) || !(match[2].trim().match(/\//i) || match[2].trim().match(/\-/i))) {
                diagnostics.push({
                    code: '',
                    message: 'Data do histórico não foi informada ou é inválida.',
                    range: new vscode.Range(startPos, endPos),
                    severity: vscode.DiagnosticSeverity.Warning,
                    source: ''
                });
            }

            if (!this.validAttr(match[3].replace(",", "")) || match[3].trim().match(/username/i)) {
                diagnostics.push({
                    code: '',
                    message: 'Autor do histórico não foi informado.',
                    range: new vscode.Range(startPos, endPos),
                    severity: vscode.DiagnosticSeverity.Warning,
                    source: ''
                });
            }

            if (!this.validAttr(match[4].replace(",", "")) || match[4].trim().match(/description/i)) {
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
     * Valida as datas de criação das documentações.
     * @param document Documento a ser validado.
     */
    private validSince(document: vscode.TextDocument): vscode.Diagnostic[] {
        let match;
        let text = document.getText();
        let diagnostics = new Array<vscode.Diagnostic>();

        // Percorre via expressão regular todas as ocorrencias de atributos Since do ProtheusDoc no arquivo.
        while (match = this._expressionSince.exec(text)) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);

            if (!this.validAttr(match[2]) || !(match[2].trim().match(/\//i) || match[2].trim().match(/\-/i))) {
                diagnostics.push({
                    code: '',
                    message: 'Data da documentação não foi informada ou é inválida.',
                    range: new vscode.Range(startPos, endPos),
                    severity: vscode.DiagnosticSeverity.Warning,
                    source: ''
                });
            }

        }

        return diagnostics;

    }

    /**
     * Valida as versões das documentações.
     * @param document Documento a ser validado.
     */
    private validVersion(document: vscode.TextDocument): vscode.Diagnostic[] {
        let match;
        let text = document.getText();
        let diagnostics = new Array<vscode.Diagnostic>();

        // Percorre via expressão regular todas as ocorrencias de atributos Version do ProtheusDoc no arquivo.
        while (match = this._expressionVersion.exec(text)) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);

            if (!this.validAttr(match[2]) || match[2].trim().match(/version/i)) {
                diagnostics.push({
                    code: '',
                    message: 'Versão da documentação não foi informada ou é inválida.',
                    range: new vscode.Range(startPos, endPos),
                    severity: vscode.DiagnosticSeverity.Warning,
                    source: '',
                    relatedInformation: [
                        new vscode.DiagnosticRelatedInformation(new vscode.Location(document.uri, new vscode.Range(startPos, endPos)), 'Caso não queira utilizar este atributo, considere-o na configuração `protheusDoc.marcadores_ocultos`.')
                    ]
                });
            }

        }

        return diagnostics;

    }

    /**
    * Valida o exemplo das documentações.
    * @param document Documento a ser validado.
    */
    private validExample(document: vscode.TextDocument): vscode.Diagnostic[] {
        let match;
        let text = document.getText();
        let diagnostics = new Array<vscode.Diagnostic>();

        if (this._util.getMarkersDontValid().includes("Example")) {
            return diagnostics;
        }

        // Percorre via expressão regular todas as ocorrencias de atributos Example do ProtheusDoc no arquivo.
        while (match = this._expressionExample.exec(text)) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);

            if (!this.validAttr(match[2]) || match[2].trim().match(/examples/i)) {
                diagnostics.push({
                    code: '',
                    message: 'Atributo `@example` informado mas não utilizado.',
                    range: new vscode.Range(startPos, endPos),
                    severity: vscode.DiagnosticSeverity.Warning,
                    source: ''
                });
            }
        }

        return diagnostics;

    }

    /**
     * Valida os "Veja Mais" das documentações.
     * @param document Documento a ser validado.
     */
    private validSee(document: vscode.TextDocument): vscode.Diagnostic[] {
        let match;
        let text = document.getText();
        let diagnostics = new Array<vscode.Diagnostic>();

        if (this._util.getMarkersDontValid().includes("See")) {
            return diagnostics;
        }

        // Percorre via expressão regular todas as ocorrencias de atributos See do ProtheusDoc no arquivo.
        while (match = this._expressionSee.exec(text)) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);

            if (!this.validAttr(match[2]) || match[2].trim().match(/links_or_references/i)) {
                diagnostics.push({
                    code: '',
                    message: 'Atributo `@see` informado mas não utilizado.',
                    range: new vscode.Range(startPos, endPos),
                    severity: vscode.DiagnosticSeverity.Warning,
                    source: ''
                });
            }

        }

        return diagnostics;

    }

    /**
     * Valida as Observações das documentações.
     * @param document Documento a ser validado.
     */
    private validObs(document: vscode.TextDocument): vscode.Diagnostic[] {
        let match;
        let text = document.getText();
        let diagnostics = new Array<vscode.Diagnostic>();

        if (this._util.getMarkersDontValid().includes("Obs")) {
            return diagnostics;
        }

        // Percorre via expressão regular todas as ocorrencias de atributos Obs do ProtheusDoc no arquivo.
        while (match = this._expressionObs.exec(text)) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);

            if (!this.validAttr(match[2]) || match[2].trim().match(/obs-text/i)) {
                diagnostics.push({
                    code: '',
                    message: 'Atributo `@obs` informado mas não utilizado.',
                    range: new vscode.Range(startPos, endPos),
                    severity: vscode.DiagnosticSeverity.Warning,
                    source: ''
                });
            }

        }

        return diagnostics;

    }

    /**
     * Valida os Links das documentações.
     * @param document Documento a ser validado.
     */
    private validLink(document: vscode.TextDocument): vscode.Diagnostic[] {
        let match;
        let text = document.getText();
        let diagnostics = new Array<vscode.Diagnostic>();

        if (this._util.getMarkersDontValid().includes("Link")) {
            return diagnostics;
        }

        // Percorre via expressão regular todas as ocorrencias de atributos Link do ProtheusDoc no arquivo.
        while (match = this._expressionLink.exec(text)) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);

            if (!this.validAttr(match[2]) || match[2].trim().match(/link-text/i)) {
                diagnostics.push({
                    code: '',
                    message: 'Atributo `@link` informado mas não utilizado.',
                    range: new vscode.Range(startPos, endPos),
                    severity: vscode.DiagnosticSeverity.Warning,
                    source: ''
                });
            }

        }

        return diagnostics;

    }

    /**
     * Valida os atributos necessários faltantes das documentações.
     * @param document Documento a ser validado.
     */
    private validMissing(document: vscode.TextDocument): vscode.Diagnostic[] {
        let match;
        let text = document.getText();
        let diagnostics = new Array<vscode.Diagnostic>();

        // Percorre via expressão regular todas as ocorrencias de documentação ProtheusDoc no arquivo.
        while (match = this._expressionProtheusDoc.exec(text)) {
            const startPos = document.positionAt(match.index);
            const endPos = document.positionAt(match.index + match[0].length);

            if (!match[2].trim().match(/@type/i)) {
                diagnostics.push({
                    code: '',
                    message: 'Não foi definido o tipo da documentação.',
                    range: new vscode.Range(startPos, endPos),
                    severity: vscode.DiagnosticSeverity.Warning,
                    source: '',
                    relatedInformation: [
                        new vscode.DiagnosticRelatedInformation(new vscode.Location(document.uri, new vscode.Range(startPos, endPos)), 'Utilize o Snippet `@type` para definir o tipo da documentação.')
                    ]
                });
            }
            
            // Só valida o autor caso nas configurações de marcadores ocultos não esteja definido este atributo
            if (!match[2].trim().match(/@author/i) && !this._util.getHiddenMarkers().includes("Author")) {
                diagnostics.push({
                    code: '',
                    message: 'Não foi definido o autor desse identificador.',
                    range: new vscode.Range(startPos, endPos),
                    severity: vscode.DiagnosticSeverity.Warning,
                    source: '',
                    relatedInformation: [
                        new vscode.DiagnosticRelatedInformation(new vscode.Location(document.uri, new vscode.Range(startPos, endPos)), 'Utilize o Snippet `@author` para definir o autor da documentação.'),
                        new vscode.DiagnosticRelatedInformation(new vscode.Location(document.uri, new vscode.Range(startPos, endPos)), 'Caso não queira utilizar este atributo, considere-o na configuração `protheusDoc.marcadores_ocultos`.')
                    ]
                });
            }

            // Só valida o since caso nas configurações de marcadores ocultos não esteja definido este atributo
            if (!match[2].trim().match(/@since/i) && !this._util.getHiddenMarkers().includes("Since")) {
                diagnostics.push({
                    code: '',
                    message: 'Não foi definido a data de criação deste identificador.',
                    range: new vscode.Range(startPos, endPos),
                    severity: vscode.DiagnosticSeverity.Warning,
                    source: '',
                    relatedInformation: [
                        new vscode.DiagnosticRelatedInformation(new vscode.Location(document.uri, new vscode.Range(startPos, endPos)), 'Utilize o Snippet `@since` para definir a data de criação da documentação.'),
                        new vscode.DiagnosticRelatedInformation(new vscode.Location(document.uri, new vscode.Range(startPos, endPos)), 'Caso não queira utilizar este atributo, considere-o na configuração `protheusDoc.marcadores_ocultos`.')
                    ]
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
            instance.validHistory(document),
            instance.validSince(document),
            instance.validVersion(document),
            instance.validExample(document),
            instance.validSee(document),
            instance.validObs(document),
            instance.validLink(document),
            instance.validMissing(document)
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

            // Verifica se o usuário deseja validar os atributos obrigatórios.
            if (this._util.getValidAttr()) {

                if (this._timeout) {
                    clearTimeout(this._timeout);
                    this._timeout = undefined;
                }

                this._timeout = setTimeout(this.updateDiagnostics, 0, document, collection, this);

            }
        }

    }
}