import * as vscode from 'vscode';
import { ETypesDoc } from './ISyntaxProtheusDoc';
import { IParamsProtheusDoc } from './IParamsProtheusDoc';
import { IReturnProtheusDoc } from './IReturnProtheusDoc';

export interface ITransformProtheusDoc{
    getIdentifierName(): String;
    getType(): ETypesDoc;
    getParams(): IParamsProtheusDoc[] | undefined;
    getReturn(): IReturnProtheusDoc | undefined;
}