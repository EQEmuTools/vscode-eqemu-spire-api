import * as vscode from "vscode";
import * as util from "util";

// @ts-ignore
// let api: Object; // spire api response cache

export class SpireCompletions {
    static async download(c: vscode.ExtensionContext) {
        console.time("completions process");
        const axios = require('axios');
        const r     = await axios.get("http://spire.akkadius.com/api/v1/quest-api/definitions");
        if (r.status === 200) {
            console.log(r);
            SpireCompletions.processDefinitions(r.data.data, c);
        }
        console.timeEnd("completions process");
    }

    static processDefinitions(api: Object, c: vscode.ExtensionContext) {
        this.processLuaConstants(api, c);
        this.processPerlConstants(api, c);
    }

    private static processLuaConstants(api: Object, c: vscode.ExtensionContext) {
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

        c.subscriptions.push(
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

    private static processPerlConstants(api: Object, c: vscode.ExtensionContext) {
        // @ts-ignore
        const apiConstants = api['perl'].constants;

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

        c.subscriptions.push(
            vscode.languages.registerCompletionItemProvider(
                'perl',
                {
                    provideCompletionItems() {
                        return constants;
                    }
                },
            )
        );
    }
}
