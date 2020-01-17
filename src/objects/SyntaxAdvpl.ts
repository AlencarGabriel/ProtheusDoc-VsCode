import * as vscode from 'vscode';
import { ISyntaxProtheusDoc, ETypesDoc, ETypesAdvpl } from '../interfaces/ISyntaxProtheusDoc';
import { IParamsProtheusDoc } from '../interfaces/IParamsProtheusDoc';
import { IReturnProtheusDoc } from '../interfaces/IReturnProtheusDoc';

export class SyntaxAdvpl implements ISyntaxProtheusDoc {
    private _countTabStop: number;

    constructor() {
        this._countTabStop = 0;
    }

    private getTabStop(str: String): String{
        this._countTabStop++;

        return "${" + this._countTabStop.toString() + ":" + str + "}";
    }

    public getIdentifier(functionName: String): String {
        this._countTabStop = 0;

        return "/*/{Protheus.doc} " + functionName + "\n" + this.getTabStop("description") + "\n";
    }

    public getType(type: ETypesDoc): String {
        return "@type " + type.toString() + "\n";
    }

    public getAuthor(name: String): String {
        return "@author " + this.getTabStop(name) + "\n";
    }

    public getSince(date: Date | String): String {

        if (date instanceof Date) {
            return "@since " + this.getTabStop(date.toLocaleDateString()) + "\n";
        } else {
            return "@since " + this.getTabStop(date) + "\n";
        }
    }

    public getVersion(version: String): String {
        return "@version " + this.getTabStop(version) + "\n";
    }

    public getParams(params?: IParamsProtheusDoc[]): String {
        let result = "";

        if (params) {
            params.forEach(element => {
                result += "@param " + element.paramName + ", " + element.paramType.toString() + ", " + this.getTabStop(element.paramDescription) + "\n";
            });
        }

        return result;
    }

    public getReturn(param?: IReturnProtheusDoc): String {

        if (param) {
            return "@return " + this.getTabStop(param.returnType.toString().replace("param", "return")) + ", " + this.getTabStop(param.returnDescription) + "\n";
        } else {
            return "";
        }
    }

    public getFinisher(): String {
        return "/*/";
    }
}