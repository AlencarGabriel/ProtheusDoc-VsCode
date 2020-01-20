// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ELanguageSupport, ProtheusDoc } from './objects/ProtheusDoc';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "protheusdoc" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(addDocBlock());
	context.subscriptions.push(vscode.commands.registerTextEditorCommand("protheusdoc.addDoc", (textEditor, edit) => {
		let snippet = "";

		snippet += "/*/{Protheus.doc} fPdocTeste\n";
		snippet += "${1:description}\n";
		snippet += "@type function\n";
		snippet += "@version ${2:12.1.17}\n";
		snippet += "@author ${3:Gabriel Alencar}\n";
		snippet += "@since ${4:17/01/2020}\n";
		snippet += "@param cParam1, character, ${5:param_description}\n";
		snippet += "@param nParam2, numeric, ${6:param_description}\n";
		snippet += "@param xParam3, param_type, ${7:param_description}\n";
		snippet += "@return ${8:return_type}, ${9:return_description}\n";
		snippet += "/*/";

		textEditor.insertSnippet(new vscode.SnippetString(snippet));
	}));

	vscode.languages.registerHoverProvider('advpl', {
		provideHover(document, position, token) {
			console.log("Hover!!");
			return new vscode.Hover('I am a hover!');
		}
	});

	context.subscriptions.push(vscode.languages.registerCompletionItemProvider(
		["advpl"],
		{
			provideCompletionItems: (document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) => {
				const line = document.lineAt(position.line).text;
				const prefix = line.slice(0, position.character);

				if (prefix.match(/^\s*$|\/\*\*\s*$|^\s*\/\*\*+\s*$/)) {
					return [new DocThisCompletionItem(document, position)];
				}

				return;
			}
		},
		"/", "*"));
}

class DocThisCompletionItem extends vscode.CompletionItem {
	constructor(document: vscode.TextDocument, position: vscode.Position) {
		super("/** Document This */", vscode.CompletionItemKind.Snippet);
		this.insertText = "";
		this.sortText = "\0";

		const line = document.lineAt(position.line).text;
		const prefix = line.slice(0, position.character).match(/\/\**\s*$/);
		const suffix = line.slice(position.character).match(/^\s*\**\//);
		const start = position.translate(0, prefix ? -prefix[0].length : 0);
		this.range = new vscode.Range(
			start,
			position.translate(0, suffix ? suffix[0].length : 0));

		this.command = {
			title: "ProtheusDOC",
			command: "protheusdoc.addDocBlock",
			arguments: [true]
		};
	}
}

export function addDocBlock(){
	let disposable =  vscode.commands.registerTextEditorCommand('protheusdoc.addDocBlock', (textEditor, edit) => {
		// let active = vscode.window.activeTextEditor;
		// textEditor.selection // Captura da área posicionada
		// textEditor.document.lineAt(textEditor.selection.active) // captura o texto da seleção

		// textEditor?.insertSnippet // Estudar

		console.log(textEditor.selection);

		let document = textEditor.document;
		let activeLine = textEditor.selection.active.line;
		let found = false;
		let limitSkipLines = 3;
		let linesSkiped = 0;

		while (!found) {
			let line = document.lineAt(activeLine);

			if (!line.isEmptyOrWhitespace &&
				line.text.match(/^\s*$|(User|Static) Function ([^:\/]+)\s*$|^\s*$|Method ([^:\/]+)\s*$|Class ([^:\/\s]+)\s*$/i)) {
				found = true;

			}else{
				activeLine++;
				linesSkiped++;
			}

			if (linesSkiped >= limitSkipLines) {
				break;
			}

		}

		let newPosition = new vscode.Position(activeLine-1, 0);

		if (found) {
			let protheusDoc = new ProtheusDoc(ELanguageSupport.advpl, document.lineAt(activeLine).text);
			textEditor.insertSnippet(new vscode.SnippetString(protheusDoc.getProtheusDoc()), newPosition);
		}

	});

	return disposable;
}
// this method is called when your extension is deactivated
export function deactivate() {}
