import * as vscode from 'vscode';
import { ELanguageSupport, ProtheusDoc } from './objects/ProtheusDoc';
import { ProtheusDocCompletionItem } from './objects/ProtheusDocCompletionItem';
import { ProtheusDocDecorator } from './objects/ProtheusDocDecorator';
import { Documentation, ProtheusDocToDoc } from './objects/Documentation';
import { Utils } from './objects/Utils';
import { WhatsNewDocContentProvider } from './whatsNew';
import { WhatsNewManager } from './vscode-whats-new/Manager';

let documentations: Documentation[];

export function activate(context: vscode.ExtensionContext) {

	console.log("protheusdoc-vscode has activated.");

	let decorator = new ProtheusDocDecorator();

	documentations = new Array<Documentation>();

	decorator.triggerUpdateDecorations();

	context.subscriptions.push(addDocBlock());
	context.subscriptions.push(updateTableDoc());

	vscode.languages.registerHoverProvider('advpl', {
		provideHover(document: vscode.TextDocument, position: vscode.Position, _token: vscode.CancellationToken) {
			let symbol = document.getText(document.getWordRangeAtPosition(position));
			let _docs = new Array<vscode.MarkedString>();

			// Tratamento para User Functions
			// tslint:disable-next-line: curly
			if (symbol.toUpperCase().startsWith("U_"))
				symbol = symbol.substr(2);

			// Filtra a ocorrência do Hover na tabela de documentações
			let documentation = documentations.filter(doc => doc.identifier.trim().toUpperCase() === symbol.trim().toUpperCase());

			if (documentation) {

				// Verifica se existe documentação do identificador no arquivo atual (Static Function/Method)
				let docInFile = documentation.filter(doc => doc.file.fsPath === document.uri.fsPath);

				// Se a documentação estiver definida no fonte posicionado, retorna somente do fonte atual
				if (docInFile.length > 0) {
					docInFile.forEach(doc => { _docs.push(doc.getHover()); });
				} else {
					// Se a documentação não estiver definida no fonte atual, lista todas as ocorrências caso exista
					documentation.forEach(doc => { _docs.push(doc.getHover()); });
				}
			}

			return new vscode.Hover(_docs);
		}
	});

	context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
		["advpl"],
		{
			provideCompletionItems: (document: vscode.TextDocument, position: vscode.Position, _token: vscode.CancellationToken) => {
				const line = document.lineAt(position.line).text;
				const prefix = line.slice(0, position.character);

				if (prefix.match(/^\s*pdoc|prot|add\w*$/i)) {
					return [new ProtheusDocCompletionItem(document, position)];
				} else {
					return;
				}

			}
		}));

	vscode.window.onDidChangeActiveTextEditor(editor => {

		if (editor) {
			decorator.triggerUpdateDecorations();

			searchProtheusDocInFile(editor.document.getText(), editor.document.uri);
		}

	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {

		if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {
			decorator.triggerUpdateDecorations();

			searchProtheusDocInFile(event.document.getText(), event.document.uri);
		}

	}, null, context.subscriptions);

	vscode.workspace.onDidChangeWorkspaceFolders(event => {

		// Limpa a tabela de documentações do Workspace
		documentations.splice(0, documentations.length);

		// Atualiza tabela de documentações do Workspace
		searchProtheusDoc();

	}, null, context.subscriptions);

	// Provider What's new
	const providerWhatsNew = new WhatsNewDocContentProvider();
	const viewer = new WhatsNewManager(context).registerContentProvider("protheusdoc-vscode", providerWhatsNew);

	// show the page (if necessary)
	viewer.showPageInActivation();

	// register the additional command (not really necessary, unless you want a command registered in your extension)
	context.subscriptions.push(vscode.commands.registerCommand("protheusdoc.whatsNew", () => viewer.showPage()));

	// Atualiza tabela de documentações do Workspace
	searchProtheusDoc();

}

/**
 * Busca todas as ocorreências de ProtheusDoc de um texto (arquivo) 
 * e adiciona na tabela de Documentações da extensão
 * @param text Texto do documento a ser verificado os blocos ProtheusDoc
 * @param uri URI do arquivo em questão
 */
export function searchProtheusDocInFile(text: string, uri: vscode.Uri) {
	let expressionProtheusDoc = /(\{Protheus\.doc\}\s*)([^*]*)(\n[^:\n]*)/mig;
	let match = text.match(expressionProtheusDoc);

	// Remove todas as referências de documentação do arquivo aberto
	documentations = documentations.filter(doc => doc.file.fsPath !== uri.fsPath);

	if (match) {
		// Percorre via expressão regular todas as ocorrencias de ProtheusDoc no arquivo.
		match.forEach(element => {
			let doc = new ProtheusDocToDoc(element, uri).getDocumentation();
			let docIndex = documentations.findIndex(e => e.identifier.trim().toUpperCase() === doc.identifier.trim().toUpperCase());

			// Caso a documentação já exista na lista altera
			// if (docIndex >= 0) {
			// documentations[docIndex] = doc;
			// } else {
			documentations.push(doc);
			// }
		});
	}
}

/**
 * Registra o bloco de comando a ser executado quando este for chamado.
 */
export function addDocBlock() {
	let disposable = vscode.commands.registerTextEditorCommand('protheusdoc.addDocBlock', (textEditor, _edit) => {

		// Trata a linguagem e chama a função que interpreta a sintaxe desta
		if (textEditor.document.languageId === ELanguageSupport.advpl) {
			findAdvpl(textEditor, true);
		} else {
			vscode.window.showErrorMessage("A linguagem " + textEditor.document.languageId + " não é tratada pela Extensão.");
		}

	});

	return disposable;
}

/**
 * Registra o bloco de comando a ser executado quando este for chamado.
 */
export function updateTableDoc() {
	let disposable = vscode.commands.registerTextEditorCommand('protheusdoc.updateTableDoc', (_textEditor, _edit) => {

		searchProtheusDoc();

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
	// Valida tambem se a navegação chegou no fim do arquivo
	while (!found && activeLine < document.lineCount) {
		let line = document.lineAt(activeLine);

		// Não considera linhas vazias ou que não iniciem com o tipo Function, Method ou Class
		if (!line.isEmptyOrWhitespace &&
			line.text.trim().match(/((User |Static )?Function \s*)([^:\/]+)*$|Method ([^:\/]+)*$|Class \s*[\w+\-\_]*(\s* From \s*[\w+\-\_]*)?$/i)) {

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

/**
 * Busca as documentações ProtheusDoc em toda a Workspace.
 */
export function searchProtheusDoc() {
	let util = new Utils();
	let includePattern = util.getInclude();
	let excludePattern = util.getExclude();
	let limitationForSearch = util.getMaxFiles();
	let useWorkspaceDoc = util.getWorkspaceDoc();

	// Verifica se o usuário deseja utilizar a tabela de documentações da Workspace
	if (!useWorkspaceDoc) {
		return;
	}

	vscode.window.withProgress({
		location: vscode.ProgressLocation.Window,
		title: "Atualizando documentações...",
		cancellable: false
	}, (progress, token) => {

		token.onCancellationRequested(() => {
			vscode.window.showWarningMessage("Atualização de documentações cancelada.");
		});

		return new Promise(resolve => {

			vscode.workspace.findFiles(includePattern, excludePattern, limitationForSearch).then(files => {

				files.forEach(file => {
					vscode.workspace.openTextDocument(file).then(textFile => {
						searchProtheusDocInFile(textFile.getText(), textFile.uri);
					});
				});

				resolve();
			});

		});
	});

}

// this method is called when your extension is deactivated
export function deactivate() { }
