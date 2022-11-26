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


                    let snippet = new vscode.CompletionItem(
                        "eq.worldwideupdateactivity(uint32 task_id, int activity_id, int update_count, uint8 min_status, uint8 max_status)",
                        vscode.CompletionItemKind.Snippet,
                    );
                    snippet.insertText = new vscode.SnippetString("eq.worldwideupdateactivity(${1:uint32 task_id}, ${2:int activity_id}, ${3:int update_count}, ${4:uint8 min_status}, ${5:uint8 max_status})");

                    let snippet2 = new vscode.CompletionItem(
                        "Hail - NPC Dialogue Block (text, hail)",
                        vscode.CompletionItemKind.Snippet,
                    );
                    snippet2.insertText = new vscode.SnippetString(`if(e.message:findi("hail")) then\n\te.self:Say("Hello.");$0\nend`);


                    let snippet3 = new vscode.CompletionItem(
                        "event_say (snippet)",
                        vscode.CompletionItemKind.Snippet,
                    );
                    snippet3.insertText = new vscode.SnippetString(`function event_say(e)\n\t$0\nend`);


                    return [snippet, snippet2, snippet3];
                }
            },
        )
    );
}

// This method is called when your extension is deactivated
export function deactivate() {
}
