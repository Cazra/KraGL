
// Go ahead and define KraGL in the global scope.
var KraGL;
define('KraGL', [], function() {
  'use strict';

  /**
   * @class KraGL
   * @classdesc The top-level object encapsulating the KraGL library. This also
   * acts as a Web GL context.
   */
  KraGL = {

    /**
     * Returns the version string in major.minor.build form.
     * @return {string}
     */
    getVersion: function() {
      return '0.1.0';
    }
  };
});
