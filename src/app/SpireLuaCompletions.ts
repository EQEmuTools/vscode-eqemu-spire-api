import * as vscode from "vscode";
import * as util from "util";

export class SpireLuaCompletions {
    private c: vscode.ExtensionContext;

    constructor(c: vscode.ExtensionContext) {
        this.c = c;
    }

    // @ts-ignore
    processConstants(api: Object) {
        // @ts-ignore
        const apiConstants = api['lua'].constants;

        // constants
        let constants: any[] = [];
        // @ts-ignore
        for (const key in apiConstants) {
            // @ts-ignore
            const entries = apiConstants[key];
            for (let e of entries) {
                const constant  = util.format(
                    "%s.%s",
                    key,
                    e.constant
                );
                const item      = new vscode.CompletionItem(constant);
                item.insertText = new vscode.SnippetString(constant);

                constants.push(item);
            }
        }

        this.c.subscriptions.push(
            vscode.languages.registerCompletionItemProvider(
                'lua',
                {
                    provideCompletionItems() {
                        return constants;
                    }
                },
            )
        );
    }
}
