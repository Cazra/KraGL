define('KraGL.math.Line', ['KraGL.math.AbstractLine'], function() {
  'use strict';

  /**
   * @class Line
   * @memberof KraGL.math
   * @extends KraGL.math.AbstractLine
   * @classdesc A line in 3D space extending infinitely in both directions.
   * @param  {object} options
   * @param {vec4} p1
   *        A point that the line passes through.
   * @param {vec4} p2
   *        Another point that the line passes through.
   */
  KraGL.math.Line = class extends KraGL.math.AbstractLine {
    constructor(p1, p2) {
      super(p1, p2);
    }

    /**
     * @inheritdoc
     */
    clone() {
      return new KraGL.math.Line(this._p1, this._p2);
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

      // shape is a vec4.
      return this._distanceToPoint(shape);
    }

    /**
     * Gets the distance from this line to some AbstractLine.
     * See http://homepage.univie.ac.at/franz.vesely/notes/hard_sticks/
     * hst/hst.html
     * @private
     * @param  {KraGL.math.AbstractLine} other
     * @return {number}
     */
    _distanceToAbstractLine(other) {
      var coeffs = this._getClosestLineCoeffs(other);
      var s = coeffs[0];
      var t = coeffs[1];

      if( other instanceof KraGL.math.Line ||
          (other instanceof KraGL.math.Ray && t >= 0) ||
          (other instanceof KraGL.math.Segment && t >= 0 && t <= 1)) {
        var a = vec3.add([], this._p1, vec3.scale([], s, u));
        var b = vec3.add([], other._p1, vec3.scale([], t, v));

        return vec3.len(vec3.sub([], b, a));
      }
      else if(other instanceof KraGL.math.Segment) {
        var dist1 = this._distanceToPoint(other._p1);
        var dist2 = this._distanceToPoint(other._p2);
        return Math.min(dist1, dist2);
      }
      else {
        return this._distanceToPoint(other._p1);
      }
    }

    /**
     * Returns the distance from this line to some point.
     * @param  {vec4} p
     * @return {number}
     */
    _distanceToPoint(p) {
      p = KraGL.Math.toVec4(p);

      var u = this.getVector();
      var uHat = vec3.normalize([], u);

      var v = vec3.sub([], p, this._p1);
      var r = vec3.length(v);
      var vHat = vec3.normalize([], v);

      var cross = vec3.cross([], uHat, vHat);
      var sin = vec3.length(cross);

      return r*sin;
    }

    /**
     * @inheritdoc
     */
    intersection(shape, tolerance) {
      if(shape instanceof KraGL.math.AbstractLine) {
        return this._intersectionAbstractLine(shape, tolerance);
      }

      throw new Error('Not implemented yet.');
    }

    /**
     * Gets the intersection between this line and some AbstractLine.
     * @param  {KraGL.math.AbstractLine} other
     * @param  {number} [tolerance]
     * @return {(vec4|KraGL.math.AbstractLine)}
     */
    _intersectionAbstractLine(other, tolerance) {
      if(this.isParallel(other) && this.containsPoint(other.p1())) {
        return other.clone();
      }

      var coeffs = this._getClosestLineCoeffs(other);
      var s = coeffs[0];
      var t = coeffs[1];

      var a = vec3.add([], this._p1, vec3.scale([], s, u));
      var b = vec3.add([], other._p1, vec3.scale([], t, v));

      var dist = vec3.len(vec3.sub([], b, a));

      if((other instanceof KraGL.math.Line ||
          (other instanceof KraGL.math.Ray && t >= 0) ||
          (other instanceof KraGL.math.Segment && t >= 0 && t <= 1)) &&
          dist <= tolerance) {
        return a;
      }
    }

  };
});
