import * as vscode from 'vscode'; 

interface UserInput {
  search: string;
  replace: string;
}

interface Replacement {
  text: string;
  count: number;
}

function getUserInput() {
	var promise = new Promise(function(resolve, reject) {
		// do a thing, possibly async, then…
		var findStringInputOpts: vscode.InputBoxOptions = {
			password: false,
			placeHolder: "search-term",
			prompt: "Find",
			value: ""
		};
		vscode.window.showInputBox(findStringInputOpts).then((findString)=>{
			if(typeof findString !== 'undefined') {
				if(findString !== '') {
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
							var error: Error = new Error("user canceled in replace");
							error.name = "CancelError";
							reject(error);
						}
					});
				}
				else {
					var error: Error = new Error("search expression was empty");
					error.name = "EmptyError";
					reject(error);
				}
				
				
			}
			else {
				var error: Error = new Error("user canceled in find");
				error.name = "CancelError";
				reject(error);
			}
		});
	});
	
	return promise;
}

function replaceAll(haystack: string, needle: string, replacementNeedle: string, caseMatters: boolean, wholeWords: boolean, isRegex: boolean): Replacement {
  //prepare search term
  if(!isRegex) {
	  needle = escapeRegExp(needle); //escape special chars
  }
  if(wholeWords) {
	  needle = "\\b"+needle+"\\b"; //surround with wordboundary
  }
  var regExFlags = caseMatters?'gm':'igm'; //global, multiline and maybe caseinsensitive
  
  //do replacement
  var replacementText = haystack.replace(new RegExp(needle, regExFlags), replacementNeedle);
  var matches = haystack.match(new RegExp(needle, regExFlags)); //undefined if no matches
  var replacementCount = matches?matches.length:0;
  
  return {
	  text: replacementText,
	  count: replacementCount
  }
}

function escapeRegExp(str) {
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	console.log("search'n'replace with newline loaded!");
	
	//define all searchTypes
	var normalSearch: vscode.QuickPickItem = {label: "normal search", description: "finds 'foo' in 'xyzFoOabc'"};
	var caseSensitiveSearch: vscode.QuickPickItem = {label: "case sensitive", description: "does not find 'foo' in 'xyzFoOabc' but in 'xyzfooabc'"};
	var wholeWordsSearch: vscode.QuickPickItem = {label: "whole words", description: "does not find 'foo' in 'xyzFoOabc' but in 'xyz FoO abc'"};
	var regexSearch: vscode.QuickPickItem = {label: "regex", description: "[a-z] finds all letters, even capitals"};
	var caseSensitiveAndWholeWordsSearch: vscode.QuickPickItem = {label: "case sensitive and whole words", description: "same as whole words but case sensitive"};
	var caseSensitiveAndRegexSearch: vscode.QuickPickItem = {label: "case sensitive and regex", description: "[a-z] finds only small letters"};
	var wholeWordsAndRegexSearch: vscode.QuickPickItem = {label: "whole words and regex", description: "same as regex but surrounds it with \\b"};
	var caseSensitiveWholeWordsRegexSearch: vscode.QuickPickItem = {label: "case sensitive, whole words and regex", description: "everything at once"};
	
	// The command has been defined in the package.json file
	var disposable = vscode.commands.registerCommand('extension.replaceWithNewline', () => {
		// The code you place here will be executed every time your command is executed

		//available actions
		var actions = [
			normalSearch,
			caseSensitiveSearch,
			wholeWordsSearch,
			regexSearch,
			caseSensitiveAndWholeWordsSearch,
			caseSensitiveAndRegexSearch,
			wholeWordsAndRegexSearch,
			caseSensitiveWholeWordsRegexSearch
		];

		vscode.window.showQuickPick(actions).then(function(searchType){
			getUserInput().then(function(userInput: UserInput) {
				console.log(userInput.search + " to " + userInput.replace);
				// Display a message box to the user
				var replacementString = userInput.replace.split("\\r").join("\r").split("\\n").join("\n").split("\\t").join("\t");
				vscode.window.activeTextEditor.edit((editor: vscode.TextEditorEdit) => {
					//get metainfos of document
					var lineCount = vscode.window.activeTextEditor.document.lineCount;
					var lastLine = vscode.window.activeTextEditor.document.lineAt(lineCount - 1);
					var endOfLastLine = lastLine.range.end;
					
					//replace text
					var textDocument = vscode.window.activeTextEditor.document.getText();
					var replacement: Replacement;
					switch(searchType) {
						case normalSearch: replacement = replaceAll(textDocument, userInput.search, replacementString, false, false, false); break;
						case caseSensitiveSearch: replacement = replaceAll(textDocument, userInput.search, replacementString, true, false, false); break;
						case wholeWordsSearch: replacement = replaceAll(textDocument, userInput.search, replacementString, false, true, false); break;
						case regexSearch: replacement = replaceAll(textDocument, userInput.search, replacementString, false, false, true); break;
						case caseSensitiveAndWholeWordsSearch: replacement = replaceAll(textDocument, userInput.search, replacementString, true, true, false); break;
						case caseSensitiveAndRegexSearch: replacement = replaceAll(textDocument, userInput.search, replacementString, true, false, true); break;
						case wholeWordsAndRegexSearch: replacement = replaceAll(textDocument, userInput.search, replacementString, false, true, true); break;
						case caseSensitiveWholeWordsRegexSearch: replacement = replaceAll(textDocument, userInput.search, replacementString, true, true, true); break;
						default: replacement = null; break;
					}
					if(replacement != null) {
						var replacementCount = replacement.count;
						var replacementDocument = replacement.text;
						
						//replce whole document
						if(replacementCount > 0) {
							editor.replace(new vscode.Range(new vscode.Position(0, 0), new vscode.Position(endOfLastLine.line, endOfLastLine.character)), replacementDocument);
						}
						
						//show info to user
						vscode.window.showInformationMessage("replaced " + replacementCount + " occurences");
					}
					else {
						vscode.window.showErrorMessage("Unknown Error");
					}
					
				});
			}).catch(function(error: Error) {
				switch(error.name) {
					case "CancelError": console.log("user canceled: " + error.message); break;
					default: vscode.window.showErrorMessage(error.message); break; 
				}
			});
		});
		
		return;
	});
	
	context.subscriptions.push(disposable);
}