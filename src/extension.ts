// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {Main} from './app/Main';

export async function activate(c: vscode.ExtensionContext) {
    await (new Main(c)).run();

    // testing
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

                    let snippet2 = new vscode.CompletionItem(
                        "Hail - NPC Dialogue Block (text, hail)",
                        vscode.CompletionItemKind.Snippet,
                    );
                    snippet2.insertText = new vscode.SnippetString(`if (e.message:findi("hail")) then\n\te.self:Say("Hello.");$0\nend`);

                    let snippet4 = new vscode.CompletionItem(
                        "if (condition)",
                        vscode.CompletionItemKind.Snippet,
                    );
                    snippet4.insertText = new vscode.SnippetString(`if (\${1:condition}) then\n\t\${2:logic}\nend`);

                    return [snippet2, snippet4];
                }
            },
        )
    );

    // test
    c.subscriptions.push(
        vscode.languages.registerCompletionItemProvider(
            'perl',
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

                    let snippet3 = new vscode.CompletionItem(
                        "Hail - NPC Dialogue Block (text, hail)",
                        vscode.CompletionItemKind.Snippet,
                    );
                    snippet3.insertText = new vscode.SnippetString(`if (\\$text=~/hail/i) {\n\tquest::say("Hail!");$0\n}`);

                    let snippet4 = new vscode.CompletionItem(
                        "if (condition)",
                        vscode.CompletionItemKind.Snippet,
                    );
                    snippet4.insertText = new vscode.SnippetString(`if (\${1:condition}) {\n\t\${2:logic}\n}`);

                    return [snippet4, snippet3];
                }
            },
        )
    );
}

// This method is called when your extension is deactivated
export function deactivate() {
}
