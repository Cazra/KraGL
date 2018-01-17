'use strict';

import { LinearShape } from './LinearShape';

/**
 * A line extending infinitely in 2 directions.
 * @memberof KraGL.math
 * @extends KraGL.math.LinearShape
 */
class Line extends LinearShape {
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
    return new Line({
      p1: this.p1,
      p2: this.p2
    });
  }

  /**
   * @inheritdoc
   */
  containsProjection(alpha) {
    return !isNaN(alpha);
  }
}
export { Line };
