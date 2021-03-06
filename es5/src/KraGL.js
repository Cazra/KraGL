
// Go ahead and define KraGL in the global scope.
var KraGL;
define('KraGL', ['underscore_ext'], function() {
  'use strict';

  /**
   * @class KraGL
   * @classdesc The top-level object encapsulating the KraGL library. This also
   * acts as a Web GL context.
   */
  KraGL = {

    /**
     * The default tolerance value.
     * @type {Number}
     */
    EPSILON: 0.00001,

    /**
     * Returns the version string in major.minor.build form.
     * @return {string}
     */
    getVersion: function() {
      return '0.1.0';
    }
  };
});
