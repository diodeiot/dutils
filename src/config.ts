import * as vscode from "vscode";

export type Config = {
    include_guard_on_header_file_creation: boolean
};

export function getConfig(): Config {
    const c = vscode.workspace.getConfiguration("dutils");
    const config: Config = {
        include_guard_on_header_file_creation: c.get("include-guard-on-header-file-creation") as boolean,
    };
    return config;
}