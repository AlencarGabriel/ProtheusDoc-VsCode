import * as vscode from 'vscode';
import { ITransformProtheusDoc } from '../interfaces/ITransformProtheusDoc';
import { ETypesDoc, ETypesAdvpl, convertTypeAdvpl } from '../interfaces/ISyntaxProtheusDoc';
import { IParamsProtheusDoc } from '../interfaces/IParamsProtheusDoc';
import { IReturnProtheusDoc } from '../interfaces/IReturnProtheusDoc';

/**
 * Implementa a interface para transformar a sintaxe da Assinatura AdvPL para ProtheusDod.
 */
export class TransformAdvpl implements ITransformProtheusDoc {
    private _functionSignature: String;
    private _identifierName: String;
    private _type: ETypesDoc;
    private _params?: IParamsProtheusDoc[];
    private _return?: IReturnProtheusDoc;

    constructor(functionSignature: string) {

        if (functionSignature.trim() === "") {
            throw new Error("Signature not informed");
        }

        this._identifierName = "";
        this._type = ETypesDoc.function;
        this._functionSignature = functionSignature;

        // Quebra a assinatura numa estrutura de ProtheusDoc
        this.toBreak();
    }

    /**
     * Retorna o identificador da Função, Método ou Classe
     */
    getIdentifierName(): String {
        return this._identifierName;
    }

    /**
     * Retorna o tipo da assinatura Função, Método ou Classe
     */
    getType(): ETypesDoc {
        return this._type;
    }

    /**
     * Retorna os parâmetros da Função ou Método
     */
    getParams(): IParamsProtheusDoc[] | undefined {
        return this._params;
    }

    /**
     * Retorna a estrutura do Return
     * @obs Ainda não é inteligente, mas no futuro com LS pode-se interpretar o tipo de retorno da função.
     */
    getReturn(): IReturnProtheusDoc | undefined {
        return this._return;
    }

    /**
     * Transforma a sintaxe AdvPL em formato ProtheusDoc conforme Interface
     */
    private toBreak() {
        let signatureOriginal = this._functionSignature.trim();
        let signatureChanged = this._functionSignature.toLowerCase().trim();
        let signatureParams = "";
        let start = 0;
        let end = 0;
        let length = 0;

        // Tratamento para caso de assinatura do tipo "Função"
        // "function " === 9 caracteres + 1 espaço
        if (signatureChanged.indexOf("function ") > 0) {
            length = signatureChanged.length;
            start = signatureChanged.indexOf("function ");

            // O fim da assinatura da função pode ser o parêntesis dos parâmetros ou o final do arquivo
            end = signatureChanged.indexOf("(") > 0 ? signatureChanged.indexOf("(") : length;

            // Define o tipo Função
            this._type = ETypesDoc.function;

            // Captura o nome da função
            this._identifierName = signatureOriginal.substr(start + 9, end - start - 9).trim();

            // Adiciona o Return da função (ainda não é inteligente)
            this._return = { returnType: ETypesAdvpl.U, returnDescription: "return_description" };

            // Caso a função tenha parâmetros, trata os parâmetros
            if (signatureChanged.indexOf("(") > 0 && signatureChanged.indexOf("()") <= 0) {
                start = signatureChanged.indexOf("(");
                end = signatureChanged.indexOf(")");

                // Captura o bloco de assinatura dos parâmetros
                signatureParams = signatureOriginal.substr(start + 1, end - start - 1).trim();

                // Quebra os parâmetros em formato ProtheusDoc
                this._params = this.toParamBreak(signatureParams);
            }
        }

        //TODO: Tratar Método

        //TODO: Tratar Classe
    }

    /**
     * Quebra os parâmetros em formato ProtheusDoc
     * @param paramSignature Assinatura completa dos parâmetros da função ou método
     */
    private toParamBreak(paramSignature: String): IParamsProtheusDoc[] {
        // Em AdvPL os parâmetros são separados por virgulas
        let params = paramSignature.split(",");
        let paramsMap = new Array<IParamsProtheusDoc>();

        // Mapeia todos os parâmetros encontratos, e converte para estrutura de ProtheusDoc
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