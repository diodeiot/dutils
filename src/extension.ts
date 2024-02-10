import * as path from "path";
import * as vscode from "vscode";
import { FileNameSchema } from "./utility";
import z from "zod";

type FileLang = "C" | "C++";

const FileExtMap = Object.freeze({
	"C": "c",
	"C++": "cpp",
});

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

	const getFileName = async () => {
		const filename = vscode.window.showInputBox({
			title: "File name",
			prompt: "File name",
			placeHolder: "Please enter file name",
			validateInput: (value: string) => {
				try {
					FileNameSchema.parse(value);
				} catch (error) {
					if (error instanceof z.ZodError) {
						return error.errors[0].message
					}
				}
			}
		});
		return filename;
	};

	const createFile = async (filePath: string, content: string, open: boolean = false) => {
		const fileuri = vscode.Uri.file(filePath);
		await vscode.workspace.fs.writeFile(fileuri, Buffer.from(content, "utf-8"));
		if (open) {
			const document = await vscode.workspace.openTextDocument(fileuri);
			await vscode.window.showTextDocument(document, { preview: false });
		}
	}

	const createHeaderFile = (dir: string, name: string) => {
		const filename = name + ".h";
		const filePath = path.join(dir, filename);

		const m = fileName2MacroName(filename);
		const content = `#ifndef ${m}\n#define ${m}\n\n#endif /*${m}*/`;

		createFile(filePath, content, true);
	};

	const createSourceFile = (dir: string, name: string, lang: FileLang) => {
		const filename = name + "." + FileExtMap[lang];
		const headerFile = name + ".h";
		const filePath = path.join(dir, filename);

		const content = `#include "${headerFile}"\n`;

		createFile(filePath, content, true);
	};

	const createFiles = (dir: string, basename: string, lang: FileLang) => {
		createHeaderFile(dir, basename);
		createSourceFile(dir, basename, lang);
	}

	const createFilesHandler = async (fileLang: FileLang) => {
		let dir;

		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders || workspaceFolders.length < 1) {
			return;
		}

		if (workspaceFolders.length > 1) {
			const options: vscode.QuickPickOptions = {
				title: "Please select a workspace",
				placeHolder: "Workspace",
				canPickMany: false,
			};
			const workspaces = workspaceFolders.map(workspace => {
				return {
					label: workspace.name,
					description: workspace.uri.path
				};
			});
			const selectedWorkspace = await vscode.window.showQuickPick(workspaces, options);
			if (!selectedWorkspace) {
				return;
			}
			dir = selectedWorkspace.description;
		}
		else {
			dir = workspaceFolders[0].uri.path;
		}

		console.log("directory=", dir);

		let filename = await getFileName();
		filename = FileNameSchema.parse(filename);
		if (!filename) {
			return;
		}
		console.log("filename=", filename);
		createFiles(dir, filename, fileLang);
	};

	context.subscriptions.push(vscode.commands.registerCommand("dutils.createCFiles", () => {
		createFilesHandler("C");
	}));

	context.subscriptions.push(vscode.commands.registerCommand("dutils.createCppFiles", () => {
		createFilesHandler("C++");
	}));
}

export function deactivate() {
	console.log("deactivated");
}