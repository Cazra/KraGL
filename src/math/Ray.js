define('KraGL.math.Ray', ['KraGL.math.AbstractLine'], function() {
  'use strict';

  /**
   * @class Ray
   * @memberof KraGL.math
   * @extends KraGL.math.AbstractLine
   * @classdesc A line that extends infinitely in one direction from a point.
   */
  KraGL.math.Ray = class extends KraGL.math.AbstractLine {
    constructor(p1, p2) {
      super(p1, p2);
    }

    /**
     * @inheritdoc
     */
    clone() {
      return new KraGL.math.Ray(this._p1, this._p2);
    }

    /**
     * @inheritdoc
     */
    distanceTo(shape) {
      if(shape instanceof KraGL.math.Shape) {
        if(shape instanceof KraGL.math.AbstractLine) {
          return this._distanceToAbstractLine(shape);
        }
        throw new Error('Not implemented yet.');
      }

      return this._distanceToPoint(shape);
    }

    /**
     * Returns the distance from this Ray to some AbstractLine.
     * @param  {KraGL.math.AbstractLine} line
     * @return {number}
     */
    _distanceToAbstractLine(line) {
      var coeffs = this._getClosestLineCoeffs(line);
      var s = coeffs[0];
      var t = coeffs[1];

      if(s >= 0 && (
        line instanceof KraGL.math.Line ||
        (line instanceof KraGL.math.Ray && t >= 0) ||
        (line instanceof KraGL.math.Segment && t >= 0 && t<= 1)
      )) {
        var a = vec3.add([], this._p1, vec3.scale([], s, u));
        var b = vec3.add([], other._p1, vec3.scale([], t, v));
        return vec3.len(vec3.sub([], a, b));
      }
      else {
        return line.distanceTo(this.p1());
      }
    }

    /**
     * Returns the distance of a point from this ray.
     * @param  {vec4} p
     * @return {number}
     */
    _distanceToPoint(p) {
      var u = this.getVector();
      var uHat = vec3.normalize([], u);
      var v = vec3.sub([], p, this._p1);
      var vHat = vec3.normalize([], v);

      var dotUV = vec3.dot(u,v);

      // Is p past p1?
      if(dotUV < 0) {
        return vec3.len(v);
      }

      // We're "above" the ray.
      else {
        var sin = vec3.len(vec3.cross([], uHat, vHat));
        return vec3.len(v)*sin;
      }
    }
  };
});
