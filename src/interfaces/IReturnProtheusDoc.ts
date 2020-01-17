import * as vscode from 'vscode';
import { ETypesAdvpl } from './ISyntaxProtheusDoc';

export interface IReturnProtheusDoc {
    returnType: ETypesAdvpl;
    returnDescription: string;
}