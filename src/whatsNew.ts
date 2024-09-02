
// tslint:disable-next-line:max-line-length
import { ChangeLogItem, ChangeLogKind, ContentProvider, Header, Image, Sponsor } from "./vscode-whats-new/ContentProvider";

export class WhatsNewDocContentProvider implements ContentProvider {

	public provideHeader(logoUrl: string): Header {
		return <Header>{
			logo: <Image>{ src: logoUrl, height: 50, width: 50 },
			message: `<b>ProtheusDoc for VsCode</b> é uma extensão de suporte aos recursos e snippets de documentação TOTVS ProtheusDoc para VsCode.
					  Ela detecta a sintaxe da função, método ou classe e gera uma documentação dinâmica no formato ProtheusDoc.
					  Saiba mais <a href="https://gabrielalencar.dev/2020/01/29/ProtheusDoc-for-VsCode/">neste post</a>.`,
			notice: `As documentações ProtheusDoc são diagnosticadas! Caso estejam em desacordo com a convenção, Warnings serão apresentados.
					 <a href="https://github.com/AlencarGabriel/ProtheusDoc-VsCode/wiki/Diagnóstico-das-documentações">Saiba mais</a>.<br><br>
					 Já conhece a nossa <b>comunidade de discussões</b>? <a href="https://github.com/AlencarGabriel/ProtheusDoc-VsCode/discussions">Acesse-a</a>
					 e veja os artigos e discussões sobre esta extensão. Faça parte você também!`};
	}

	public provideChangeLog(): ChangeLogItem[] {
		const changeLog: ChangeLogItem[] = [];

		// changeLog.push({
		//     kind: ChangeLogKind.CHANGED, message: `Adicionar sugestão de versão no <b>@version</b> gerado automaticamente - (<a title=\"Open Issue #44\"
		//         href=\"https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/44\">Issue #44</a>)`
		// });

		// changeLog.push({
		//     kind: ChangeLogKind.NEW, message: `Implementado tratamento para uso e funcionamento do <b>parâmetro opcional</b> nas documentações ProtheusDoc - (<a title=\"Open Issue #50\"
		//     href=\"https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/50\">Issue #50</a> | <a title=\"Documentação da Feature\"
		//         href=\"https://github.com/AlencarGabriel/ProtheusDoc-VsCode/wiki/Hover-de-documenta%C3%A7%C3%B5es#par%C3%A2metros-opcionais\">Documentação</a>)`
		// });

		changeLog.push({
			kind: ChangeLogKind.CHANGED, message: `Atualizado lista de releases Protheus na configuração <b>protheusDoc.versao_default</b> - <a title=\"Open Pull Request #88\"
				href=\"https://github.com/AlencarGabriel/ProtheusDoc-VsCode/pull/88\">Saiba mais</a>.`
		});

		changeLog.push({
			kind: ChangeLogKind.FIXED, message: `Sintaxe incorreta na busca da tipagem de retorno dos métodos - <a title=\"Open Issue #72\"
				href=\"https://github.com/AlencarGabriel/ProtheusDoc-VsCode/issues/72\">Saiba mais</a>.`
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