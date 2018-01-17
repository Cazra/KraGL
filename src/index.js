'use strict';

import { GLConstants } from './GLConstants';
import { materials } from './materials';
import { math } from './math';

/**
 * The top-level KraGL namespace.
 * @namespace KraGL
 */
window.KraGL = (() => {

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
    EPSILON,
    GLConstants,
    getVersion,
    materials,
    math
  };
})();
