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

    constructor() {
        this._expressionHeader = /(\{Protheus\.doc\}\s*)([^*\n]*)(\n[^:@]*)/gmi;
        this._expressionType = /(@type\s*)(\w+)?/gi;
        this._expressionAuthor = /(@author\s*)(\w+)?/gi;
        this._expressionParams = /(@param\s*)(\w+\s*)(,\s*\w+\s*)?(,\s*[^:@\n]*)?/img;
        this._expressionReturn = /(@return\s*)(\w+\s*)(,\s*[^:@\n]*)?/gim;
        this._expressionHistories = /(@history\s*)([^:@\n\,]*)(,\s*[^:@\n\,]*)?(,\s*[^:@\/]*)?/img;
    }

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
                    // ,
                    // relatedInformation: [
                    //     new vscode.DiagnosticRelatedInformation(new vscode.Location(document.uri, new vscode.Range(startPos, endPos)), 'first assignment to `x`')
                    // ]
                });
            }
        }

        return diagnostics;

    }

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
                    // ,
                    // relatedInformation: [
                    //     new vscode.DiagnosticRelatedInformation(new vscode.Location(document.uri, new vscode.Range(startPos, endPos)), 'first assignment to `x`')
                    // ]
                });
            } else if (!match[2].trim().match(/function|class|method/i)) {
                diagnostics.push({
                    code: '',
                    message: 'Tipo do identificador inválido. Deve ser function, class ou method.',
                    range: new vscode.Range(startPos, endPos),
                    severity: vscode.DiagnosticSeverity.Warning,
                    source: ''
                    // ,
                    // relatedInformation: [
                    //     new vscode.DiagnosticRelatedInformation(new vscode.Location(document.uri, new vscode.Range(startPos, endPos)), 'first assignment to `x`')
                    // ]
                });
            }

        }

        return diagnostics;

    }

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
                    // ,
                    // relatedInformation: [
                    //     new vscode.DiagnosticRelatedInformation(new vscode.Location(document.uri, new vscode.Range(startPos, endPos)), 'first assignment to `x`')
                    // ]
                });
            }
        }

        return diagnostics;

    }

    public updateDiagnostics(document: vscode.TextDocument, collection: vscode.DiagnosticCollection) {
        collection.clear();

        let diagnostics = new Array<vscode.Diagnostic>();

        diagnostics = diagnostics.concat(
            this.validHeader(document),
            this.validType(document),
            this.validAuthor(document)
        );

        collection.set(document.uri, diagnostics);
    }
}