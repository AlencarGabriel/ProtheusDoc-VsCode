import * as vscode from 'vscode';
import { IParamsProtheusDoc } from './IParamsProtheusDoc';
import { IReturnProtheusDoc } from './IReturnProtheusDoc';

export enum ETypesDoc {
    function = "function",
    class = "class",
    method = "method",
    property = "property",
    variable = "variable",
}

export enum ETypesAdvpl {
    N = "numeric",
    C = "character",
    D = "date",
    B = "codeblock",
    L = "logical",
    A = "array",
    O = "object",
    H = "variadic",
    U = "param_type"
}

export function convertTypeAdvpl(type: String): ETypesAdvpl {
    switch (type.toUpperCase()) {
        case "N":
            return ETypesAdvpl.N;

        case "C":
            return ETypesAdvpl.C;

        case "D":
            return ETypesAdvpl.D;

        case "B":
            return ETypesAdvpl.B;

        case "L":
            return ETypesAdvpl.L;

        case "A":
            return ETypesAdvpl.A;

        case "O":
            return ETypesAdvpl.O;

        case "H":
            return ETypesAdvpl.H;

        default:
            // console.log("Type '" + type + "' is not implemented.");
            return ETypesAdvpl.U;
    }
}

export interface ISyntaxProtheusDoc {
    getIdentifier(functionName: String): String;
    getType(type: ETypesDoc): String;
    getAuthor(name: String): String;
    getSince(date?: Date|String): String;
    // getSince(date?: String): String;
    getVersion(version: String): String;
    getParams(params?: IParamsProtheusDoc[]): String;
    getReturn(param?: IReturnProtheusDoc): String;
    getFinisher(): String;
}