import * as vscode from "vscode";
import * as util from "util";
import * as path from "path";
import {Strings} from "./Strings";

export class SpireLuaCompletions {
    private c: vscode.ExtensionContext;
    private constants: Array<any> = [];
    private methods: Array<any>   = [];
    private snippets: Array<any>  = [];
    private events: Array<any>    = [];

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
                item.kind       = vscode.CompletionItemKind.Constant;

                this.constants.push(item);
            }
        }
    }

    /**
     * Loads methods auto completions into memory via API definitions
     *
     * @param api
     */
    loadMethods(api: Object) {
        this.methods = [];
        // @ts-ignore
        for (const methodClass in api['lua'].methods) {
            // console.log("e", methodClass);
            const classPrefix = Strings.snakeCase(methodClass.replace("NPC", "Npc"));
            // console.log("classPrefix", classPrefix);

            // @ts-ignore
            for (const m of api['lua'].methods[methodClass]) {
                let snippetParams: Array<any> = [];
                m.params.forEach((p: any, i: number) => {
                    snippetParams.push(
                        util.format("${%s:%s}", (i + 1), p)
                    );
                });

                let label = util.format(
                    "%s(%s)",
                    m.method,
                    m.params.join(", ")
                );

                let snippet = util.format(
                    "%s(%s)",
                    m.method,
                    snippetParams.join(", ")
                );

                const i      = new vscode.CompletionItem(label);
                i.insertText = new vscode.SnippetString(snippet);
                i.kind       = vscode.CompletionItemKind.Method;
                i.detail     = methodClass;
                // @ts-ignore
                i.class      = classPrefix;
                this.methods.push(i);

            }
        }
    }

    /**
     * Loads events auto completions into memory via API definitions
     *
     * @param api
     */
    loadEvents(api: Object) {
        this.events = [];
        // @ts-ignore
        for (const e of api['lua'].events) {
            // console.log(e);

            // discard invalid event prefix
            if (e.event_identifier === "event_") {
                continue;
            }

            // @ts-ignore
            let classPrefix = "";
            // @ts-ignore
            if (e.entity_type) {
                // @ts-ignore
                classPrefix = Strings.snakeCase(e.entity_type.replace("NPC", "Npc"));
            }
            let i = new vscode.CompletionItem(
                // @ts-ignore
                "function " + e.event_identifier + "(e)",
                vscode.CompletionItemKind.Snippet,
            );

            let vars = [];
            // @ts-ignore
            for (let v of e.event_vars) {
                vars.push(`\teq.debug("${v} " .. e.${v});`);
            }

            let varsStr = vars.length > 0 ? `\t-- Exported event variables\n` : "";
            varsStr     = vars.join("\n");

            // @ts-ignore
            i.insertText = new vscode.SnippetString(`function ${e.event_identifier}(e)\n\${1:${varsStr}}\nend`);

            i.kind   = vscode.CompletionItemKind.Text;
            // @ts-ignore
            i.detail = e.entity_type;
            // @ts-ignore
            i.class  = classPrefix;
            this.events.push(i);
        }
    }

    /**
     * Loads snippet auto completions into memory via API definitions
     *
     * @param fileData
     * @param files
     */
    loadSnippets(fileData: {}, files: Array<any>) {
        for (let file of files) {
            if (file.language === 'lua') {
                // @ts-ignore
                let contents = fileData[file.file];
                contents     = contents.replaceAll("    ", "\t");
                const i      = new vscode.CompletionItem(file.text + " (Snippet)");
                i.insertText = new vscode.SnippetString(contents);
                i.kind       = vscode.CompletionItemKind.Text;
                this.snippets.push(i);
            }
            if (file.language === 'all') {
                if (file.file.includes(".csv")) {
                    // @ts-ignore
                    let contents = fileData[file.file];
                    for (let line of contents.split("\n")) {
                        let split    = line.split(",");
                        let text     = split[0].trim();
                        let value    = split[1].trim();
                        const i      = new vscode.CompletionItem(text + " (Value: " + value + ")");
                        i.insertText = value;
                        i.kind       = vscode.CompletionItemKind.Text;
                        this.snippets.push(i);
                    }
                }
            }
        }
    }

    registerCompletionProvider() {

        // snippets
        this.c.subscriptions.push(
            vscode.languages.registerCompletionItemProvider(
                'lua',
                {
                    provideCompletionItems: (doc: vscode.TextDocument, position: vscode.Position) => {
                        return this.snippets;
                    }
                },
            ),
        );

        // constants
        this.c.subscriptions.push(
            vscode.languages.registerCompletionItemProvider(
                'lua',
                {
                    provideCompletionItems: (doc: vscode.TextDocument, position: vscode.Position) => {
                        // if we're at or close to position zero, we're not interested in constants
                        if (position.character < 2) {
                            return [];
                        }

                        const word = doc.getWordRangeAtPosition(position);
                        if (!word) {
                            return [];
                        }

                        // console.log("We have a range");

                        const range = new vscode.Range(
                            position.line,
                            word.start.character,
                            position.line,
                            word.end.character
                        );

                        // slight hack to keep from constants from autocompleting "then"
                        // revisit this later
                        if (doc.getText(range) === "t") {
                            return [];
                        }

                        return this.constants;
                    }
                },
            )
        );

        // object methods and eq.
        this.c.subscriptions.push(
            vscode.languages.registerCompletionItemProvider(
                'lua',
                {
                    provideCompletionItems: (doc: vscode.TextDocument, position: vscode.Position) => {

                        console.log("[Lua] Completion trigger");
                        console.log("[Lua] Position", position);

                        let completionItems: Array<any> = [];

                        const activeEditor = vscode.window.activeTextEditor;
                        if (activeEditor !== null) {
                            // @ts-ignore
                            const lineTextToCursor = activeEditor.document.getText(new vscode.Range(position.line, 0, position.line, position.character));
                            if (lineTextToCursor && lineTextToCursor.length > 0) {
                                console.log("[Lua] line text up to cursor is [%s]", lineTextToCursor);
                                console.log("[Lua] slice 6 [%s]", lineTextToCursor.slice(-6));
                                console.log("[Lua] filename [%s]", path.parse(doc.fileName).name);

                                const isPlayerScript = path.parse(doc.fileName).name.includes("player");

                                // [object] e.other: and not player script
                                if (lineTextToCursor.slice(-6) === "other:" && !isPlayerScript) {
                                    const classesToLoad = this.getCompletionPrefixesByPrefix("client");
                                    for (let m of this.methods) {
                                        if (classesToLoad.includes(m.class)) {
                                            completionItems.push(m);
                                        }
                                    }
                                }

                                // [object] e.self: and not player script
                                if (lineTextToCursor.slice(-5) === "self:" && !isPlayerScript) {
                                    const classesToLoad = this.getCompletionPrefixesByPrefix("npc");
                                    for (let m of this.methods) {
                                        if (classesToLoad.includes(m.class)) {
                                            completionItems.push(m);
                                        }
                                    }
                                }

                                // [object] e.self: and player script
                                if (lineTextToCursor.slice(-5) === "self:" && isPlayerScript) {
                                    const classesToLoad = this.getCompletionPrefixesByPrefix("client");
                                    for (let m of this.methods) {
                                        if (classesToLoad.includes(m.class)) {
                                            completionItems.push(m);
                                        }
                                    }
                                }

                                // eq.
                                if (lineTextToCursor.slice(-3) === "eq.") {
                                    for (let m of this.methods) {
                                        if (m.class === "eq") {
                                            completionItems.push(m);
                                        }
                                    }
                                }
                            }
                        }

                        return completionItems;
                    },
                },
                ":", "."
            ),
        );

        // events
        this.c.subscriptions.push(
            vscode.languages.registerCompletionItemProvider(
                'lua',
                {
                    provideCompletionItems: (doc: vscode.TextDocument, position: vscode.Position) => {

                        console.log("[Lua] event completion", position.character);

                        // if we're not at position zero, it's unlikely we're looking to make a sub event
                        if (position.character > 2) {
                            return [];
                        }

                        let completionItems: Array<any> = [];
                        const isPlayerScript            = path.parse(doc.fileName).name.includes("player");
                        const isBotScript               = path.parse(doc.fileName).name.includes("bot");
                        const isItemScript              = doc.fileName.includes("/items/");
                        const isSpellScript             = doc.fileName.includes("/spells/");
                        if (isPlayerScript) {
                            completionItems = this.events.filter((f) => {
                                return f.class === "player";
                            });
                        } else if (isBotScript) {
                            completionItems = this.events.filter((f) => {
                                return f.class === "bot";
                            });
                        } else if (isItemScript) {
                            completionItems = this.events.filter((f) => {
                                return f.class === "item";
                            });
                        } else if (isSpellScript) {
                            completionItems = this.events.filter((f) => {
                                return f.class === "spell";
                            });
                        } else if (!isPlayerScript) {
                            completionItems = this.events.filter((f) => {
                                return f.class === "npc";
                            });
                        }

                        return completionItems;
                    }
                },
            ),
        );
    }

    /**
     * Loads class prefixes by a given prefix
     * For example if given "client" it will return [ "client", "mob" ] because client is an instance of mob
     * Another example is if given GetGroup it will return [ "group" ] to chain methods
     * @param classPrefix
     * @private
     */
    private getCompletionPrefixesByPrefix(classPrefix: string): Array<string> {
        let prefixes: Array<any> = [];
        let prefixMappings       = {
            "client": ["client", "mob", "entity"],
            "npc": ["npc", "mob", "entity"],
            "object": ["object", "entity"],
            "corpse": ["corpse", "mob", "entity"],
        };

        // @ts-ignore
        if (prefixMappings[classPrefix]) {
            // @ts-ignore
            prefixes = prefixes.concat(prefixMappings[classPrefix]);
        } else {
            prefixes = [classPrefix];
        }

        if (classPrefix.includes("GetGroup")) {
            prefixes = ["group"];
        }
        if (classPrefix.includes("GetRaid")) {
            prefixes = ["raid"];
        }
        if (classPrefix.includes("GetExpedition")) {
            prefixes = ["expedition"];
        }

        // console.log("Completion prefixes are", prefixes);

        return prefixes;
    }
}
