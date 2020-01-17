import * as vscode from 'vscode';
import { ISyntaxProtheusDoc } from '../interfaces/ISyntaxProtheusDoc';
import { SyntaxAdvpl } from './SyntaxAdvpl';
import { ITransformProtheusDoc } from '../interfaces/ITransformProtheusDoc';
import { TransformAdvpl } from './TransformAdvpl';
// import * as systeminformation from 'systeminformation';

export enum ELanguageSupport {
    "advpl" = "advpl",
    "4gl" = "4gl"
}

export class ProtheusDoc {

    private _syntaxSupport: ISyntaxProtheusDoc;
    private _languageId: ELanguageSupport;
    private _transform: ITransformProtheusDoc;

    constructor(languageId: ELanguageSupport, signature: string) {
        this._languageId = languageId;

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

    public getProtheusDoc(): string {
        let bufferDoc = "";

        bufferDoc += this._syntaxSupport.getIdentifier(this._transform.getIdentifierName());
        bufferDoc += this._syntaxSupport.getType(this._transform.getType());
        bufferDoc += this._syntaxSupport.getVersion("12.1.17");
        bufferDoc += this._syntaxSupport.getAuthor("Gabriel Alencar");
        bufferDoc += this._syntaxSupport.getSince("17/01/2020");
        bufferDoc += this._syntaxSupport.getParams(this._transform.getParams());
        bufferDoc += this._syntaxSupport.getReturn(this._transform.getReturn());
        bufferDoc += this._syntaxSupport.getFinisher();

        return bufferDoc;
    }

}