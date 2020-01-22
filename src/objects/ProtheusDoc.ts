import * as vscode from 'vscode';
import { ISyntaxProtheusDoc } from '../interfaces/ISyntaxProtheusDoc';
import { SyntaxAdvpl } from './SyntaxAdvpl';
import { ITransformProtheusDoc } from '../interfaces/ITransformProtheusDoc';
import { TransformAdvpl } from './TransformAdvpl';
import { Utils } from './Utils';

export enum ELanguageSupport {
    "advpl" = "advpl",
    "4gl" = "4gl"
}

/**
 * Classe que implementa a estrutura ProtheusDoc conforme linguagem.
 */
export class ProtheusDoc {

    private _syntaxSupport: ISyntaxProtheusDoc;
    private _languageId: ELanguageSupport;
    private _transform: ITransformProtheusDoc;
    private _util: Utils;

    constructor(languageId: ELanguageSupport, signature: string) {
        this._languageId = languageId;
        this._util = new Utils();

        if (signature.trim() === "") {
            throw new Error("Signature not informed");
        }

        // Instancia a classe de surporte a ProtheusDOC para Advpl
        if (this._languageId === ELanguageSupport.advpl) {
            this._syntaxSupport = new SyntaxAdvpl();
            this._transform = new TransformAdvpl(signature);
        } else {
            throw new Error("The Type " + this._languageId.toString() + " is not supported.");
        }
    }

    /**
     * Retorna a estrutura ProtheusDoc conforme tipo linguagem e configurações do usuário.
     */
    public getProtheusDoc(): string {
        let bufferDoc = "";
        let marcadoresOcultos = this._util.getHiddenMarkers();

        bufferDoc += this._syntaxSupport.getIdentifier(this._transform.getIdentifierName());
        bufferDoc += this._syntaxSupport.getType(this._transform.getType());

        // tslint:disable-next-line: curly
        if (!marcadoresOcultos.includes("Version"))
            bufferDoc += this._syntaxSupport.getVersion(this._util.getVersion());

        // tslint:disable-next-line: curly
        if (!marcadoresOcultos.includes("Author"))
            bufferDoc += this._syntaxSupport.getAuthor(this._util.getAuthor());

        // tslint:disable-next-line: curly
        if (!marcadoresOcultos.includes("Since"))
            bufferDoc += this._syntaxSupport.getSince(new Date());

        // tslint:disable-next-line: curly
        if (!marcadoresOcultos.includes("Params"))
            bufferDoc += this._syntaxSupport.getParams(this._transform.getParams());

        // tslint:disable-next-line: curly
        if (!marcadoresOcultos.includes("Return"))
            bufferDoc += this._syntaxSupport.getReturn(this._transform.getReturn());

        bufferDoc += this._syntaxSupport.getFinisher();

        return bufferDoc;
    }

}