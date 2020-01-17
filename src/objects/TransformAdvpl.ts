import * as vscode from 'vscode';
import { ITransformProtheusDoc } from '../interfaces/ITransformProtheusDoc';
import { ETypesDoc, ETypesAdvpl, convertTypeAdvpl } from '../interfaces/ISyntaxProtheusDoc';
import { IParamsProtheusDoc } from '../interfaces/IParamsProtheusDoc';
import { IReturnProtheusDoc } from '../interfaces/IReturnProtheusDoc';

export class TransformAdvpl implements ITransformProtheusDoc {
    private _functionSignature: String;
    private _identifierName: String;
    private _type: ETypesDoc;
    private _params?: IParamsProtheusDoc[];
    private _return?: IReturnProtheusDoc;

    constructor(functionSignature: string) {
        this._functionSignature = functionSignature;
        this._identifierName = "";
        this._type = ETypesDoc.function;

        // Quebra a assinatura numa estrutura de ProtheusDoc
        this.toBreak();
    }

    getIdentifierName(): String {
        return this._identifierName;
    }

    getType(): ETypesDoc {
        return this._type;
    }

    getParams(): IParamsProtheusDoc[] | undefined {
        return this._params;
    }

    getReturn(): IReturnProtheusDoc | undefined {
        return this._return;
    }

    private toBreak() {
        let signatureOriginal = this._functionSignature.trim();
        let signatureChanged = this._functionSignature.toLowerCase().trim();
        let signatureParams = "";
        let start = 0;
        let end = 0;
        let length = 0;

        // Tratamento para Função
        // "function " === 9
        if (signatureChanged.indexOf("function ") > 0) {
            length = signatureChanged.length;
            start = signatureChanged.indexOf("function ");
            end = signatureChanged.indexOf("(") > 0 ? signatureChanged.indexOf("(") - 1 : length;

            this._type = ETypesDoc.function;
            this._identifierName = signatureOriginal.substr(start + 9, end - start - 9).trim();

            if (signatureChanged.indexOf("(") > 0 && signatureChanged.indexOf("()") <= 0) {
                start = signatureChanged.indexOf("(");
                end = signatureChanged.indexOf(")");
                signatureParams = signatureOriginal.substr(start + 1, end - start - 1).trim();

                this._params = this.toParamBreak(signatureParams);
                this._return = { returnType: ETypesAdvpl.U, returnDescription: "return_description" };
            }
        }
    }

    private toParamBreak(paramSignature: String): IParamsProtheusDoc[] {
        let params = paramSignature.split(",");
        let paramsMap = new Array<IParamsProtheusDoc>();

        params.map(
            param => {
                paramsMap.push({
                    paramName: param.trim(),
                    paramType: convertTypeAdvpl(param.trim().charAt(0)),
                    paramDescription: "param_description"
                });
            }
        );

        return paramsMap;
    }

}