'use strict';

import { LinearShape } from './LinearShape';

/**
 * A line extending infinitely in 1 direction.
 * @memberof KraGL.math
 * @extends KraGL.math.LinearShape
 */
class Ray extends LinearShape {
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
    return new Ray({
      p1: this.p1,
      p2: this.p2
    });
  }

  /**
   * @inheritdoc
   */
  containsProjection(alpha) {
    return alpha >= 0;
  }
}
export { Ray };
