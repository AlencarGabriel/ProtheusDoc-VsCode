import * as vscode from 'vscode';
import * as os from 'os';

/**
 * Classe que implementa recursos úteis da extensão.
 */
export class Utils {

    constructor() {
    }

    private getConfig(): vscode.WorkspaceConfiguration {
        return vscode.workspace.getConfiguration("protheusDoc");
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
        let authorDefault = this.getConfig().get<String>("autor_default");

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
        let versaoDefault = this.getConfig().get<String>("versao_default");

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
        let hiddenMarkers = this.getConfig().get<Array<String>>("marcadores_ocultos");

        if (hiddenMarkers) {
            return hiddenMarkers;
        } else {
            return [];
        }
    }
    
    /**
     * Busca os marcadores que serão ocultados no Hover de documentações.
     */
    public getHiddenMarkersHover(): String[] {
        let hiddenMarkersHover = this.getConfig().get<Array<String>>("marcadores_ocultos_hover");

        if (hiddenMarkersHover) {
            return hiddenMarkersHover;
        } else {
            return [];
        }
    }

    /**
     * Verifica se o usuário deseja que as decorações de atributos ProtheusDoc sejam feitas.
     */
    public getUseDecorator(): boolean {
        let useDecorator = this.getConfig().get<boolean>("usa_decoracao");

        if (useDecorator !== undefined) {
            return useDecorator;
        } else {
            return true;
        }
    }

    /**
     * Verifica se o usuário deseja utilizar a tabela de documentações da Workspace.
     */
    public getWorkspaceDoc(): boolean {
        let useWorkspaceDoc = this.getConfig().get<boolean>("usa_workspace_doc");

        if (useWorkspaceDoc !== undefined) {
            return useWorkspaceDoc;
        } else {
            return true;
        }
    }

    /**
     * Diretório onde a pasta com os arquivos da documentação serão criados.
     */
    public getDirDoc(): string {
        let dirDoc = this.getConfig().get<String>("diretorio_doc");

        if (dirDoc && dirDoc !== "") {
            return dirDoc.trim();
        } else {
            return "";
        }
    }

    /**
     * Nome da pasta que conterá os arquivos da documentação.
     */
    public getFolderDoc(): string {
        let folderDoc = this.getConfig().get<String>("pasta_doc");

        if (folderDoc && folderDoc !== "") {
            return folderDoc.trim();
        } else {
            return "html-out";
        }
    }

    /**
     * get the include/exclude config.
     */
    private getPathes(config: any) {
        return Array.isArray(config) ?
            '{' + config.join(',') + '}'
            : (typeof config === 'string' ? config : '');
    }

    /**
     * Glob Patterns a serem considerados na busca das documentações para montagem da tabela de documentações.
     */
    public getInclude(): string {
        let include = this.getConfig().get("include");

        return this.getPathes(include);
    }

    /**
     * Glob Patterns a serem desconsiderados na busca das documentações para montagem da tabela de documentações.
     */
    public getExclude(): string {
        let exclude = this.getConfig().get("exclude");

        return this.getPathes(exclude);
    }

    /**
     * Busca a quantidade máxima de arquivos que serão varridos para montar a tabela de documentações.
     */
    public getMaxFiles(): number {
        let maxFilesForSearch = this.getConfig().get<number>("maxFilesForSearch");

        if (maxFilesForSearch !== undefined) {
            return maxFilesForSearch;
        } else {
            return 5120;
        }
    }
}