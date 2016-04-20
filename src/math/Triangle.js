define('KraGL.math.Triangle', ['KraGL.math.Shape'], function() {
  'use strict';

  /**
   * @class Triangle
   * @memberof KraGL.math
   * @extends KraGL.math.Shape
   * @classdesc A triangle defined by either 3 points or 1 point and 2 vectors.
   * To define the triangle by its points, specify the options p1, p2, and p3
   * in the constructor.
   * To define the triangle by one point and two vectors, specify the options
   * p, u, and v.
   * @param {object} options
   * @param {vec4} [options.p1]
   *        The first point.
   * @param {vec4} [options.p2]
   *        The second point.
   * @param {vec4} [options.p3]
   *        The third point.
   * @param {vec4} [options.p]
   *        The first point.
   * @param {vec3} [options.u]
   *        The vector from the first point to the second point.
   * @param {vec3} [options.v]
   *        The vector from the first point to the third point.
   */
  KraGL.math.Triangle = class extends KraGL.math.Shape {
    constructor(options) {
      this._p1 = _.clone(options.p1) || _.clone(options.p);
      this._p2 = _.clone(options.p2) ||
        KraGL.Math.translate(options.p, options.u);
      this._p3 = _.clone(options.p3) ||
        KraGL.Math.translate(options.p, options.v);
    }

    /**
     * @inheritdoc
     */
    distanceTo(shape) {

    }

    /**
     * Gets the triangle's surface normal vector (assumes the points are in
     * CCW order).
     * @return {vec3}
     */
    getNormal() {
      return vec3.cross([], this.getVectorU(), this.getVectorV());
    }

    /**
     * Alias for point1().
     */
    p1(p) {
      return this.point1(p);
    }

    /**
     * Alias for point2().
     */
    p2(p) {
      return this.point2(p);
    }

    /**
     * Alias for point3().
     */
    p3(p) {
      return this.point3(p);
    }

    /**
     * Gets/sets the first point.
     * @param  {vec4} p
     * @return {vec4}
     */
    point1(p) {
      if(p) {
        this._p1 = _.clone(p);
      }
      return _.clone(this._p1);
    }

    /**
     * Gets/sets the second point.
     * @param  {vec4} p
     * @return {vec4}
     */
    point2(p) {
      if(p) {
        this._p2 = _.clone(p);
      }
      return _.clone(this._p2);
    }

    /**
     * Gets/sets the third point.
     * @param  {vec4} p
     * @return {vec4}
     */
    point3(p) {
      if(p) {
        this._p3 = _.clone(p);
      }
      return _.clone(this._p3);
    }

    /**
     * Gets/sets the vector U from p1 to p2.
     * @param {vec3} u
     * @return {vec3}
     */
    vectorU(u) {
      if(u) {
        this._p2 = KraGL.Math.translate(this._p1, u);
        return _.clone(u);
      }
      else {
        return vec3.sub([], this._p2, this._p1);
      }
    }

    /**
     * Gets/sets the vector V from p1 to p3.
     * @param  {vec3} v
     * @return {vec3}
     */
    vectorV(v) {
      if(v) {
        this._p3 = KraGL.Math.translate(this._p1, v);
        return _.clone(v);
      }
      else {
        return vec3.sub([], this._p3, this._p1);
      }
    }
  }
});
