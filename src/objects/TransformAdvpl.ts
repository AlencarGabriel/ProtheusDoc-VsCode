import * as vscode from 'vscode';
import { ITransformProtheusDoc } from '../interfaces/ITransformProtheusDoc';
import { ETypesDoc, ETypesAdvpl, convertTypeAdvpl } from '../interfaces/ISyntaxProtheusDoc';
import { IParamsProtheusDoc } from '../interfaces/IParamsProtheusDoc';

/**
 * Implementa a interface para transformar a sintaxe da Assinatura AdvPL para ProtheusDod.
 */
export class TransformAdvpl implements ITransformProtheusDoc {
    private _expressionFunction: RegExp;
    private _expressionMethod: RegExp;
    private _expressionClass: RegExp;
    private _expressionParam: RegExp;

    private _functionSignature: String;
    private _identifierName: String;
    private _type: ETypesDoc;
    private _params?: IParamsProtheusDoc[];
    private _return?: IParamsProtheusDoc;


    constructor(functionSignature: string) {

        if (functionSignature.trim() === "") {
            throw new Error("Signature not informed");
        }

        this._identifierName = "";
        this._type = ETypesDoc.function;
        this._functionSignature = functionSignature;

        // Definição da sintaxe das assinaturas AdvPL
        this._expressionFunction = /((User|Static) Function)(([^:\/]+)(\([^:\/]*\))|([^:\/]\S+))(\sAs\s[^:\/]+)?/mi;
        this._expressionMethod = / /;
        this._expressionClass = / /;
        this._expressionParam = /(\w+)\sAs\s(\w+)|As\s(\w+)/i;

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
    getReturn(): IParamsProtheusDoc | undefined {
        return this._return;
    }

    /**
     * Transforma a sintaxe AdvPL em formato ProtheusDoc conforme Interface
     */
    private toBreak() {
        let match: RegExpMatchArray | null;
        let signatureOriginal = this._functionSignature.trim();
        let signatureChanged = this._functionSignature.toLowerCase().trim();
        let signatureParams = "";
        let start = 0;
        let end = 0;
        let length = 0;

        // Expressão para tratar função com Tipo de Dados ou não
        // /((User|Static) Function)(([^:\/]+)(\([^:\/]*\))|([^:\/]\S+))(\sAs\s[^:\/]+)?/mi

        // Expressão para tratar os Tipos (As) dos parâmetros
        // \w+\sAs\s\w+ ou (\w+)\sAs\s(\w+) [Analisar uso deste segundo...]

        // Estrutura da expressão para assinatura: User Function fTeste3 (data as Data) as Character
        // [0]: "User Function fTeste3 (data as Data) as Character"
        // [1]: "User Function"
        // [2]: "User"
        // [3]: " fTeste3 (data as Data)"
        // [4]: " fTeste3 "
        // [5]: "(data as Data)"
        // [6]: undefined
        // [7]: " as Character"

        // Estrutura da expressão para assinatura: User Function fTeste3 as Character
        // [0]: "User Function fTeste3 as Character"
        // [1]: "User Function"
        // [2]: "User"
        // [3]: " fTeste3"
        // [4]: undefined
        // [5]: undefined
        // [6]: " fTeste3"
        // [7]: " as Character"

        // Estrutura da expressão para assinatura: User Function fTeste3 (data as Data)
        // [0]: "User Function fTeste3 (data as Data)"
        // [1]: "User Function"
        // [2]: "User"
        // [3]: " fTeste3 (data as Data)"
        // [4]: " fTeste3 "
        // [5]: "(data as Data)"
        // [6]: undefined
        // [7]: undefined

        if (signatureOriginal.match(this._expressionFunction)) {
            match = signatureOriginal.match(this._expressionFunction);

            if (match) {
                // Define o tipo Função
                this._type = ETypesDoc.function;

                // Captura o nome da função
                this._identifierName = match[4] === undefined ? match[3].trim() : match[4].trim();

                // Adiciona o Return da função
                if (match[7]) {
                    this._return = this.matchParam(match[7].trim(), true);
                } else {
                    this._return = { paramType: ETypesAdvpl.U, paramDescription: "return_description" };
                }

                // Caso a função tenha parâmetros, trata os parâmetros
                if (match[5]) {

                    // Retira os parêntesis dos parâmetros
                    signatureParams = match[5].trim().replace(/\(|\)/gi, "");

                    // Quebra os parâmetros em formato ProtheusDoc
                    this._params = this.toParamBreak(signatureParams);
                }
            }
        }

        // Tratamento para caso de assinatura do tipo "Função"
        // "function " === 9 caracteres + 1 espaço
        // if (signatureChanged.indexOf("function ") > 0) {
        //     length = signatureChanged.length;
        //     start = signatureChanged.indexOf("function ");

        //     // O fim da assinatura da função pode ser o parêntesis dos parâmetros ou o final do arquivo
        //     end = signatureChanged.indexOf("(") > 0 ? signatureChanged.indexOf("(") : length;

        //     // Define o tipo Função
        //     this._type = ETypesDoc.function;

        //     // Captura o nome da função
        //     this._identifierName = signatureOriginal.substr(start + 9, end - start - 9).trim();

        //     // Adiciona o Return da função (ainda não é inteligente)
        //     this._return = { paramType: ETypesAdvpl.U, paramDescription: "return_description" };

        //     // Caso a função tenha parâmetros, trata os parâmetros
        //     if (signatureChanged.indexOf("(") > 0 && signatureChanged.indexOf("()") <= 0) {
        //         start = signatureChanged.indexOf("(");
        //         end = signatureChanged.indexOf(")");

        //         // Captura o bloco de assinatura dos parâmetros
        //         signatureParams = signatureOriginal.substr(start + 1, end - start - 1).trim();

        //         // Quebra os parâmetros em formato ProtheusDoc
        //         this._params = this.toParamBreak(signatureParams);
        //     }
        // }

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
                paramsMap.push(this.matchParam(param));
            }
        );

        return paramsMap;
    }

    /**
     *
     * @param param Trata cada parâmetro na sintaxe AdvPL para os itens do marcador Param/Return.
     * @param isReturn Define que o tratamento será para um marcador Return
     */
    private matchParam(param: String, isReturn: boolean = false): IParamsProtheusDoc {

        let paramameter = param.match(this._expressionParam);

        if (paramameter) {

            return {
                paramName: paramameter[1] === undefined ? "" : paramameter[1].trim(),
                paramType: convertTypeAdvpl(paramameter[3] === undefined ? paramameter[2].trim() : paramameter[3].trim(), false),
                paramDescription: isReturn ? "return_description" : "param_description"
            };

        } else {
            return {
                paramName: param.trim(),
                paramType: convertTypeAdvpl(param.trim().charAt(0)),
                paramDescription: isReturn ? "return_description" : "param_description"
            };
        }


    }

}