'use strict';

/**
 * @namespace util
 * @memberof KraGL
 */

/**
 * Asynchronously sleeps and produces a resolved Promise when it's done.
 * @memberof KraGL.util
 * @param {uint} millis
 * @return {Promise}
 */
export function wait(millis=0) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, millis);
  });
}
