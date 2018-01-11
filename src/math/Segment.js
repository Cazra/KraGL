'use strict';

import { LinearShape } from './LinearShape';

/**
 * A line finitely bound by 2 endpoints.
 * @memberof KraGL.math
 */
class Segment extends LinearShape {
  constructor(options) {
    super(options);
  }

  /**
   * @inheritdoc
   */
  approx(other, tolerance) {
    return other instanceof KraGL.math.Segment &&
      KraGL.math.Vectors.equal(this.p1, other.p1, tolerance) &&
      KraGL.math.Vectors.equal(this.p2, other.p2, tolerance);
  }

  /**
   * @inheritdoc
   */
  clone() {
    return new Segment({
      p1: this.p1,
      p2: this.p2
    });
  }

  /**
   * @inheritdoc
   */
  containsProjection(alpha) {
    return alpha >= 0 && alpha <= 1;
  }
}
export { Segment };
