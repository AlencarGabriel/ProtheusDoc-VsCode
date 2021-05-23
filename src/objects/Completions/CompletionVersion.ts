import * as vscode from 'vscode';
import { Utils } from '../Utils';

export class CompletionVersion extends vscode.CompletionItem {
    private _util: Utils;

    constructor(position: vscode.Position) {
        super("@version", vscode.CompletionItemKind.Snippet);
        this._util = new Utils();

        this.range = new vscode.Range(
            new vscode.Position(position.line, 0),
            new vscode.Position(position.line, position.character));

        this.insertText = new vscode.SnippetString('@version ${1:' + this._util.getVersion() + '}');
        this.detail = "Indica para qual versão de produto ou mesmo servidor, que uma determinada funcionalidade requer. (ProtheusDoc for VsCode (AdvPL))";
        this.documentation = new vscode.MarkdownString().appendCodeblock("@version version");
    }
}