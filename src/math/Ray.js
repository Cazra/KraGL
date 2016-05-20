define('KraGL.math.Ray', ['KraGL.math.AbstractLine'], function() {
  'use strict';

  /**
   * @class Ray
   * @memberof KraGL.math
   * @extends KraGL.math.AbstractLine
   * @classdesc A line that extends infinitely in one direction from a point.
   * @param {object} options
   *        See AbstractLine.
   */
  KraGL.math.Ray = class extends KraGL.math.AbstractLine {
    constructor(options) {
      super(options);
    }

    /**
     * @inheritdoc
     */
    approx(other, tolerance) {
      var uHat = vec3.normalize([], this.vec);
      var vHat = vec3.normalize([], other.vec);

      return other instanceof KraGL.math.Ray &&
        KraGL.math.Vectors.approx(this.p1, other.p1, tolerance) &&
        KraGL.math.Vectors.approx(uHat, vHat, tolerance);
    }

    /**
     * @inheritdoc
     */
    clone() {
      return this.toRay();
    }

    /**
     * A ray contains all of the points projected from its first point in the
     * direction of its vector.
     * @inheritdoc
     */
    containsProjection(alpha) {
      return alpha >= 0;
    }
  };
});
