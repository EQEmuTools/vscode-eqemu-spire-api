import * as vscode from "vscode";
import * as util from "util";

export class SpireLuaCompletions {
    private c: vscode.ExtensionContext;
    private constants: Array<any> = [];

    constructor(c: vscode.ExtensionContext) {
        this.c = c;
    }

    // @ts-ignore
    loadConstants(api: Object) {
        this.constants = [];

        // @ts-ignore
        const apiConstants = api['lua'].constants;
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

                this.constants.push(item);
            }
        }
    }

    registerCompletionProvider() {
        this.c.subscriptions.push(
            vscode.languages.registerCompletionItemProvider(
                'lua',
                {
                    provideCompletionItems: () => {
                        return this.constants;
                    }
                },
            )
        );
    }
}
