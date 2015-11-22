// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'; 

interface UserInput {
  search: string;
  replace: string;
}

function getUserInput() {
	var promise = new Promise(function(resolve, reject) {
		// do a thing, possibly async, then…
		var findStringInputOpts: vscode.InputBoxOptions = {
			password: false,
			placeHolder: "suche nach",
			prompt: "Find",
			value: ""
		};
		vscode.window.showInputBox(findStringInputOpts).then((findString)=>{
			if(typeof findString !== 'undefined') {
				var replaceStringInputOpts: vscode.InputBoxOptions = {
					password: false,
					placeHolder: "text and/or \\r \\n \\t",
					prompt: "Replace",
					value: ""
				};
				vscode.window.showInputBox(replaceStringInputOpts).then((replaceString)=>{
					if (typeof replaceString !== 'undefined') {
						var userInput: UserInput = {search: findString, replace: replaceString};
						resolve(userInput);
					}
					else {
						reject(Error("user canceled in replace"));
					}
				});
			}
			else {
				reject(Error("user canceled in find"));
			}
		});
	});
	
	return promise;
}

function replaceAll(haystack, needle, replacementNeedle) {
  return haystack.replace(new RegExp(escapeRegExp(needle), 'g'), replacementNeedle);
}

function countMatches(haystack, needle) {
  return haystack.match(new RegExp(escapeRegExp(needle), 'g')).length;
}

function replaceAllCaseInsensitive(haystack, needle, replacementNeedle) {
  return haystack.replace(new RegExp(escapeRegExp(needle), 'ig'), replacementNeedle);
}

function countMatchesCaseInsensitive(haystack, needle) {
  return haystack.match(new RegExp(escapeRegExp(needle), 'ig')).length;
}

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "SNRWN" is now active!'); 

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	var disposable = vscode.commands.registerCommand('extension.searchNReplaceNormal', () => {
		// The code you place here will be executed every time your command is executed

		getUserInput().then(function(userInput: UserInput) {
			vscode.window.showInformationMessage(userInput.search + " to " + userInput.replace);
			// Display a message box to the user
			var replacementString = userInput.replace.split("\\r").join("\r").split("\\n").join("\n").split("\\t").join("\t");
			vscode.window.activeTextEditor.edit((editor: vscode.TextEditorEdit) => {
				//get metainfos of document
				var lineCount = vscode.window.activeTextEditor.document.lineCount;
				var lastLine = vscode.window.activeTextEditor.document.lineAt(lineCount - 1);
				var endOfLastLine = lastLine.range.end;
				
				//replace text
				var textDocument = vscode.window.activeTextEditor.document.getText();
				var replacementCount = countMatchesCaseInsensitive(textDocument, userInput.search);
				var replacementDocument = replaceAllCaseInsensitive(textDocument, userInput.search, replacementString);
				
				//replce whole document
				editor.replace(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(endOfLastLine.line, endOfLastLine.character)), replacementDocument);
				
				//show info to user
				vscode.window.showInformationMessage("replaced "+replacementCount);
			});
		});
		
		return;
	});
	
	context.subscriptions.push(disposable);
	
	disposable = vscode.commands.registerCommand('extension.searchNReplaceCS', () => {
		// The code you place here will be executed every time your command is executed

		getUserInput().then(function(userInput: UserInput) {
			vscode.window.showInformationMessage(userInput.search + " to " + userInput.replace);
			// Display a message box to the user
			var replacementString = userInput.replace.split("\\r").join("\r").split("\\n").join("\n").split("\\t").join("\t");
			vscode.window.activeTextEditor.edit((editor: vscode.TextEditorEdit) => {
				//get metainfos of document
				var lineCount = vscode.window.activeTextEditor.document.lineCount;
				var lastLine = vscode.window.activeTextEditor.document.lineAt(lineCount - 1);
				var endOfLastLine = lastLine.range.end;
				
				//replace text
				var textDocument = vscode.window.activeTextEditor.document.getText();
				var replacementCount = countMatches(textDocument, userInput.search);
				var replacementDocument = replaceAll(textDocument, userInput.search, replacementString);
				
				//replce whole document
				editor.replace(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(endOfLastLine.line, endOfLastLine.character)), replacementDocument);
				
				//show info to user
				vscode.window.showInformationMessage("replaced "+replacementCount);
			});
		
		
		});
		
		return;
	});
	
	context.subscriptions.push(disposable);
}