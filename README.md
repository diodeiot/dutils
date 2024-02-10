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
  
## Release Notes

### Version 1.2.0

- Added placing sample C++ class to the generated C++ files feature.

## Development
Maintainer Kadir Sevil <<kadir.sevil@diodeiot.com>>

Publisher Diode IoT Inc. <<info@diodeiot.com>>

## Contribution

Contributions to the repository are welcome.

---