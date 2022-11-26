import * as vscode from "vscode";
import {SpireCompletions} from "./SpireCompletions";

export class Main {
    private c: vscode.ExtensionContext;

    constructor(c: vscode.ExtensionContext) {
        this.c = c;
    }

    public async run() {
        vscode.window.showInformationMessage("[SpireQuestAPI] Loading extension!");
        await SpireCompletions.download(this.c);
        vscode.window.showInformationMessage("[SpireQuestAPI] Extension loaded!");
    }

    dispose() {
    }
}
