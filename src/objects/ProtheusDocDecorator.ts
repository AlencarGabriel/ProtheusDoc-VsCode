import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Utils } from './Utils';
import { ELanguageSupport } from './ProtheusDoc';

// Decorator para os atributos do ProtheusDoc
const attrPdocDecorationType = vscode.window.createTextEditorDecorationType({
    fontWeight: "bold",
    color: "",
    backgroundColor: ""
});

/**
 * Busca no JSON de snippets a descrição dos atributos para utilizar no hover do decorator.
 * @param attr Atributo ProtheusDoc a ser localizado.
 */
function getDescAttr(attr: string): string {

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

/**
 * Classe para varrer o arquivo e implementar o decorator.
 */
export class ProtheusDocDecorator {

    private _timeout: NodeJS.Timer | undefined = undefined;
    private _util: Utils;

    constructor() {
        this._util = new Utils();
    }

    /**
     * Implementa o decorator do arquivo ativo no editor.
     */
    private updateDecorations() {
        let activeEditor = vscode.window.activeTextEditor;

        if (!activeEditor) {
            return;
        }

        // Expressão com os tipos tratados no snippet
        const regEx = /@(type|version|author|since|param|return|history|example|see|obs|link)/gi;
        const text = activeEditor.document.getText();
        const attrPdoc: vscode.DecorationOptions[] = [];

        let match;

        // Percorre via expressão regular todas as ocorrencias de atributos ProtheusDoc no arquivo.
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

    /**
     * Gatilho para adicionar as decorações de atributs ProtheusDoc no arquivo.
     */
    public triggerUpdateDecorations() {

        // Aplica as decorações apenas em fontes suportados
        if (vscode.window.activeTextEditor?.document.languageId === ELanguageSupport.advpl ||
            vscode.window.activeTextEditor?.document.languageId === ELanguageSupport["4gl"]
        ) {

            // Verifica se o usuário deseja que os atributos sejam decorados.
            if (this._util.getUseDecorator()) {

                if (this._timeout) {
                    clearTimeout(this._timeout);
                    this._timeout = undefined;
                }

                this._timeout = setTimeout(this.updateDecorations, 0);

            }
        }

    }

}