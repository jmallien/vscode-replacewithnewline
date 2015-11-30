# search'n'replace with newline
This extension adds a feature, which should be included natively in VSCode. But the find/replace in VSCode does not get use of special characters like **\r\n** or **\t**. My motivation for this extension is, that VSCode will include the feature and I can remove this extension. But for now, feel free to use it. Many downloads could bring it to attention of VSCode developers. :)

## Use Case
Regularily, lets say once per day, I get a logfile or whatever without any newlines. So I have to format it myself. The most important thing then is to search for something like '2015-02-01' and replace it with '\n2015-02-01'. I think many people have use cases similar to this so I decided to share my extension.

## How to use

Since the vscode-API does not offer any UI capabilities, everything is done via commands.

* Open the command palette (`Shift+CMD+P` on OSX or `Shift+Ctrl+P` on Windows and Linux)
* choose a search-method similar to the methods found in VSCode find/replace UI
* enter your search-term, based on your previous choosing
* enter a replacement-text, which can contain newlines (**\r**, **\n** or **\r\n** will all lead to the linebreaking your file belongs to) and tabs (**\t**)

## Limitations
VSCode will treat your linebreaks like the ones the file is set to. So if your file shows "CRLF" in the statusbar, it will normalize all linebreaks to this one. So it doesn't make a difference if you enter Windows (**\r\n**), Linux/Mac (**\n**) or ClassicMac (**\r**) linebreaks.

Since there is no UI for extensions, all search-mode-combinations are listed in one large list. But at least you can type in the mode instead of using the mouse.
