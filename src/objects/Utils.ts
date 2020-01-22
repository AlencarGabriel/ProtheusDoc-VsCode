import * as vscode from 'vscode';
import * as os from 'os';

/**
 * Classe que implementa recursos úteis da extensão.
 */
export class Utils {
    private _config: vscode.WorkspaceConfiguration;

    constructor() {
        this._config = vscode.workspace.getConfiguration("protheusDoc");
    }

    /**
     * Busca a codificação utilizada.
     * @obs Ainda não há uma API que retorna a codigicação do fonte aberto.
     * @obs Caso necessário, transformar esta configuração em parâmetro.
     */
    public getEncoding(): string {
        return "windows1252";
    }

    /**
     * Busca o Autor padrão do documento.
     * @obs Caso não esteja nas configurações, retorna o usuário do SO.
     */
    public getAuthor(): string {
        let authorDefault = this._config.get<String>("autor_default");

        // Verifica se o usuário setou um autor default
        if (authorDefault && authorDefault !== "") {
            return authorDefault.trim();
        }
        else {
            return os.userInfo({ encoding: this.getEncoding() }).username;
        }
    }

    /**
     * Busca a versão padrão do identificador.
     */
    public getVersion(): string {
        let versaoDefault = this._config.get<String>("versao_default");

        // Verifica se o usuário setou uma versão default
        if (versaoDefault && versaoDefault !== "") {
            return versaoDefault.trim();
        }
        else {
            return "";
        }
    }

    /**
     * Busca os marcadores não obrigatórios que não serão
     *  adicionados nas documentações do ProtheusDoc.
     */
    public getHiddenMarkers(): String[] {
        let hiddenMarkers = this._config.get<Array<String>>("marcadores_ocultos");

        if (hiddenMarkers) {
            return hiddenMarkers;
        } else {
            return [];
        }
    }
}