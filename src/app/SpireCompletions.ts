import * as vscode from "vscode";
import {SpireLuaCompletions} from "./SpireLuaCompletions";
import {SpirePerlCompletions} from "./SpirePerlCompletions";

// @ts-ignore
// let api: Object; // spire api response cache

export class SpireCompletions {
    private c: vscode.ExtensionContext;
    private lua: SpireLuaCompletions;
    private perl: SpirePerlCompletions;

    constructor(c: vscode.ExtensionContext) {
        this.c    = c;
        this.lua  = new SpireLuaCompletions(c);
        this.perl = new SpirePerlCompletions(c);
    }

    async download() {
        console.time("completions process");
        const axios = require('axios');
        const r     = await axios.get("http://spire.akkadius.com/api/v1/quest-api/definitions");
        if (r.status === 200) {
            this.processDefinitions(r.data.data);
        }
        console.timeEnd("completions process");
    }

    private processDefinitions(api: Object) {
        this.lua.processConstants(api);
    }
}
