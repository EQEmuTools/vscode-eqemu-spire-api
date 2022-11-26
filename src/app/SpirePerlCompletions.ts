import * as vscode from "vscode";

export class SpirePerlCompletions {
    private c: vscode.ExtensionContext;

    constructor(c: vscode.ExtensionContext) {
        this.c = c;
    }
}
