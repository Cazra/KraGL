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

    // Add all the WebGL constants to the global scope, prepended with "GL_".
    // This will allow the library and programs created with it to reference
    // things like GL_LINES in place of gl.LINES as a convenience.
    window["GL_" + key] = gl[key];
});

export { GLConstants };
