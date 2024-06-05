
# Bash Script Documentation

## Overview

This bash script copies all `.txt` files from a source directory to a destination directory. It performs the following tasks:
1. Checks if the correct number of arguments is provided.
2. Verifies if the destination directory exists.
3. Copies `.txt` files from the source directory to the destination directory.
4. Verifies if the files were successfully copied.

## Usage

```bash
./script.sh <source_directory> <destination_directory>
```

- `<source_directory>`: The directory from which `.txt` files will be copied.
- `<destination_directory>`: The directory to which `.txt` files will be copied.

## Script Details

```bash
#!/bin/bash

if [ $# -ne 2 ]; then
    echo "Uso: $0 <diretório_origem> <diretório_destino>"
    exit 1
fi

SOURCE_DIR=$1
DEST_DIR=$2

check_if_destination_folder_exists() {
    if [ ! -d "$DEST_DIR" ]; then
        echo "The destination directory '$DEST_DIR' does not exist. Create it and try again."
        exit 1
    fi
}

copy_txt_files() {
    cp "$SOURCE_DIR"/*.txt "$DEST_DIR"
}

verify_if_files_copied() {
    if [ $? -eq 0 ]; then
        echo "Successfully copied .txt files to '$DEST_DIR' directory."
    else
        echo "Failed to copy files."
        exit 1
    fi
}

check_if_destination_folder_exists
copy_txt_files
verify_if_files_copied
exit 0
```

## Functions

### `check_if_destination_folder_exists`
Checks if the destination directory exists. If it does not, the script prints an error message and exits with status 1.

### `copy_txt_files`
Copies all `.txt` files from the source directory to the destination directory.

### `verify_if_files_copied`
Verifies if the files were successfully copied. If the copy operation fails, the script prints an error message and exits with status 1.

## Exit Status
- `0`: The script executed successfully.
- `1`: An error occurred during the execution of the script.

## Example

To copy `.txt` files from `/path/to/source` to `/path/to/destination`:

```bash
./script.sh /path/to/source /path/to/destination
```
