// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

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
		let snippet = new vscode.SnippetString("SELECT $4 * FROM  $1 ( NOLOCK ) \n WHERE $2_FILIAL = '01' $3 AND D_E_L_E_T_ = '' ");

		textEditor.insertSnippet(snippet);
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
			command: "protheusdoc.addDoc",
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
	});

	return disposable;
}
// this method is called when your extension is deactivated
export function deactivate() {}
