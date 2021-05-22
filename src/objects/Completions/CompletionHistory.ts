import * as vscode from 'vscode';
import { Utils } from '../Utils';

export class CompletionHistory extends vscode.CompletionItem {
    private _util: Utils;

    constructor(position: vscode.Position) {
        super("@history", vscode.CompletionItemKind.Snippet);
        this._util = new Utils();

        this.range = new vscode.Range(
            new vscode.Position(position.line, 0),
            new vscode.Position(position.line, position.character));

        this.insertText = new vscode.SnippetString('@history ${1:' + new Date().toLocaleDateString() + '}, ${2:' + this._util.getAuthor() + '}, ${3:description}.');
        this.detail = "Histórico de alterações no código-fonte. (ProtheusDoc for VsCode (AdvPL))";
        this.documentation = new vscode.MarkdownString().appendCodeblock("@history date, username, description.");
    }
}