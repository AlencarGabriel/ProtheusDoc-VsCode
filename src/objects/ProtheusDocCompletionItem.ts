import * as vscode from 'vscode';
import { findAdvpl } from '../extension';

export class ProtheusDocCompletionItem extends vscode.CompletionItem {
    constructor(document: vscode.TextDocument, position: vscode.Position) {
        super("Add ProtheusDoc Block", vscode.CompletionItemKind.Snippet);

        if (vscode.window.activeTextEditor) {
            this.insertText = findAdvpl(vscode.window.activeTextEditor);
        }

        this.range = new vscode.Range(
            new vscode.Position(position.line, 0),
            new vscode.Position(position.line, position.character));

        this.sortText = "\0";
        this.detail = "ProtheusDoc for VsCode";
        this.documentation = new vscode.MarkdownString("Detecta a assinatura de `Função`, `Método` ou `Classe` mais próxima e monta o bloco ProtheusDoc contendo os argumentos.");

        // this.command = {
        //     title: "ProtheusDocBlock",
        //     command: "protheusdoc.addDocBlock"
        // };
    }
}