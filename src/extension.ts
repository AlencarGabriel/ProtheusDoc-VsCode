import * as vscode from 'vscode';
import { ELanguageSupport, ProtheusDoc } from './objects/ProtheusDoc';
import { CompletionAddBlock } from './objects/CompletionAddBlock';
import { ProtheusDocDecorator } from './objects/ProtheusDocDecorator';
import { Documentation, ProtheusDocToDoc } from './objects/Documentation';
import { Utils } from './objects/Utils';
import { ProtheusDocHTML } from 'protheusdoc-html/lib';
import { WhatsNewDocContentProvider } from './whatsNew';
import { WhatsNewManager } from './vscode-whats-new/Manager';
import * as fs from 'fs';
import * as path from 'path';
import { ProtheusDocDiagnostics } from './objects/ProtheusDocDiagnostics';

let documentations: Documentation[];
let _wordsDocument: Array<string> = [];

export function activate(context: vscode.ExtensionContext) {

	console.log("protheusdoc-vscode has activated.");

	let decorator = new ProtheusDocDecorator();
	let diagnostics = new ProtheusDocDiagnostics();
	documentations = new Array<Documentation>();
	const collection = vscode.languages.createDiagnosticCollection('ProtheusDoc');

	decorator.triggerUpdateDecorations();

	context.subscriptions.push(addDocBlock());
	context.subscriptions.push(updateTableDoc());
	context.subscriptions.push(generateHTML());
	context.subscriptions.push(addOpenHTML());
	context.subscriptions.push(addGenerateHTMLFolder());
	context.subscriptions.push(addGenerateHTMLFilesOpened());
	context.subscriptions.push(addGenerateHTMLFile());

	vscode.languages.registerHoverProvider(ELanguageSupport.advpl, {
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
		[ELanguageSupport.advpl],
		{
			provideCompletionItems: (document: vscode.TextDocument, position: vscode.Position, _token: vscode.CancellationToken) => {
				// const line = document.lineAt(position.line).text;
				// const prefix = line.slice(0, position.character);
				const util = new Utils;
				let list = new vscode.CompletionList;

				// Adiciona o Completion "Add ProtheusDoc Block"
				list.items.push(new CompletionAddBlock(document, position));

				// Adiciona o Completion de todas as palavras encontradas no Documento
				// Verifica se o usuário deseja utilizar a sugestão de texto customizada da extensão no IntelliSense.
				if (util.getUseSuggestCustom()) {
					// Obs.: Necessário fazer assim pois o uso de Completion Provider faz 
					//  com que o VsCode pare de mostrar os itens de texto no IntelliSense.
					_wordsDocument.map(word => list.items.push(new vscode.CompletionItem(word, vscode.CompletionItemKind.Text)));
				}

				return list;
			}
		})
	);

	vscode.window.onDidChangeActiveTextEditor(editor => {

		if (editor) {
			
			// Aplica as funções abaixo apenas para extensões de arquivos suportadas
			if (editor.document.languageId === ELanguageSupport.advpl ||
				editor.document.languageId === ELanguageSupport["4gl"]) {

				decorator.triggerUpdateDecorations();

				searchProtheusDocInFile(editor.document.getText(), editor.document.uri);

				diagnostics.triggerUpdateDiagnostics(editor.document, collection);

				searchWordsDocument(editor.document);
			}
		}

	}, null, context.subscriptions);

	vscode.workspace.onDidCloseTextDocument(document => {
		collection.clear();
	});

	vscode.workspace.onDidSaveTextDocument(document => {

		if (vscode.window.activeTextEditor && document === vscode.window.activeTextEditor.document) {
			
			// Aplica as funções abaixo apenas para extensões de arquivos suportadas
			if (document.languageId === ELanguageSupport.advpl ||
				document.languageId === ELanguageSupport["4gl"]) {

				diagnostics.triggerUpdateDiagnostics(document, collection);

				searchWordsDocument(document);
			}
		}

	});

	vscode.workspace.onDidChangeTextDocument(event => {

		if (vscode.window.activeTextEditor && event.document === vscode.window.activeTextEditor.document) {

			// Aplica as funções abaixo apenas para extensões de arquivos suportadas
			if (event.document.languageId === ELanguageSupport.advpl ||
				event.document.languageId === ELanguageSupport["4gl"]) {

				decorator.triggerUpdateDecorations();

				searchProtheusDocInFile(event.document.getText(), event.document.uri);

				// diagnostics.triggerUpdateDiagnostics(event.document, collection);
			}
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

	// Registra o comando que abrirá o arquivo na linha da documentação
	context.subscriptions.push(vscode.commands.registerCommand("protheusdoc.openFile", (args) => {
		vscode.window.showTextDocument(vscode.Uri.parse(args.file)).then(textEditor => {
			let range = textEditor.document.lineAt(args.line).range;
			textEditor.selection = new vscode.Selection(range.start, range.start);
			textEditor.revealRange(range);
		});
	}));

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
	let expressionProtheusDoc = /\{Protheus\.Doc\}[^¬]*?\/\*\//mig;
	let match = text.match(expressionProtheusDoc);

	/**
	 * Limpa o texto antes de montar uma expressão regular.
	 * @param string texto a ser limpo.
	 */
	function escapeRegExp(string: string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
	}

	/**
	 * Busca o numero da linha que contém o identificador.
	 * @param identificador identificador do ProtheusDoc.
	 */
	function findLine(identificador: string): number {
		let expressionProtheusDoc2 = new RegExp("(\\{Protheus\\.doc\\}\\s*)(" + escapeRegExp(identificador.trim()) + ")", "i");
		let texts = text.split("\n");

		// Percorre o array das linhas para verificar onde está a declaração do identificador
		for (let line = 0; line < texts.length; line++) {
			let match = texts[line].match(expressionProtheusDoc2);

			if (match !== null && match.index !== undefined) {
				return line;
			}
		}

		return 0;
	}

	// Remove todas as referências de documentação do arquivo aberto
	documentations = documentations.filter(doc => doc.file.fsPath !== uri.fsPath);

	if (match) {
		// Percorre via expressão regular todas as ocorrencias de ProtheusDoc no arquivo.
		match.forEach(element => {
			let doc = new ProtheusDocToDoc(element, uri);
			// let docIndex = documentations.findIndex(e => e.identifier.trim().toUpperCase() === doc.identifier.trim().toUpperCase());

			// Adiciona a linha correspondente a documentação
			doc.lineNumber = findLine(doc.identifier);

			// Caso a documentação já exista na lista altera
			// if (docIndex >= 0) {
			// documentations[docIndex] = doc;
			// } else {
			documentations.push(doc.getDocumentation());
			// }
		});
	}
}

/**
 * Busca e armazena as palavras encontradas em um Documento.
 * @param document Documento a ser consultado as palavras.
 */
export function searchWordsDocument(document: vscode.TextDocument) {

	const util = new Utils;

	// Verifica se o usuário deseja utilizar a sugestão de texto customizada da extensão no IntelliSense.
	if (util.getUseSuggestCustom()) {

		const words = /\w+/g;
		const text = document.getText();
		let match;

		// Remove as palavras existentes no array de palavras do documento
		_wordsDocument.splice(0, _wordsDocument.length);

		// Enquanto existir palavras no documento guarda-as
		while (match = words.exec(text)) {
			let word = match[0];

			// Verifica se a palavra já foi encontrada anteriormente (independente do case)
			if (!_wordsDocument.find(item => item === word)) {
				_wordsDocument.push(word);
			}
		}

	}

}

/**
 * Gera os arquivos HTML baseado no ProtheusDoc do Projeto
 */
export function generateHTML() {
	let disposable = vscode.commands.registerCommand('protheusdoc.generateHTML', () => {
		let geradorHtml: ProtheusDocHTML = new ProtheusDocHTML();
		let util = new Utils();
		let dirDoc = util.getDirDoc();

		if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
			let paths: string[] = [];

			// Captura todas as pastas da Workspace
			vscode.workspace.workspaceFolders.forEach((folder: vscode.WorkspaceFolder) => {
				paths.push(folder.uri.fsPath);
			});

			// Verifica se o diretório de documentações informado pelo usuário existe
			if (dirDoc === "" || !fs.existsSync(dirDoc)) {
				dirDoc = paths[0];
			}

			vscode.window.withProgress({
				location: vscode.ProgressLocation.Window,
				title: "Gerando documentação HTML...",
				cancellable: false
			}, (progress, token) => {

				token.onCancellationRequested(() => {
					vscode.window.showWarningMessage("Geração de documentação HTML cancelada.");
				});

				return geradorHtml.ProjectInspect(paths, path.join(dirDoc, util.getFolderDoc()))
					.then(() => {
						vscode.window.showInformationMessage("Documentação gerada com sucesso em " + path.join(dirDoc, util.getFolderDoc()), "Abrir documentação")
							.then(e => {
								if (e === "Abrir documentação") {
									vscode.commands.executeCommand("protheusdoc.openHTML");
								}
							});
					})
					.catch(() => { vscode.window.showErrorMessage("Não foi possível gerar a documentação na pasta " + path.join(dirDoc, util.getFolderDoc())); });
			});

		} else {
			vscode.window.showErrorMessage("Para geração da documentação HTML deve haver uma Workspace salva.");
		}
	});

	return disposable;
}

/**
 * Registra o bloco de comando para abrir a documentação HTML
 */
export function addOpenHTML() {
	let disposable = vscode.commands.registerCommand('protheusdoc.openHTML', () => {
		let util = new Utils();
		let dirDoc = util.getDirDoc();
		let folderDoc = util.getFolderDoc();

		// Verifica se o diretório de documentações informado pelo usuário existe
		if (dirDoc === "" || !fs.existsSync(dirDoc)) {

			// Verifica se existem pastas na workspace aberta
			if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
				dirDoc = vscode.workspace.workspaceFolders[0].uri.fsPath;
			} else {
				vscode.window.showWarningMessage(`Não foi encontrado o diretório das documentações (${dirDoc})`, "Gerar Documentação").then(e => {
					if (e === "Gerar Documentação") {
						vscode.commands.executeCommand("protheusdoc.generateHTML");
					}
				});

				return disposable;
			}
		}

		// Verifica se os arquivos e pasta base existem
		if (fs.existsSync(path.join(dirDoc, folderDoc))) {

			if (fs.existsSync(path.join(dirDoc, folderDoc, "index.html"))) {

				// Caso tenha encontrado o arquivo, abre a documentação
				const opn = require('opn');
				opn(path.join(dirDoc, folderDoc, "index.html"));

			} else {
				vscode.window.showWarningMessage(`Não foi encontrado o arquivo index.html no diretório das documentações (${path.join(dirDoc, folderDoc)})`, "Gerar Documentação").then(e => {
					if (e === "Gerar Documentação") {
						vscode.commands.executeCommand("protheusdoc.generateHTML");
					}
				});
			}

		} else {
			vscode.window.showWarningMessage(`Não foi encontrado a pasta ${folderDoc} no diretório das documentações (${dirDoc}).`, "Gerar Documentação").then(e => {
				if (e === "Gerar Documentação") {
					vscode.commands.executeCommand("protheusdoc.generateHTML");
				}
			});
		}

	});

	return disposable;
}

/**
 * Registra o bloco de comando para gerar documentação HTML da pasta
 */
export function addGenerateHTMLFolder() {
	let disposable = vscode.commands.registerCommand('protheusdoc.generateHTMLFolder', function (context) {
		let geradorHtml: ProtheusDocHTML = new ProtheusDocHTML();
		let util = new Utils();
		let dirDoc = util.getDirDoc();

		if (context) {

			let cResource = context.fsPath;

			if (fs.lstatSync(cResource).isDirectory()) {

				if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
					let paths: string[] = [];

					// Captura todas as pastas da Workspace
					vscode.workspace.workspaceFolders.forEach((folder: vscode.WorkspaceFolder) => {
						paths.push(folder.uri.fsPath);
					});

					// Verifica se o diretório de documentações informado pelo usuário existe
					if (dirDoc === "" || !fs.existsSync(dirDoc)) {
						dirDoc = paths[0];
					}

					vscode.window.withProgress({
						location: vscode.ProgressLocation.Window,
						title: "Gerando documentação HTML...",
						cancellable: false
					}, (progress, token) => {

						token.onCancellationRequested(() => {
							vscode.window.showWarningMessage("Geração de documentação HTML cancelada.");
						});

						return geradorHtml.ProjectInspect([cResource], path.join(dirDoc, util.getFolderDoc()))
							.then(() => {
								vscode.window.showInformationMessage("Documentação gerada com sucesso em " + path.join(dirDoc, util.getFolderDoc()), "Abrir documentação")
									.then(e => {
										if (e === "Abrir documentação") {
											vscode.commands.executeCommand("protheusdoc.openHTML");
										}
									});
							})
							.catch(() => { vscode.window.showErrorMessage("Não foi possível gerar a documentação na pasta " + path.join(dirDoc, util.getFolderDoc())); });
					});

				} else {
					vscode.window.showErrorMessage("Para geração da documentação HTML deve haver uma Workspace salva.");
				}
			}
			else {
				vscode.window.showInformationMessage("Necessário selecionar uma pasta.");
			}
		}
		else {
			vscode.window.showInformationMessage("Necessário selecionar uma pasta.");
		}
	});

	return disposable;
}

