import * as vscode from 'vscode';
import { ELanguageSupport, ProtheusDoc } from './objects/ProtheusDoc';
import { ProtheusDocCompletionItem } from './objects/ProtheusDocCompletionItem';

export function activate(context: vscode.ExtensionContext) {

	context.subscriptions.push(addDocBlock());

	// TODO: Implementar Hover detectando a documentação das funções.
	// TODO: Implementar progress na status bar, enquanto carrega as documentações ProtheusDoc.
	// vscode.languages.registerHoverProvider('advpl', {
	// 	provideHover(document, position, token) {
	// 		console.log("Hover!!");
	// 		return new vscode.Hover('I am a hover!');
	// 	}
	// });

	context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
		["advpl"],
		{
			provideCompletionItems: (document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) => {
				const line = document.lineAt(position.line).text;
				const prefix = line.slice(0, position.character);

				if (prefix.match(/^\s*pdoc|prot|add\w*$/i)) {
					return [new ProtheusDocCompletionItem(document, position)];
				} else {
					return;
				}

			}
		}));
}

/**
 * Registra o bloco de comando a ser executado quando este for chamado.
 */
export function addDocBlock() {
	let disposable = vscode.commands.registerTextEditorCommand('protheusdoc.addDocBlock', (textEditor, edit) => {

		// Trata a linguagem e chama a função que interpreta a sintaxe desta
		if (textEditor.document.languageId === ELanguageSupport.advpl.toString()) {
			findAdvpl(textEditor, true);
		} else {
			vscode.window.showErrorMessage("A linguagem " + textEditor.document.languageId + " não é tratada pela Extensão.");
		}

	});

	return disposable;
}

/**
 * Busca a assinatura na sintaxe AdvPL e trata para as classes que geram o ProtheusDoc
 * @param textEditor Editor ativo do VsCode.
 * @param hasCommand Identifica a origem da chamada do comando (caso seja via Snippet, o tratamento é com retorno, se não com comando).
 */
export function findAdvpl(textEditor: vscode.TextEditor, hasCommand: boolean = false): string | vscode.SnippetString | undefined {
	let document = textEditor.document;
	let activeLine = textEditor.selection.active.line;
	let found = false;
	let signature = "";
	let multiLine = 0;
	let linesSkiped = 0;
	let limitSkipLines = 3;

	// Enquanto não encontrar uma assinatura de função, método ou classe, busca na próxima linha
	while (!found) {
		let line = document.lineAt(activeLine);

		// Não considera linhas vazias ou que não iniciem com o tipo Function, Method ou Class
		if (!line.isEmptyOrWhitespace &&
			line.text.trim().match(/((User |Static )?Function \s*)([^:\/]+)*$|Method ([^:\/]+)*$|Class \s*[\w+\-\_]*$/i)) {

			// Encontrou a assinatura
			found = true;

			// Retira o identificador de quebra de linha da assinatura da função
			signature = document.lineAt(activeLine).text.trim().replace(";", "");

			multiLine = activeLine;

			// Tratamento para caso de quebra de linha na assinatura
			while (document.lineAt(multiLine).text.includes(";")) {
				multiLine++;

				signature += document.lineAt(multiLine).text.trim().replace(";", "");
			}

		} else {
			activeLine++;
			linesSkiped++;
		}

		// Limita a quantidade de linhas que a função irá percorrer até encontrar uma assinatura (evitar loops infinitos)
		if (linesSkiped >= limitSkipLines) {
			break;
		}

	}

	if (found) {
		// Captura a linha anterior a assinatura encontrada
		let newPosition = new vscode.Position(activeLine === 0 ? 0 : activeLine - 1, 0);

		// Instancia a classe que irá gerar o bloco de acordo com a linguagem
		let protheusDoc = new ProtheusDoc(ELanguageSupport.advpl, signature);

		// Se a chamada for por comando, insere o Snippet via comando do Editor de Texto
		if (hasCommand) {
			// Insere o Snippet na posição anterior a assinatura (trata quando a assinatura é a primeira linha "activeLine === 0")
			textEditor.insertSnippet(new vscode.SnippetString(protheusDoc.getProtheusDoc() + (activeLine === 0 ? "\n" : "")), newPosition);
		} else { // Se não devolve como retorno para que a classe completion resolva.
			return new vscode.SnippetString(protheusDoc.getProtheusDoc() + (activeLine === 0 ? "\n" : ""));
		}

	} else {
		return "";
	}
}

// this method is called when your extension is deactivated
export function deactivate() { }
