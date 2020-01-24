import * as vscode from 'vscode';
import { IParamsProtheusDoc } from './IParamsProtheusDoc';

export enum ETypesDoc {
    function = "function",
    class = "class",
    method = "method",
    // property = "property",
    // variable = "variable",
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

/**
 * Trata o parâmetro para o tipo de variável correto.
 * @param type Tipo a ser tratado para o Type ETypesAdvpl
 * @param isChar Define se irá comparar pelo primeiro caracter, ou será de forma tipada
 */
export function convertTypeAdvpl(type: String, isChar: boolean = true): ETypesAdvpl {

    if (isChar) {
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
    } else {
        switch (type.toUpperCase()) {
            case ETypesAdvpl.N.toString().toUpperCase():
                return ETypesAdvpl.N;

            case ETypesAdvpl.C.toString().toUpperCase():
                return ETypesAdvpl.C;

            case ETypesAdvpl.D.toString().toUpperCase():
                return ETypesAdvpl.D;

            case ETypesAdvpl.B.toString().toUpperCase():
                return ETypesAdvpl.B;

            case ETypesAdvpl.L.toString().toUpperCase():
                return ETypesAdvpl.L;

            case ETypesAdvpl.A.toString().toUpperCase():
                return ETypesAdvpl.A;

            case ETypesAdvpl.O.toString().toUpperCase():
                return ETypesAdvpl.O;

            case ETypesAdvpl.H.toString().toUpperCase():
                return ETypesAdvpl.H;

            default:
                return ETypesAdvpl.U;
        }
    }
}

export interface ISyntaxProtheusDoc {
    getIdentifier(functionName: String): String;
    getType(type: ETypesDoc): String;
    getAuthor(name: String): String;
    getSince(date?: Date | String): String;
    getVersion(version: String): String;
    getParams(params?: IParamsProtheusDoc[]): String;
    getReturn(param?: IParamsProtheusDoc): String;
    getFinisher(): String;
}