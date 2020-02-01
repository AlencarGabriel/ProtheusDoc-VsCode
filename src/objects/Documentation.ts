import * as vscode from 'vscode';

export class Documentation {
    public identifier: string;
    public description: string;
    public type: string;
    public file?: vscode.Uri;

    constructor(identifier: string, description: string, type : string, file?: vscode.Uri) {
        this.identifier = identifier;
        this.description = description;
        this.type = type;
        this.file = file;
    }

    public getDocumentation(): vscode.MarkdownString {
        let doc = new vscode.MarkdownString;

        doc.appendMarkdown("(" + this.type + ") `" + this.identifier + "` \n");
        // doc.appendMarkdown("--- \n");
        doc.appendMarkdown("*" + this.description + "*");

        return doc;
    }
}