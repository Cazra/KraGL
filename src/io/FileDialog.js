'use strict';

import { IOError } from './IOError';

// An invisible file input element used to present file open dialogs.
let fileInput = document.createElement('input');
fileInput.type = 'file';
let fileInputListener;

/**
 * @typedef {object} FileDialogOptions
 * @property {boolean} [multiple=false]
 *           Flag to allow multiple files to be selected.
 * @property {string} [accept]
 *           The MIME-type for files that are allowed to be selected.
 */

/**
 * Provides static methods for presenting file dialogs for uploading and
 * downloading data.
 */
export class FileDialog {

  /**
   * Produces a byte array for the contents of a file.
   * @param {File} file
   * @return {Promise<Uint8Array>}
   */
  static getFileBytes(file) {
    return new Promise((resolve, reject) => {
      let fr = new FileReader();
      fr.onload = () => {
        resolve(fr.result);
      };
      fr.onerror = () => {
        reject(new IOError(fr.error));
      };
      fr.readAsArrayBuffer(file);
    })
    .then(data => {
      return new Uint8Array(data);
    });
  }

  /**
   * Produces a data url for the contents of a file.
   * @param {File} file
   * @return {Promise<string>}
   */
  static getFileDataUrl(file) {
    return new Promise((resolve, reject) => {
      let fr = new FileReader();
      fr.onload = () => {
        resolve(fr.result);
      };
      fr.onerror = () => {
        reject(new IOError(fr.error));
      };
      fr.readAsDataURL(file);
    });
  }

  /**
   * Opens a file dialog to open a file from the user's file system.
   * @param {FileDialogOptions} opts
   * @return {Promise<(File|File[])>}
   *         Returns a list iff opts.multiple === true.
   */
  static openFile(opts) {
    return new Promise((resolve) => {
      fileInput.multiple = !!opts.multiple;
      fileInput.accept = opts.accept || '';

      // Replace the listener for resolving the opened file.
      fileInput.removeEventListener('change', fileInputListener);
      fileInputListener = fileEvt => {
        fileInput.removeEventListener('change', fileInputListener);

        let target = fileEvt.target;
        if(opts.multiple)
          resolve(target.files);
        else
          resolve(target.files[0]);
      };
      fileInput.addEventListener('change', fileInputListener);

      // Open the file dialog by programatically clicking our input element.
      fileInput.value = null;
      fileInput.click();
    });
  }

  /**
   * Opens a file dialog to save a blob of data to the user's file system.
   * @param {Blob} blob
   * @param {string} saveName
   */
  static saveBlob(blob, saveName) {
    // Create a temporary link to the blob and programatically click it
    // to open a save dialog.
    let objUrl = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.style.display = 'none';
    a.href = objUrl;
    a.download = saveName;
    document.body.appendChild(a);
    a.click();

    // Allow the link to exist just long enough for the download to work.
    setTimeout(() => {
      URL.revokeObjectURL(objUrl);
      a.remove();
    }, 0);
  }

  /**
   * Opens a file dialog to save text data to the user's file system.
   * @param {string} text
   * @param {string} saveName
   */
  static saveText(text, saveName) {
    let blob = new Blob([text], {type: 'text/html'});
    FileDialog.downloadBlob(blob, saveName);
  }
}
