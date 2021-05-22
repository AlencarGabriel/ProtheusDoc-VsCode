import * as vscode from 'vscode';
import { Utils } from '../Utils';

export class CompletionAuthor extends vscode.CompletionItem {
    private _util: Utils;

    constructor(position: vscode.Position) {
        super("@author", vscode.CompletionItemKind.Snippet);
        this._util = new Utils();

        this.range = new vscode.Range(
            new vscode.Position(position.line, 0),
            new vscode.Position(position.line, position.character));

        this.insertText = new vscode.SnippetString('@author ${1:' + this._util.getAuthor() + '}');
        this.detail = "Texto com o nome do autor";
        this.documentation = new vscode.MarkdownString().appendCodeblock("@author author_name");
    }
}