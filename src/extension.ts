import * as path from "path";

import * as vscode from "vscode";
import z from "zod";

import { FileNameSchema } from "./models/schemas/file";
import { FileExtMap, FileLang } from "./models/types/file";
import { fileName2MacroName, getFileContent } from "./fileContent";
import { bytesToCArray, hex2Bytes, hexClean, normalize } from "./utility";

export function activate(context: vscode.ExtensionContext) {
	console.log("activated");

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

		const filePath = activeTextEditor.document.uri.fsPath;
		const fileName = path.basename(filePath);

		let content = activeTextEditor.document.getText(activeTextEditor.selection);
		if (content.length === 0) {
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
		const filename = await vscode.window.showInputBox({
			title: "File name",
			prompt: "File name",
			placeHolder: "Please enter file name",
			validateInput: (value: string) => {
				try {
					FileNameSchema.parse(value);
				} catch (error) {
					if (error instanceof z.ZodError) {
						return error.errors[0].message;
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
	};

	const createHeaderFile = (dir: string, name: string, lang: FileLang) => {
		const content = getFileContent(name, lang, "Header");
		createFile(path.join(dir, name + ".h"), content, true);
	};

	const createSourceFile = (dir: string, name: string, lang: FileLang) => {
		const content = getFileContent(name, lang, "Source");
		createFile(path.join(dir, name + "." + FileExtMap[lang]), content, true);
	};

	const createFiles = (dir: string, name: string, lang: FileLang) => {
		createHeaderFile(dir, name, lang);
		createSourceFile(dir, name, lang);
	};

	const createFilesHandler = async (fileLang: FileLang) => {
		let dir;

		const workspaceFolders = vscode.workspace.workspaceFolders;
		if (!workspaceFolders || workspaceFolders.length < 1) {
			console.log("no workspace found");
			return;
		}

		if (vscode.window.activeTextEditor) {
			dir = path.dirname(vscode.window.activeTextEditor.document.uri.path);
		}
		else if (workspaceFolders.length > 1) {
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

		let filename;
		try {
			filename = await getFileName();
			if (!filename) {
				return;
			}
			filename = FileNameSchema.parse(filename);
		} catch (error) {
			return;
		}
		console.log("filename=", filename);
		createFiles(dir, filename!, fileLang);
	};

	context.subscriptions.push(vscode.commands.registerCommand("dutils.createCFiles", () => {
		createFilesHandler("C");
	}));

	context.subscriptions.push(vscode.commands.registerCommand("dutils.createCppFiles", () => {
		createFilesHandler("C++");
	}));

	context.subscriptions.push(vscode.commands.registerCommand("dutils.hex2bytes", () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const selection = editor.selection;
			const selectedText = editor.document.getText(selection);
			editor.edit(editBuilder => {
				const hex = hexClean(selectedText);
				editBuilder.replace(selection, hex2Bytes(Buffer.from(hex, "hex")));
			});
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand("dutils.hex2CArr", () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const selection = editor.selection;
			const selectedText = editor.document.getText(selection);
			editor.edit(editBuilder => {
				const hex = hexClean(selectedText);
				editBuilder.replace(selection, bytesToCArray(Buffer.from(hex, "hex")));
			});
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand("dutils.normalize", () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const selection = editor.selection;
			const selectedText = editor.document.getText(selection);
			editor.edit(editBuilder => {
				editBuilder.replace(selection, normalize(selectedText));
			});
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand("dutils.normalizeRev", () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const selection = editor.selection;
			const selectedText = editor.document.getText(selection);
			editor.edit(editBuilder => {
				editBuilder.replace(selection, normalize(selectedText, true));
			});
		}
	}));

	context.subscriptions.push(vscode.workspace.onDidCreateFiles(async (event) => {
		for (let file of event.files) {
			const fileUri = vscode.Uri.file(file.path);
			const fileContentBuffer = await vscode.workspace.fs.readFile(fileUri);
			const fileContent = Buffer.from(fileContentBuffer).toString("utf-8");
			if (fileContent.length > 0) {
				return;
			}
			if (path.parse(file.path).ext.toLowerCase() !== ".h") {
				return;
			}
			const document = await vscode.workspace.openTextDocument(fileUri);
			const fileName = path.parse(file.path).name;
			const newFileContent = getFileContent(fileName, "C", "Header");
			const edit = new vscode.WorkspaceEdit();
			edit.insert(fileUri, new vscode.Position(0, 0), newFileContent);
			await vscode.workspace.applyEdit(edit);
			await document.save();
		}
	}));
}

export function deactivate() {
	console.log("deactivated");
}