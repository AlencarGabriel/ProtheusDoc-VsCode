import * as vscode from 'vscode';

export class DocThisCompletionItem extends vscode.CompletionItem {
    constructor(document: vscode.TextDocument, position: vscode.Position) {
        super("Add ProtheusDoc Block", vscode.CompletionItemKind.Snippet);
        this.insertText = "";
        this.sortText = "\0";

        const line = document.lineAt(position.line).text;

        // FIXME: Ajustar para não substituir o conteúdo da linha posicionada caso passe vazio.
        this.range = new vscode.Range(
            position,
            position.translate(0, line.length));

        this.detail = "Adiciona um bloco inteligente de documentação ProtheusDoc.";
        this.documentation = new vscode.MarkdownString("Detecta a assinatura de `Função`, `Método` ou `Classe` mais próxima e monta o bloco ProtheusDoc contendo os argumentos.");

        this.command = {
            title: "ProtheusDOC",
            command: "protheusdoc.addDocBlock",
            arguments: [true]
        };
    }
}