/**
 * Registra o bloco de comando para gerar documentação HTML de fontes abertos
 */
export function addGenerateHTMLFilesOpened() {
	let disposable = vscode.commands.registerCommand('protheusdoc.generateHTMLOpenedFiles', async function () {
		let geradorHtml: ProtheusDocHTML = new ProtheusDocHTML();
		let util = new Utils();
		let dirDoc = util.getDirDoc();
		let firstDocument: vscode.TextEditor;
		let finish: boolean = false;

		if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
			let pathesWorkspace: string[] = [];
			let pathesDoc: string[] = [];

			// Captura todas as pastas da Workspace
			vscode.workspace.workspaceFolders.forEach((folder: vscode.WorkspaceFolder) => {
				pathesWorkspace.push(folder.uri.fsPath);
			});

			// Verifica se o diretório de documentações informado pelo usuário existe
			if (dirDoc === "" || !fs.existsSync(dirDoc)) {
				dirDoc = pathesWorkspace[0];
			}

			// Percorre todos os arquivos abertos do editor
			do {

				// Posiciona no próximo arquivo
				await vscode.commands.executeCommand("workbench.action.nextEditor").then(e => {

					if (vscode.window.activeTextEditor) {
						// Caso o primeiro documento não tenha sido definido, adiciona no array e define este como o primeiro.
						if (!firstDocument) {
							firstDocument = vscode.window.activeTextEditor;
							pathesDoc.push(firstDocument.document.uri.fsPath);
						} else {
							// Caso o documento posicionado seja o mesmo do primeiro, termina o loop
							if (firstDocument.document.fileName === vscode.window.activeTextEditor.document.fileName) {
								finish = true;
							} else {
								// Se não adiciona no array
								pathesDoc.push(vscode.window.activeTextEditor.document.uri.fsPath);
							}
						}
					}

				});

				// Caso tenha finalizado o Loop, volta para o primeiro arquivo do posicionamento, pois o Loop já começa mudando de arquivo
				if (finish) {
					await vscode.commands.executeCommand("workbench.action.previousEditor");
				}

			} while (!finish);

			if (pathesDoc.length > 0) {

				vscode.window.withProgress({
					location: vscode.ProgressLocation.Window,
					title: "Gerando documentação HTML...",
					cancellable: false
				}, (progress, token) => {

					token.onCancellationRequested(() => {
						vscode.window.showWarningMessage("Geração de documentação HTML cancelada.");
					});

					return geradorHtml.FilesInspect(pathesDoc, path.join(dirDoc, util.getFolderDoc()))
						.then(() => {
							vscode.window.showInformationMessage("Documentação gerada com sucesso em " + path.join(dirDoc, util.getFolderDoc()), "Abrir documentação")
								.then(e => {
									if (e === "Abrir documentação") {
										vscode.commands.executeCommand("protheusdoc.openHTML");
									}
								});
						})
						.catch(() => { vscode.window.showErrorMessage("Não foi possível gerar a documentação na pasta " + path.join(dirDoc, util.getFolderDoc())); });
				});
			}

		} else {
			vscode.window.showErrorMessage("Para geração da documentação HTML deve haver uma Workspace salva.");
		}

	});

	return disposable;
}

