'use strict';

import { GLConstants } from './GLConstants';
import { KraGLError } from './KraGLError';
import * as app from './app';
import * as cameras from './cameras';
import * as geo from './geo';
import * as img from './img';
import * as io from './io';
import * as materials from './materials';
import * as math from './math';
import * as shaders from './shaders';
import * as util from './util';

/**
 * The top-level KraGL namespace.
 * @namespace KraGL
 */
window.KraGL = (() => {

  /**
   * The ID of the optional DOM container used to store KraGL's
   * debugging elements. This element is not automatically created.
   * If you want to examine debugging elements, you'll need to add this onto
   * your app's page yourself.
   * @type {string}
   * @memberof KraGL
   */
  const DEBUG_ELEM_ID = 'KraGL_imgDebug';

  /**
   * A tiny number used as a tolerance for approximations.
   * @memberof KraGL
   */
  const EPSILON = glMatrix.EPSILON;

  /**
   * Gets the version of KraGL.
   * @memberof KraGL
   * @return {string}
   */
  function getVersion() {
    return `KRAGL_VERSION`;
  }

  return {
    DEBUG_ELEM_ID,
    EPSILON,
    GLConstants,
    KraGLError,
    app,
    cameras,
    geo,
    getVersion,
    img,
    io,
    materials,
    math,
    shaders,
    util
  };
})();
