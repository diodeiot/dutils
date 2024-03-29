# dutils

```dutils``` is a vs-code extension that includes various utility commands.

## Installation
Open VS Code and press <kbd>F1</kbd> or <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> *or* <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> to open command palette, select **Install Extension** and type `dutils`.

Or launch VS Code Quick Open (<kbd>Ctrl</kbd> + <kbd>P</kbd> *or* <kbd>Cmd</kbd> + <kbd>P</kbd> ), paste the following command, and press enter.
```bash
ext install dutils
```

You can also install directly from the Marketplace within Visual Studio Code, searching for `dutils`.

## Commands
This extension provides several commands in the Command Palette (<kbd>F1</kbd> or <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> *or* <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>) for working with any files.

- **dutils: Add include guard**: Adds include guard to the active file. If selection is empty, entire file content will be enclosed by the generated include guard. If selection is not empty, entire file content will be replaced by the include guard and selection.

- **dutils: Create C source & header files**: Creates C source and header files. If any file is active, these files will be created under that file's directory. Otherwise, directory will be workspace root.
  
- **dutils: Create C++ source & header files**: Creates C++ source and header files. If any file is active, these files will be created under that file's directory. Otherwise, directory will be workspace root.
  
- **dutils: Convert hex string to comma seperated bytes**: Converts hex string to comma seperated bytes.

- **dutils: Convert hex string to C/C++ array**: Converts hex string to C/C++ bytes array.

- **dutils: Normalize hex string**: Normalizes hex string.
  
- **dutils: Normalize hex string with reversed order**: Normalizes hex string with reserve order.

## Triggered Actions
- Include guard will be inserted when empty header file is created. 

## Options
| Option                                         | Description                                                   | Default |
| ---------------------------------------------- | ------------------------------------------------------------- | ------- |
| `dutils.include-guard-on-header-file-creation` | Controls auto inserting include guard on header file creation | true    |

## Release Notes

### Version 1.6.0

- Default case sensitivity changed to "lower" case.

## Development
Maintainer Kadir Sevil <<kadir.sevil@diodeiot.com>>

Publisher Diode IoT Inc. <<info@diodeiot.com>>

## Contribution

Contributions to the repository are welcome.

---