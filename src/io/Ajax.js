'use strict';

import { FileDialog } from './FileDialog';
import { IOError } from './IOError';

/**
 * @typedef {object} AjaxOptions
 * @property {map<string, string>} [headers]
 *            The request headers.
 * @property {string} [requestType='json']
 *           The data format for the request body. This can be any
 *           appropriate value for XMLHttpRequest.responseType.
 * @property {string} [responseType]
 *           Any appropriate value for XMLHttpRequest.responseType.
 * @property {function} [onProgress]
 *           Handler for progress events. Accepts a XHR progress event as
 *           its argument.
 * @property {any} [body]
 *           The content for the request body.
 */

/**
 * Contains static methods for loading external resources using AJAX.
 * @memberof KraGL.io
 */
export class Ajax {

  /**
   * Makes an AJAX call.
   * @private
   * @param {string} method
   * @param {string} url
   * @param {AjaxOptions} [opts]
   * @return {Promise<XMLHttpRequest>}
   */
  static _call(method, url, opts) {
    return new Promise((resolve, reject) => {
      opts = opts || {};
      _.defaults(opts, {
        headers: {},
        responseType: 'text'
      });

      // Prepare the request body.
      if(opts.requestType === 'json') {
        opts.headers['content-type'] = 'application/json';
        opts.body = JSON.stringify(opts.body);
      }
      else if(['arraybuffer', 'blob'].includes(opts.requestType))
        opts.headers['content-type'] = 'application/octet-binary';

      // Create the AJAX call.
      let xhr = new XMLHttpRequest();
      xhr.open(method, url);

      // Set any request headers.
      if(opts.headers) {
        _.each(opts.headers, (value, header) => {
          xhr.setRequestHeader(header, value);
        });
      }
      if(opts.responseType)
        xhr.responseType = opts.responseType;

      // Handle progress events if we are given a handler for them.
      if(opts.onProgress)
        xhr.addEventListener('progress', opts.onProgress);

      // Success handler
      xhr.addEventListener('load', () => {
        if(xhr.status === 200)
          resolve(xhr);
        else {
          console.error(xhr);
          reject(new IOError(`${xhr.status}: ${xhr.response ||
            xhr.statusText}`));
        }
      });

      // Error handlers
      xhr.addEventListener('error', () => {
        console.error(xhr);
        reject(new IOError(`Failed: ${xhr.response}`));
      });
      xhr.addEventListener('abort', () => {
        console.error(xhr);
        reject(new IOError(`Aborted: ${xhr.response}`));
      });

      xhr.send(opts.body);
    });
  }

  /**
   * Downloads a file from a remote resource.
   * @param {string} url
   * @param {string} downloadName
   *        The default name for the downloaded file in the save file dialog.
   * @param {AjaxOptions} [opts]
   */
  static download(url, downloadName, opts) {
    return Ajax.getBlob(url, opts)
    .then(blob => {
      FileDialog.saveBlob(blob, downloadName);
    });
  }

  /**
   * Loads some external resource. By default, this loads it as text unless
   * the responseType is specified as something else.
   * @param {string} url
   * @param {AjaxOptions} [opts]
   * @return {Promise<any>}
   */
  static get(url, opts) {
    return Ajax._call('GET', url, opts)
    .then(xhr => {
      return xhr.response;
    });
  }

  /**
   * Loads an array of binary data from an external resource.
   * @param {string} url
   * @param {AjaxOptions} [opts]
   * @return {Promise<ArrayBuffer>}
   */
  static getBinary(url, opts) {
    opts = opts || {};
    opts.responseType = 'arraybuffer';
    return Ajax.get(url, opts);
  }

  /**
   * Loads a binary blob from an external resource.
   * @param {string} url
   * @param {AjaxOptions} [opts]
   * @return {Promise<Blob>}
   */
  static getBlob(url, opts) {
    opts = opts || {};
    opts.responseType = 'blob';
    return Ajax.get(url, opts);
  }

  /**
   * Loads JSON data from an external resource.
   * @param {string} url
   * @param {AjaxOptions} [opts]
   * @return {Promise<any>}
   */
  static getJson(url, opts) {
    opts = opts || {};
    opts.responseType = 'json';
    return Ajax.get(url, opts);
  }

  /**
   * Loads text from an external resource.
   * @param {string} url
   * @param {AjaxOptions} [opts]
   * @return {Promise<string>}
   */
  static getText(url, opts) {
    opts = opts || {};
    opts.responseType = 'text';
    return Ajax.get(url, opts);
  }
}
