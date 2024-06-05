#!/bin/bash

if [ $# -ne 2 ]; then
    echo "Usage: $0 <source_directory> <destination_directory>"
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