/**
 * Registra o bloco de comando para gerar documentação HTML de arquivo
 */
export function addGenerateHTMLFile() {
	let disposable = vscode.commands.registerCommand('protheusdoc.generateHTMLFile', function (context) {
		let geradorHtml: ProtheusDocHTML = new ProtheusDocHTML();
		let util = new Utils();
		let dirDoc = util.getDirDoc();

		if (context) {

			let cResource = context.fsPath;

			if (fs.lstatSync(cResource).isFile()) {

				if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
					let paths: string[] = [];

					// Captura todas as pastas da Workspace
					vscode.workspace.workspaceFolders.forEach((folder: vscode.WorkspaceFolder) => {
						paths.push(folder.uri.fsPath);
					});

					// Verifica se o diretório de documentações informado pelo usuário existe
					if (dirDoc === "" || !fs.existsSync(dirDoc)) {
						dirDoc = paths[0];
					}

					vscode.window.withProgress({
						location: vscode.ProgressLocation.Window,
						title: "Gerando documentação HTML...",
						cancellable: false
					}, (progress, token) => {

						token.onCancellationRequested(() => {
							vscode.window.showWarningMessage("Geração de documentação HTML cancelada.");
						});

						return geradorHtml.FilesInspect([cResource], path.join(dirDoc, util.getFolderDoc()))
							.then(() => {
								vscode.window.showInformationMessage("Documentação gerada com sucesso em " + path.join(dirDoc, util.getFolderDoc()), "Abrir documentação")
									.then(e => {
										if (e === "Abrir documentação") {
											vscode.commands.executeCommand("protheusdoc.openHTML");
										}
									});
							})
							.catch(() => { vscode.window.showErrorMessage("Não foi possível gerar a documentação na pasta " + path.join(dirDoc, util.getFolderDoc())); });
					});

				} else {
					vscode.window.showErrorMessage("Para geração da documentação HTML deve haver uma Workspace salva.");
				}
			}
			else {
				vscode.window.showInformationMessage("Necessário selecionar um arquivo.");
			}
		}
		else {
			vscode.window.showInformationMessage("Necessário selecionar um arquivo.");
		}
	});

	return disposable;
}

/**
 * Registra o bloco de comando para criação do bloco de documentação.
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
 * Registra o bloco de comando para atualizar a tabela de documentações da workspace.
 */
export function updateTableDoc() {
	let disposable = vscode.commands.registerCommand('protheusdoc.updateTableDoc', () => {

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

		return new Promise<void>(resolve => {

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
