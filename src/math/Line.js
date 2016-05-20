define('KraGL.math.Line', ['KraGL.math.AbstractLine'], function() {
  'use strict';

  /**
   * @class Line
   * @memberof KraGL.math
   * @extends KraGL.math.AbstractLine
   * @classdesc A line in 3D space extending infinitely in both directions.
   * @param  {object} options
   *         See AbstractLine.
   */
  KraGL.math.Line = class extends KraGL.math.AbstractLine {
    constructor(options) {
      super(options);
    }

    /**
     * @inheritdoc
     */
    approx(other, tolerance) {
      return other instanceof KraGL.math.Line &&
        this.contains(other.p1, tolerance) &&
        this.contains(other.p2, tolerance);
    }

    /**
     * @inheritdoc
     */
    clone() {
      return this.toLine();
    }

    /**
     * A line contains all of its projected points.
     * @inheritdoc
     */
    containsProjection(alpha) {
      _.noop(alpha);
      return true;
    }
  };
});
