define('KraGL.math.AbstractLine', ['KraGL.math.Shape'], function() {
  'use strict';

  /**
   * @class AbstractLine
   * @memberof KraGL.math
   * @extends KraGL.math.Shape
   * @classdesc Abstract base class for line-like shapes, such as Lines,
   * Rays, and Segments.
   * @param  {object} options
   * @param {vec4} p1
   *        A point that the line passes through.
   * @param {vec4} p2
   *        Another point that the line passes through.
   */
  KraGL.math.AbstractLine = class extends KraGL.math.Shape {
    constructor(p1, p2) {
      super();
      this._p1 = KraGL.Math.toVec4(p1);
      this._p2 = KraGL.Math.toVec4(p2);
    }

    /**
     * Finds the parametric coefficients for the closest projected points on this and
     * line. This is meant as a helper method for the AbstractLine distanceTo and
     * intersection implementations.
     *
     * See
     * http://homepage.univie.ac.at/franz.vesely/notes/hard_sticks/hst/hst.html
     *
     * @protected
     * @param {KraGL.math.AbstractLine} line
     * @return {vec2}
     *         The first value is this line's coefficient.
     *         The second value is the other line's coefficient.
     */
    _getClosestLineCoeffs(other) {
      var u = this.getVector();
      var uHat = vec3.normalize([], u);
      var v = other.getVector();
      var vHat = vec3.normalize([], v);
      var z = vec3.sub([], other._p1, this._p1);

      var dotUV = vec3.dot(uHat, vHat);
      var dotUZ = vec3.dot(uHat, z);
      var dotVZ = vec3.dot(vHat, z);

      var alpha = (dotUZ-dotUV*dotVZ) / (1-dotUV*dotUV) / vec3.len(u);
      var beta = (dotUV*dotUZ-dotVZ) / (1-dotUV*dotUV) / vec3.len(v);
      return [alpha, beta];
    }

    /**
     * Gets the quaternion for rotating the positive X axis [1, 0, 0] to
     * this line's vector.
     * @return {quat}
     */
    getQuaternion() {
      var u = [1,0,0];
      var v = this.getVector();
      return KraGL.Math.quatFromTo(u, v);
    }

    /**
     * Gets the vector from the first point to the second point.
     * @return {vec3}
     */
    getVector() {
      return vec3.sub([], this._p2, this._p1);
    }

    /**
     * Checks whether this AbstractLine is paralell to another AbstractLine.
     * @param  {KraGL.math.AbstractLine}  other
     * @return {boolean}
     */
    isParallel(other) {
      var u = this.getVector();
      var v = other.getVector();
      return vec3.len(vec3.cross([], u, v)) === 0;
    }


    /**
     * Gets a copy of the first point.
     * @param {Vec4} xyz
     * @return {vec4}
     */
    p1(p) {
      if(p) {
        this._p1 = KraGL.Math.toVec4(p);
      }
      return _.clone(this._p1);
    }

    /**
     * Gets a copy of the second point.
     * @return {vec3}
     */
    p2(p) {
      if(p) {
        this._p2 = KraGL.Math.toVec4(p);
      }
      return _.clone(this._p2);
    }

    /**
     * Alias for p1().
     */
    point1(p) {
      return this.p1(p);
    }

    /**
     * Alias for p2().
     */
    point2(p) {
      return this.p2(p);
    }

    /**
     * Produces a new Line from this shape.
     * @return {KraGL.math.Line}
     */
    toLine() {
      return new KraGL.math.Line(this._p1, this._p2);
    }

    /**
     * Produces a new Ray from this shape.
     * @return {KraGL.math.Ray}
     */
    toRay() {
      return new KraGL.math.Ray(this._p1, this._p2);
    }

    /**
     * Produces a new Segment from this shape.
     * @return {KraGL.math.Segment}
     */
    toSegment() {
      return new KraGL.math.Segment(this._p1, this._p2);
    }
  };
});
