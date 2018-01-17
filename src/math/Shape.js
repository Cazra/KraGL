'use strict';

import { AbstractError } from '../AbstractError';

/**
 * Superclass for all 2D and 3D geometric shapes.
 * @abstract
 * @memberof KraGL.math
 */
class Shape {
  constructor() {}

  /**
   * Checks if this shape is approximately equal to another shape.
   * @abstract
   * @param {KraGL.math.Shape} other
   * @param {number} [tolerance=KraGL.EPSILON]
   * @return {boolean}
   */
  approx(other, tolerance=KraGL.EPSILON) {
    _.noop(other, tolerance);
    throw new AbstractError('Must be implemented by subclass.');
  }

  /**
   * Produces a copy of this shape.
   * @return {KraGL.math.Shape}
   */
  clone() {
    throw new AbstractError('Must be implemented by subclass.');
  }

  /**
   * Checks if this shape contains a point.
   * @param {vec4} p
   * @param {number} [tolerance=KraGL.EPSILON]
   * @return {boolean}
   */
  contains(p, tolerance=KraGL.EPSILON) {
    return KraGL.math.approx(this.dist(p), 0, tolerance);
  }

  /**
   * Gets the distance from this shape to a point or another shape.
   * @abstract
   * @param {(vec4|KraGL.math.Shape)} other
   * @return {number}
   */
  dist(other) {
    _.noop(other);
    throw new AbstractError('Must be implemented by subclass.');
  }

  /**
   * Gets the intersection of this shape with some other shape. Undefined is
   * returned if there is no intersection.
   * @abstract
   * @param {KraGL.math.Shape} other
   * @param {number} [tolerance=KraGL.EPSILON]
   * @return {(vec4|KraGL.math.Shape)}
   */
  intersection(other, tolerance=KraGL.EPSILON) {
    _.noop(other, tolerance);
    throw new AbstractError('Must be implemented by subclass.');
  }

  /**
   * Checks whether this shape intersects with another shape.
   */
  intersects(other, tolerance) {
    return !!this.intersection(other, tolerance);
  }
}
export { Shape };
