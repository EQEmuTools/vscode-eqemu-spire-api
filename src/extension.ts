// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Main } from './app/Main';

export async function activate(c: vscode.ExtensionContext) {
    await (new Main(c)).run();
}

// This method is called when your extension is deactivated
export function deactivate() {
}
