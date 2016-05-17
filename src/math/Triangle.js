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
      var p1 = options.p1 || options.p;
      var p2 = options.p2;
      var p3 = options.p3;
      var u = options.u;
      var v = options.v;

      this.p1 = p1;
      this.p2 = p2 || KraGL.math.Transforms.translatePt(p1, u);
      this.p3 = p3 || KraGL.math.Transforms.translatePt(p1, v);
    }

    /**
     * Gets the triangle's surface normal vector (assumes the points are in
     * CCW order).
     * @return {vec3}
     */
    getNormal() {
      return vec3.cross([], this.vecU(), this.vecV());
    }

    /**
     * The triangle's unit surface normal (uHat x vHat).
     * @type {vec3}
     */
    get normal() {
      return vec3.normalize([], vec3.cross([], this.u, this.v));
    }
    set normal(n) {
      _.noop(n);
      throw new Error('Cannot set normal.');
    }

    /**
     * The first point.
     * @type {vec4}
     */
    get point1() {
      return this._p1;
    }
    set point1(p) {
      this._p1 = vec4.copy([], p);
      this._p1[3] = 1;
    }

    /**
     * The second point.
     * @type {vec4}
     */
    get point2() {
      return this._p2;
    }
    set point2(p) {
      this._p2 = vec4.copy([], p);
      this._p2[3] = 1;
    }

    /**
     * The third point.
     * @type {vec4}
     */
    get point3() {
      return this._p3;
    }
    set point3(p) {
      this._p3 = vec4.copy([], p);
      this._p3[3] = 1;
    }

    /**
     * The vector from point1 to point2.
     * @type {vec3}
     */
    get vectorU() {
      return vec3.sub([], this.p2, this.p1);
    }
    set vectorU(u) {
      this.p2 = KraGL.math.Transforms.translatePt(this.p1, u);
    }

    /**
     * The vector from point1 to point3.
     * @type {vec3}
     */
    get vectorV() {
      return vec3.sub([], this._p3, this.p1);
    }
    set vectorV(v) {
      this.p3 = KraGL.math.Transforms.translatePt(this.p1, v);
    }
  };

  _.aliasProperties(KraGL.math.Triangle, {
    n: 'normal',
    p1: 'point1',
    p2: 'point2',
    p3: 'point3',
    u: 'vectorU',
    v: 'vectorV'
  });
});
