
// tslint:disable-next-line:max-line-length
import { ChangeLogItem, ChangeLogKind, ContentProvider, Header, Image, Sponsor } from "./vscode-whats-new/ContentProvider";

export class WhatsNewDocContentProvider implements ContentProvider {

    public provideHeader(logoUrl: string): Header {
        return <Header>{
            logo: <Image>{ src: logoUrl, height: 50, width: 50 },
            message: `<b>ProtheusDoc for VsCode</b> é uma extensão de suporte aos recursos e snippets de documentação TOTVS ProtheusDoc para VsCode.
                      Ela detecta a sintaxe da função, método ou classe e gera uma documentação dinâmica no formato ProtheusDoc. 
                      Saiba mais em <a href="https://gabrielalencar.dev/2020/01/29/ProtheusDoc-for-VsCode/">meu blog</a>.`,
            notice: `Graças ao apoio da comunidade, a documentação em HTML para o VsCode estará disponível em breve. 
                     <a href="https://github.com/robsonrosilva/protheusDoc">Veja aqui</a>.`};
    }

    public provideChangeLog(): ChangeLogItem[] {
        const changeLog: ChangeLogItem[] = [];

        changeLog.push({
            kind: ChangeLogKind.CHANGED, message: `Apresentar <b>decoração</b> apenas em fontes AdvPL - (<a title=\"Open Issue #18\" 
                href=\"https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/18\">Issue #18</a>)`
        });

        changeLog.push({
            kind: ChangeLogKind.FIXED, message: `Extensão não funciona em sistemas operacionais <b>case sensitive</b> - (<a title=\"Open Issue #21\" 
                href=\"https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/21\">Issue #21</a>)`
        });
        
        changeLog.push({
            kind: ChangeLogKind.FIXED, message: `<b>Documentation Hover</b> apresentando somente funções do próprio fonte - (<a title=\"Open Issue #19\" 
                href=\"https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/19\">Issue #19</a>)`
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