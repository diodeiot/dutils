import * as path from "path";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
	console.log("activated");

	const fileName2MacroName = (fileName: string) => {
		let macroName = fileName.toUpperCase();
		macroName = macroName.replace(/[^a-zA-Z0-9]/g, '_');
		return macroName;
	};

	const goToLastLine = (editor: vscode.TextEditor) => {
		const document = editor.document;
		const lineCount = document.lineCount;
		const lastLine = document.lineAt(lineCount - 1);
		const lastCharIndex = lastLine.text.length;
		const endPosition = new vscode.Position(lineCount - 1, lastCharIndex);

		editor.selection = new vscode.Selection(endPosition, endPosition);
		editor.revealRange(new vscode.Range(endPosition, endPosition));
	};

	context.subscriptions.push(vscode.commands.registerCommand("dutils.addIncludeGuard", () => {
		const activeTextEditor = vscode.window.activeTextEditor;
		if (!activeTextEditor) {
			console.warn("no active text editor found");
			return;
		}

		const filePath = activeTextEditor.document.uri.fsPath
		const fileName = path.basename(filePath);

		let content = activeTextEditor.document.getText(activeTextEditor.selection);
		if (content.length == 0) {
			content = activeTextEditor.document.getText();
		}

		const m = fileName2MacroName(fileName);
		let newContent = `#ifndef ${m}\n#define ${m}\n${content}\n#endif /*${m}*/`;
		activeTextEditor.edit(editBuilder => {
			const entireRange = new vscode.Range(
				activeTextEditor.document.positionAt(0),
				activeTextEditor.document.positionAt(activeTextEditor.document.getText().length)
			);
			editBuilder.replace(entireRange, newContent);
			goToLastLine(activeTextEditor);
		});
	}));
}

export function deactivate() {
	console.log("deactivated");
}