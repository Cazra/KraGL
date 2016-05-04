define('KraGL.math.Shape', ['KraGL.math'], function() {
  'use strict';

  /**
   * @abstract
   * @class Shape
   * @memberof KraGL.math
   * @implements {Renderable}
   * @implements {Cloneable}
   * @classdesc Abstract base class for 2D and 3D shapes.
   */
  KraGL.math.Shape = class {
    constructor() {}

    /**
     * Checks if this shape contains a point, within some level of
     * tolerance for distance.
     * @param  {vec4} p
     * @param  {number} [tolerance=0]
     * @return {boolean}
     */
    contains(p, tolerance) {
      return KraGL.Math.approx(this.dist(p), 0, tolerance);
    }

    /**
     * Gets the distance from this shape to either a point or some
     * other shape.
     * @param  {(vec4|KraGL.math.Shape)} shape
     * @return {number}
     */
    distanceTo(shape) {
      _.noop(shape);
      throw new Error('Must be implemented by subclass.');
    }

    /**
     * Gets the intersection of this shape with some other shape,
     * or undefined if there is no intersection.
     * @param  {KraGL.math.Shape} shape
     * @param {number} [tolerance=0]
     *   The tolerance for how close they can be to be considered
     *   "close enough" for an intersection.
     * @return {(vec4|KraGL.math.Shape)}
     */
    intersection(shape, tolerance) {
      _.noop(shape, tolerance);
      throw new Error('Must be implemented by subclass');
    }

    /**
     * Checks whether this shape intersects another shape.
     * @param  {KraGL.math.Shape} shape
     * @param {number} [tolerance=0]
     *   The tolerance for how close they can be to be considered
     *   "close enough" for an intersection.
     * @return {boolean}
     */
    intersects(shape, tolerance) {
      return !!this.intersection(shape, tolerance);
    }

    /**
     * @inheritdoc
     */
    render(ctx) {
      _.noop(ctx);
      throw new Error('Must be implemented by subclass.');
    }
  };

  // Define some method aliases.
  var proto = KraGL.math.Shape.prototype;
  _.extend(proto, {
    dist: function(shape) {
      return this.distanceTo(shape);
    }
  });
});
