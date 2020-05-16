
// tslint:disable-next-line:max-line-length
import { ChangeLogItem, ChangeLogKind, ContentProvider, Header, Image, Sponsor } from "./vscode-whats-new/ContentProvider";

export class WhatsNewDocContentProvider implements ContentProvider {

    public provideHeader(logoUrl: string): Header {
        return <Header>{
            logo: <Image>{ src: logoUrl, height: 50, width: 50 },
            message: `<b>ProtheusDoc for VsCode</b> é uma extensão de suporte aos recursos e snippets de documentação TOTVS ProtheusDoc para VsCode.
                      Ela detecta a sintaxe da função, método ou classe e gera uma documentação dinâmica no formato ProtheusDoc. 
                      Saiba mais em <a href="https://gabrielalencar.dev/2020/01/29/ProtheusDoc-for-VsCode/">meu blog</a>.`,
            notice: `Agora a <b>Documentação em HTML</b> para o VsCode é oficial! Graças ao apoio da comunidade. 
                     <a href="https://github.com/AlencarGabriel/ProtheusDoc-VsCode/wiki/Documentação-HTML">Veja aqui</a>.`};
    }

    public provideChangeLog(): ChangeLogItem[] {
        const changeLog: ChangeLogItem[] = [];

        changeLog.push({
            kind: ChangeLogKind.NEW, message: `Link da localização posicionar na linha da documentação (Hover) - (<a title=\"Open Issue #16\" 
                href=\"https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/16\">Issue #16</a> | <a title=\"Documentação da Feature\"
                href=\"https://github.com/AlencarGabriel/ProtheusDoc-VsCode/wiki/Hover-de-documentações\">Documentação</a>)`
        });

        changeLog.push({
            kind: ChangeLogKind.NEW, message: `Adicionado configuração para escolher quais atributos serão apresentados no <b>Documentaion Hover</b> - (<a title=\"Open Pull Request #27\" 
                href=\"https://github.com/AlencarGabriel/ProtheusDoc-VsCode/pull/27\">PR #27</a> | <a title=\"Documentação da Feature\"
                href=\"https://github.com/AlencarGabriel/ProtheusDoc-VsCode/wiki/Hover-de-documentações\">Documentação</a>)`
        });

        changeLog.push({
            kind: ChangeLogKind.NEW, message: `Implementado geração da <b>Documentação HTML</b> dos fontes - (<a title=\"Open Pull Request #25\" 
                href=\"https://github.com/AlencarGabriel/ProtheusDoc-VsCode/pull/25\">PR #25</a> | <a title=\"Documentação da Feature\"
                href=\"https://github.com/AlencarGabriel/ProtheusDoc-VsCode/wiki/Documentação-HTML\">Documentação</a>)`
        });

        changeLog.push({
            kind: ChangeLogKind.NEW, message: `Adicionar suporte ao atributo <code>@link</code> - (<a title=\"Open Issue #23\" 
                href=\"https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/23\">Issue #23</a>)`
        });

        changeLog.push({
            kind: ChangeLogKind.CHANGED, message: `Adicionado suporte ao atributo <code>@history</code> no <b>Hover</b> - (<a title=\"Open Issue #17\" 
                href=\"https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/17\">Issue #17</a>)`
        });
        
        changeLog.push({
            kind: ChangeLogKind.FIXED, message: `Erro na detecção de parâmetros - (<a title=\"Open Issue #22\" 
                href=\"https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/22\">Issue #22</a>)`
        });
        
        changeLog.push({
            kind: ChangeLogKind.FIXED, message: `<b>Tabela de documentações</b> ignorando extensão PRW maiúscula - (<a title=\"Open Issue #24\" 
                href=\"https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/24\">Issue #24</a>)`
        });
        
        changeLog.push({
            kind: ChangeLogKind.FIXED, message: `Adopt VS Code's <code>asWebviewUri</code> API  - (<a title=\"Open Issue #28\" 
                href=\"https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/28\">Issue #28</a>)`
        });

        return changeLog;
    }

    public provideSponsors(): Sponsor[] {
        const sponsors: Sponsor[] = [];
        // const sponsorCodeStream: Sponsor = <Sponsor>{
        //     title: "Try Codestream",
        //     link: "https://sponsorlink.codestream.com/?utm_source=vscmarket&utm_campaign=bookmarks&utm_medium=banner",
        //     image: "https://alt-images.codestream.com/codestream_logo_bookmarks.png",
        //     width: 35,
        //     message: `<p>Discussing code is now as easy as highlighting a block and typing a comment right 
        //               from your IDE. Take the pain out of code reviews and improve code quality.</p>`,
        //     extra:
        //         `<a title="Try CodeStream" href="https://sponsorlink.codestream.com/?utm_source=vscmarket&utm_campaign=bookmarks&utm_medium=banner">
        //          Try it free</a>`
        // };
        // sponsors.push(sponsorCodeStream);
        return sponsors;
    }

}