import * as vscode from 'vscode';
import { ETypesDoc } from './ISyntaxProtheusDoc';
import { IParamsProtheusDoc } from './IParamsProtheusDoc';

export interface ITransformProtheusDoc{
    getIdentifierName(): String;
    getType(): ETypesDoc;
    getParams(): IParamsProtheusDoc[] | undefined;
    getReturn(): IParamsProtheusDoc | undefined;
}