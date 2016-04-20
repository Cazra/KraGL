define('KraGL.math.Plane', ['KraGL.math.Shape'], function() {
  'use strict';

  /**
   * @class Plane
   * @memberof KraGL.math
   * @extends KraGL.math.Shape
   * @classdesc An infinitely spanning plane.
   * @param {vec4} p
   *        A point lying on the plane.
   * @param {vec3} n
   *        The normal vector for the plane.
   */
  KraGL.math.Plane = class extends KraGL.math.Shape {
    constructor(p, n) {
      super();
      this._p = KraGL.Math.toVec4(p);
      this._n = KraGL.Math.toVec3(n);
      this._recalcPlaneEquation();
    }

    /**
     * @inheritdoc
     */
    clone() {
      return new KraGL.math.Plane(this._p, this._n);
    }

    /**
     * Checks if a point lies on this plane.
     * @param  {vec4} p
     * @return {boolean}
     */
    containsPoint(p, tolerance) {
      tolerance = tolerance || 0;

      var dot = vec3.dot(this._n, p);
      return KraGL.Math.fuzzyEqual(dot, this._d, tolerance);
    }

    /**
     * Gets the distance from this plane to some Shape or a point.
     * @param  {(vec4|KraGL.math.Shape)} shape
     * @return {number}
     */
    distanceTo(shape) {
      if(shape instanceof KraGL.math.Shape) {
        if(shape instanceof KraGL.math.AbstractLine) {
          return this._distanceToAbstractLine(shape);
        }
        throw new Error('Not implemented yet.');
      }

      // Assume that the argument is a point (A vec4).
      return this._distanceToPoint(shape);
    }

    /**
     * Gets the distance of a point to this plane.
     * This is the length of the projection of the point onto the normal.
     * @private
     * @param  {vec4} q
     * @return {number}
     */
    _distanceToPoint(q) {
      var v = vec3.sub([], q, this._p);
      var vHat = vec3.normalize([], v);
      var nHat = vec3.normalize([], this._n);
      var dotNV = vec3.dot(vHat, nHat);

      return vec3.len(v)*Math.abs(dotNV);
    }

    /**
     * Finds the intersection between this plane and some Shape.
     * @param  {KraGL.math.Shape} shape
     * @return {(vec4|KraGL.math.Shape)}
     */
    intersection(shape) {
      if(shape instanceof KraGL.math.AbstractLine)
        return this._intersectionAbstractLine(shape);
      else
        throw new Error('Not implemented yet.');
    }

    /**
     * Finds the intersection between this plane and some AbstractLine.
     * If the line intersects the plane at a single point, then that point is
     * returned.
     * If the line lies on the plane, then a clone of the line is returned.
     * If the line does not intersect the plane, then undefined is returned.
     * @private
     * @param  {KraGL.math.AbstractLine} line
     * @return {(vec4|KraGL.math.AbstractLine)}
     */
    _intersectionAbstractLine(line) {
      var p = this._p;
      var q = line.p1();

      var n = this._n;
      var u = line.getVector();
      var v = vec3.sub([], p, q);

      var dotNV = vec3.dot(n, v);
      var dotNU = vec3.dot(n, u);

      // Is the line parallel to the plane?
      if(dotNU === 0) {

        // If the line is on the plane, then the intersection is the line
        // itself. Otherwise, the line is parallel, but never intersecting.
        if(dotNV === 0)
          return line.clone();
        else
          return undefined;
      }
      else {
        var alpha = dotNV/dotNU;

        // If the parametric value lies in the appropriate range for the type
        // of AbstractLine, then use it to compute the point of intersection.
        if( line instanceof KraGL.math.Line ||
            (line instanceof KraGL.math.Ray && alpha >= 0) ||
            (line instanceof KraGL.math.Segment && alpha >= 0 && alpha <= 1)) {

          var result = vec4.add([], q, vec3.scale([], alpha, u));
          result[3] = 1;
          return result;
        }
        else
          return undefined;
      }
    }


    /**
     * Checks if some AbstractLine is parallel
     * @param  {KraGL.math.AbstractLine}  line
     * @return {Boolean}
     */
    isParallelToLine(line) {
      var v = line.getVector();
      return vec3.dot(this._n, v) === 0;
    }

    /**
     * Alias for normal()
     */
    n(n) {
      return this.normal(n);
    }

    /**
     * Gets/sets the normal vector for the plane.
     * @param  {vec3} n
     * @return {vec3}
     */
    normal(n) {
      if(n) {
        this._n = KraGL.Math.toVec3(n);
        this._recalcPlaneEquation();
      }
      return _.clone(this._n);
    }

    /**
     * Alias for point().
     */
    p(p) {
      return this.point(p);
    }

    /**
     * Gets/sets the point for the plane.
     * @param  {vec4} [p]
     * @return {vec4}
     */
    point(p) {
      if(p) {
        this._p = KraGL.Math.toVec4(p);
        this._recalcPlaneEquation();
      }
      return _.clone(this._p);
    }

    /**
     * Recalculates the internal vector equation for this plane.
     * nx*x + ny*y + nz*z + d = 0
     * or
     * dot(n, p) + d = 0
     * @private
     */
    _recalcPlaneEquation() {
      this._d = -vec3.dot(this._n, this._p);
    }
  };
});
