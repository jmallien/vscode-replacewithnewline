# search'n'replace with newline
This extension adds a feature, which should be included natively in vscode. But the find/replace in vscode does not get use of special characters like \r\n or \t.

## Use Case
Regularily, lets say once per day, I get a logfile or whatever without any newlines. So I have to format it myself. The most important thing then is to just search for something like '2015-02-01' and replace it with '\n2015-02-01'. I think many people have use cases similar to this so I decided to share my extension.

## How to use

Since the vscode-API does not offer any UI capabilities, everything is done via commands.

* Open the command palette (`Shift+CMD+P` on OSX or `Shift+Ctrl+P` on Windows and Linux)
* choose a search-method similar to the methods found in VSCode find/replace UI
* * normal is just looking for what you entered, without casesensitivity and without any interpretation
* Press `Ctrl+Space` (Windows, Linux) or `Cmd+Space` (OSX) to see a list of Markdown snippets

### For more information
* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

** Enjoy!**
