define('KraGL.math.Segment', ['KraGL.math.AbstractLine'], function() {
  'use strict';

  /**
   * @class Segment
   * @memberof KraGL.math
   * @extends KraGL.math.AbstractLine
   * @classdesc A finite line bounded between two points.
   * @param {vec4} p1
   *        The first endpoint.
   * @param {vec4} p2
   *        The second endpoint.
   */
  KraGL.math.Segment = class extends KraGL.math.AbstractLine {
    constructor(p1, p2) {
      super(p1, p2);
    }

    /**
     * @inheritdoc
     */
    clone() {
      return this.toSegment();
    }

    /**
     * A segment only contains the points between its endpoints, inclusively.
     * @inheritdoc
     */
    containsProjection(alpha) {
      return alpha >= 0 && alpha <= 1;
    }
  };

});
