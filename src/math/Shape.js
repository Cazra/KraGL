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
  KraGL.math.Shape = class Shape {
    constructor() {}

    /**
     * Checks if this Shape is approximately equal to another Shape.
     * @param  {KraGL.math.Shape} other
     * @param {number} [tolerance=KraGL.EPSILON]
     * @return {Boolean}
     */
    approx(other, tolerance) {
      _.noop(other, tolerance);
      throw new Error('Must be implemented by subclass.');
    }

    /**
     * Checks if this shape contains a point, within some level of
     * tolerance for distance.
     * @param  {vec4} p
     * @param  {number} [tolerance=KraGL.EPSILON]
     * @return {boolean}
     */
    contains(p, tolerance) {
      return KraGL.Math.approx(this.dist(p), 0, tolerance);
    }

    /**
     * Gets the distance from this shape to either a point or some
     * other shape.
     * @abstract
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
     * @abstract
     * @param  {KraGL.math.Shape} shape
     * @param {number} [tolerance=KraGL.EPSILON]
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
     * @param {number} [tolerance=KraGL.EPSILON]
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

    /**
     * Checks if a subclass of this class implements all of its abstract
     * methods.
     * A warning is printed to the console for any abstract methods that are
     * not implemented.
     */
    static checkImpl(clazz) {
      return _.checkAbstractImpl(clazz, this, [
        'approx',
        'clone',
        'distanceTo',
        'intersection',
        'render'
      ]);
    }
  };

  _.aliasMethods(KraGL.math.Shape, {
    dist: 'distanceTo'
  });
});
