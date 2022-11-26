// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {Main} from './app/Main';

export async function activate(c: vscode.ExtensionContext) {
    await (new Main(c)).run();

    c.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            'lua',
            {
                provideCompletionItems(doc: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
                    const word = doc.getWordRangeAtPosition(position);
                    if (!word) {
                        return [];
                    }

                    console.log("We have a range");

                    const range = new vscode.Range(
                        position.line,
                        word.start.character,
                        position.line,
                        word.end.character
                    );

                    console.log("Text at range is [%s]", doc.getText(range));

                    const activeEditor = vscode.window.activeTextEditor;
                    if (activeEditor !== null) {
                        // @ts-ignore
                        const currentLine = activeEditor.selection.active.line;
                        // @ts-ignore
                        const {text}      = activeEditor.document.lineAt(activeEditor.selection.active.line);
                        
                        console.log("current line is", currentLine);
                        console.log("current line text is", text);
                    }

                    return [];
                }
            },
        )
    );
}

// This method is called when your extension is deactivated
export function deactivate() {
}
