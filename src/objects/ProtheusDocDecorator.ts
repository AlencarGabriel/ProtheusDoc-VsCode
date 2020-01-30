import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const attrPdocDecorationType = vscode.window.createTextEditorDecorationType({
    fontWeight: "bold",
    color: "",
    backgroundColor: ""
});

function getDescAttr(attr: string): string{

    let text: Buffer;
    let object: any;
    let extensionPath = vscode.extensions.getExtension("alencargabriel.protheusdoc-vscode")?.extensionPath;      
    
    text = fs.readFileSync(extensionPath + path.sep + 'snippets' + path.sep + 'protheusDoc.json');
    object = JSON.parse(text.toString()); 
    object = object[attr.toUpperCase().substr(1)];

    if (object) {
        return object.description;
    }

    return "";
}

export class ProtheusDocDecorator {

    private _timeout: NodeJS.Timer | undefined = undefined;

    private updateDecorations() {
        let activeEditor = vscode.window.activeTextEditor;

        if (!activeEditor) {
            return;
        }

        const regEx = /@(type|version|author|since|param|return|history|example|see)/gi;
        const text = activeEditor.document.getText();
        const attrPdoc: vscode.DecorationOptions[] = [];

        let match;

        while (match = regEx.exec(text)) {
            const startPos = activeEditor.document.positionAt(match.index);
            const endPos = activeEditor.document.positionAt(match.index + match[0].length);
            const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: '**Descrição:** ' + getDescAttr(match[0]) };

            if (match[0]) {
                attrPdoc.push(decoration);
            }
        }

        activeEditor.setDecorations(attrPdocDecorationType, attrPdoc);
    }

    public triggerUpdateDecorations() {
        if (this._timeout) {
            clearTimeout(this._timeout);
            this._timeout = undefined;
        }
        this._timeout = setTimeout(this.updateDecorations, 0);
    }

}