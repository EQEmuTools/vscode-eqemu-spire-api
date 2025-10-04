import * as vscode from "vscode";
import { SpireLuaCompletions } from "./SpireLuaCompletions";
import { SpirePerlCompletions } from "./SpirePerlCompletions";

// @ts-ignore
// let api: Object; // spire api response cache

export class SpireCompletions {
  private c: vscode.ExtensionContext;
  private lua: SpireLuaCompletions;
  private perl: SpirePerlCompletions;

  constructor(c: vscode.ExtensionContext) {
    this.c = c;
    this.lua = new SpireLuaCompletions(c);
    this.perl = new SpirePerlCompletions(c);
  }

  async download() {
    console.time("completions process");
    const axios = require("axios");
    let r = await axios.get(
      "http://spire.eqemu.dev/api/v1/quest-api/definitions"
    );
    if (r.status === 200) {
      this.processDefinitions(r.data.data);
    }
    r = await axios.get(
      "http://spire.eqemu.dev/api/v1/quest-api/vscode-snippets"
    );
    if (r.status === 200) {
      this.processSnippets(r.data.data);
    }
    console.timeEnd("completions process");
  }

  private processDefinitions(api: Object) {
    this.lua.loadConstants(api);
    this.lua.loadMethods(api);
    this.lua.loadEvents(api);
    this.perl.loadConstants(api);
    this.perl.loadMethods(api);
    this.perl.loadEvents(api);

    this.lua.registerCompletionProvider();
    this.perl.registerCompletionProvider();
  }

  private processSnippets(data: Object) {
    let files = {};
    for (let file in data) {
      // @ts-ignore
      files[file] = data[file];
    }

    // @ts-ignore
    const manifest = JSON.parse(files["manifest.json"]);
    this.lua.loadSnippets(files, manifest.files);
    this.perl.loadSnippets(files, manifest.files);
  }
}
