import * as vscode from 'vscode';
import { ETypesAdvpl } from './ISyntaxProtheusDoc';

export interface IParamsProtheusDoc {
    paramName: string;
    paramType: ETypesAdvpl;
    paramDescription: string;
}