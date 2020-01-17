import * as vscode from 'vscode';
import { ISyntaxProtheusDoc, ETypesDoc, ETypesAdvpl } from '../interfaces/ISyntaxProtheusDoc';
import { IParamsProtheusDoc } from '../interfaces/IParamsProtheusDoc';
import { IReturnProtheusDoc } from '../interfaces/IReturnProtheusDoc';

export class SyntaxAdvpl implements ISyntaxProtheusDoc {

    constructor() {
    }

    public getIdentifier(functionName: String): String {
        return "/*/{Protheus.doc} " + functionName + "\n\n";
    }

    public getType(type: ETypesDoc): String {
        return "@type " + type.toString() + "\n";
    }

    public getAuthor(name: String): String {
        return "@author " + name + "\n";
    }

    public getSince(date: Date): String {
        return "@since " + date.toLocaleDateString() + "\n";
    }

    public getVersion(version: String): String {
        return "@version " + version + "\n";
    }

    public getParams(params?: IParamsProtheusDoc[]): String {
        let result = "";

        if (params) {
            params.forEach(element => {
                result += "@param " + element.paramName + ", " + element.paramType.toString() + ", " + element.paramDescription + "\n";
            });
        }

        return result;
    }

    public getReturn(param?: IReturnProtheusDoc): String {

        if (param) {
            return "@return " + param.returnType.toString() + ", " + param.returnDescription + "\n";
        }else{
            return "";
        }
    }

    public getFinisher(): String {
        return "/*/";
    }
}