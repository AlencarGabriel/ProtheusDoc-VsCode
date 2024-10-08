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
    private _expressionClassOfMethod: RegExp;

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
        this._expressionFunction = /((User |Static )?Function \s*)(([^:\/]+)(\([^:\/]*\))|([^:\/]\S*))(\s*As [^:\/]+)?/mi;
        this._expressionMethod = /(Method \s*)([^:\/\s\(]*)(\s*\(([^:\/]*)?\)\s*)?(\s* As\s[^:\/]+)?( Class \s*[^:\/]\S+)/mi;
        this._expressionClass = /Class \s*([\w+\-\_*]*)(\s* From \s*[\w+\-\_*]*)?$/i;
        this._expressionParam = /(\w+)\s+As\s+(\w+)|As\s+(\w+)/i;
        this._expressionClassOfMethod = /\sClass\s+(\w+)/i;

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
        let signatureParams = "";

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
        else if (signatureOriginal.match(this._expressionMethod)) {
            // Estrutura da expressão para assinatura: Method _Gabriel (dData as Date, cNome) As Character Class TTeste
            // [0]: "Method _Gabriel (dData as Date, cNome) As Character Class TTeste"
            // [1]: "Method "
            // [2]: "_Gabriel"
            // [3]: " (dData as Date, cNome)"
            // [4]: "dData as Date, cNome"
            // [5]: " As Character"
            // [6]: " Class TTeste"

            // Estrutura da expressão para assinatura: Method _Gabriel (dData as Date, cNome) Class TTeste
            // [0]: "Method _Gabriel (dData as Date, cNome) Class TTeste"
            // [1]: "Method "
            // [2]: "_Gabriel"
            // [3]: " (dData as Date, cNome)"
            // [4]: "dData as Date, cNome"
            // [5]: undefined
            // [6]: " Class TTeste"

            // Estrutura da expressão para assinatura: Method _Gabriel Class TTeste
            // [0]: "Method _Gabriel Class TTeste"
            // [1]: "Method "
            // [2]: "_Gabriel"
            // [3]: undefined
            // [4]: undefined
            // [5]: undefined
            // [6]: " Class TTeste"

            // Estrutura da expressão para assinatura: Method _Gabriel As Character Class TTeste
            // [0]: "Method _Gabriel As Character Class TTeste"
            // [1]: "Method "
            // [2]: "_Gabriel"
            // [3]: undefined
            // [4]: undefined
            // [5]: " As Character"
            // [6]: " Class TTeste"

            match = signatureOriginal.match(this._expressionMethod);

            if (match) {

                // Define o tipo Método
                this._type = ETypesDoc.method;

                // Captura o nome do Método
                this._identifierName = match[2].trim();

                let classOfMethod = this.matchClassOfMethod(match[6]);

                if (classOfMethod) {
                    this._identifierName = classOfMethod + "::" + this._identifierName;
                }

                // Adiciona o Return do Método
                if (match[5]) {
                    this._return = this.matchParam(match[5].trim(), true);
                } else {
                    this._return = { paramType: ETypesAdvpl.U, paramDescription: "return_description" };
                }

                // Caso o Método tenha parâmetros, trata os parâmetros
                if (match[3]) {

                    // Retira os parêntesis dos parâmetros
                    signatureParams = match[3].trim().replace(/\(|\)/gi, "");

                    // Quebra os parâmetros em formato ProtheusDoc
                    this._params = this.toParamBreak(signatureParams);
                }
            }

        } else {
            // Estrutura da expressão para assinatura: CLASS MSCBZPL
            // [0]: "CLASS MSCBZPL"
            // [1]: "MSCBZPL"

            if (signatureOriginal.match(this._expressionClass)) {
                match = signatureOriginal.match(this._expressionClass);

                if (match) {

                    // Define o tipo Classe
                    this._type = ETypesDoc.class;

                    // Captura o nome da Classe
                    this._identifierName = match[1];
                }
            }
        }

    }

    /**
     * Quebra os parâmetros em formato ProtheusDoc
     * @param paramSignature Assinatura completa dos parâmetros da função ou método
     */
    private toParamBreak(paramSignature: String): IParamsProtheusDoc[] | undefined {
        // Em AdvPL os parâmetros são separados por virgulas
        let params = paramSignature.split(",");
        let paramsMap = new Array<IParamsProtheusDoc>();

        // Mapeia todos os parâmetros encontratos, e converte para estrutura de ProtheusDoc
        if (params.length > 0 && params[0] !== "") {

            params.map(
                param => {
                    paramsMap.push(this.matchParam(param));
                }
            );

            return paramsMap;
        }
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

    /**
     * Para métodos é necessário complementar o identificador com o nome da classe.
     * @param signature Assinatuda do Método da Classe: "Class XXXXX"
     */
    private matchClassOfMethod(signature: String): String | undefined {
        let classOfMethod = signature.match(this._expressionClassOfMethod);

        if (classOfMethod) {
            return classOfMethod[1].trim();
        }
    }

}