'use strict';

/**
 * A collection of the WebGLRenderingContext constants.
 * @see {@link
 * https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants|
 * WebGL Constants}
 * @namespace GLConstants
 * @memberof KraGL
 */

let constRegex = /^[A-Z]{2,}/;
let canvas = document.createElement('canvas');
let gl = canvas.getContext('webgl');

// Just grab all the constants that would normally be on a gl object.
let GLConstants = {};
_.each(_.allKeys(gl), key => {
  if(constRegex.test(key))
    GLConstants[key] = gl[key];
});

export { GLConstants };
