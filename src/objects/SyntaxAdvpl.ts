import * as vscode from 'vscode';
import { ISyntaxProtheusDoc, ETypesDoc, ETypesAdvpl } from '../interfaces/ISyntaxProtheusDoc';
import { IParamsProtheusDoc } from '../interfaces/IParamsProtheusDoc';

/**
 * Implementa a interface para converter a estrutura da assinatura AdvPL para o formato ProtheusDoc AdvPL.
 */
export class SyntaxAdvpl implements ISyntaxProtheusDoc {
    private _countTabStop: number;

    constructor() {
        this._countTabStop = 0;
    }

    /**
     * Transforma uma string em estrutura de Tabulação no formato Snippet do VsCode.
     * @param str String a ser tabulada
     */
    private getTabStop(str: String, choice: boolean = false): String {

        // Implementa o contador de tabulação
        this._countTabStop++;

        // tslint:disable: curly
        // Tratamento para casos onde a string contém choices, para que a tabulação do Snippet funcione corretamente.
        if (!choice)
            return "${" + this._countTabStop.toString() + ":" + str + "}";
        else
            return "${" + this._countTabStop.toString() + "|" + str + "|}";
    }

    /**
     * Retorna o nome do identificador em formato ProtheusDoc para AdvPL.
     * @param identifierName Nome da Função, Método ou Classe
     */
    public getIdentifier(identifierName: String): String {
        this._countTabStop = 0;

        return "/*/{Protheus.doc} " + identifierName + "\n" + this.getTabStop("description") + "\n";
    }

    /**
     * Retorna o tipo do identificador em formato ProtheusDoc para AdvPL.
     * @param type Tipo de documentação tratada pelo ProtheusDoc
     */
    public getType(type: ETypesDoc): String {
        return "@type " + type.toString() + "\n";
    }

    /**
     * Retorna o autor do identificador em formato ProtheusDoc para AdvPL.
     * @param name Autor
     */
    public getAuthor(name: String): String {
        return "@author " + this.getTabStop(name) + "\n";
    }

    /**
     * Retorna a data do identificiador em formato ProtheusDoc para AdvPL.
     * @param date Data em formato Date ou String
     */
    public getSince(date: Date | String): String {

        if (date instanceof Date) {
            return "@since " + this.getTabStop(date.toLocaleDateString()) + "\n";
        } else {
            return "@since " + this.getTabStop(date) + "\n";
        }
    }

    /**
     * Retorna a versão do identificador em formato ProtheusDoc para AdvPL.
     * @param version Versão do identificador
     */
    public getVersion(version: String): String {
        return "@version " + this.getTabStop(version) + "\n";
    }

    /**
     * Retorna os parâmetros do identificador no formato ProtheusDoc para AdvPL.
     * @param params Array de parâmetros
     */
    public getParams(params?: IParamsProtheusDoc[]): String {
        let result = "";

        if (params) {
            params.forEach(element => {
                result += "@param " + element.paramName
                    + ", " + (element.paramType === ETypesAdvpl.U ? this.getTabStop("param_type,numeric,character,date,codeblock,logical,array,object,variadic", true) : element.paramType.toString()) // Tratamento para parâmetros não tratados
                    + ", " + this.getTabStop(element.paramDescription) + "\n";
            });
        }

        return result;
    }

    /**
     * Retorna o "Return" do identificador no formato ProtheusDoc para AdvPL.
     * @param param Estrutura de Retorno
     */
    public getReturn(param?: IParamsProtheusDoc): String {

        if (param) {
            if (param.paramType === ETypesAdvpl.U) {
                return "@return " + this.getTabStop("return_type,numeric,character,date,codeblock,logical,array,object,variadic", true) + ", " + this.getTabStop(param.paramDescription) + "\n";
            } else {
                return "@return " + this.getTabStop(param.paramType.toString()) + ", " + this.getTabStop(param.paramDescription) + "\n";
            }
        } else {
            return "";
        }
    }

    /**
     * Retorna o finalizador da estrutura ProtheusDoc para AdvPL.
     */
    public getFinisher(): String {
        return "/*/";
    }
}