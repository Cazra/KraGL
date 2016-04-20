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
      return Math.abs(dot - this._d) <= tolerance;
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
     * Gets the distance from this plane to an abstract line.
     * @param  {KraGL.math.AbstractLine} line
     * @return {number}
     */
    _distanceToAbstractLine(line) {
      var intersection = this._intersectionAbstractLine(line);

      // If we're intersecting, then the distance is 0.
      if(!!intersection) {
        return 0;
      }

      // Otherwise, get the distance to the closest endpoint.
      else if(line instanceof KraGL.math.Segment) {
        let p = line.p1();
        let q = line.p2();

        return Math.min( this._distanceToPoint(p), this._distanceToPoint(q));
      }
      else {
        let p = line.p1();
        return this._distanceToPoint(p);
      }
    }

    /**
     * Gets the distance of a point to this plane.
     * @private
     * @param  {vec4} q
     * @return {number}
     */
    _distanceToPoint(q) {
      var v = vec3.sub([], q, this._p);
      var vHat = vec3.normalize([], v);
      var nHat = vec3.normalize([], this._n);

      return vec3.len(v)*Math.abs(vec3.dot(vHat, nHat));
    }

    /**
     * Alias for distanceTo().
     */
    distTo(shape) {
      return this.distanceTo(shape);
    }

    /**
     * Finds the intersection between this plane and some Shape.
     * @param  {KraGL.math.Shape} shape
     * @return {(vec4|KraGL.math.Shape)}
     */
    intersection(shape) {
      if(shape instanceof KraGL.math.AbstractLine) {
        return this._intersectionAbstractLine(shape);
      }
      else {
        throw new Error('Not implemented yet.');
      }
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

      // If u is orthogonal to the plane's normal, then it is parallel to the
      // plane. This could mean that the intersection IS the segment or
      // the segment doesn't intersect the plane at all.
      if(dotNU === 0) {

        // Segment is on the plane.
        if(dotNV === 0) {
          return line.clone();
        }

        // nope.
        else {
          return undefined;
        }
      }

      // Compute the intersection parametrically.
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

        // Nope.
        else {
          return undefined;
        }
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
     * @private
     */
    _recalcPlaneEquation() {
      this._d = -this._n[0]*this._p[0] -
        this._n[1]*this._p[1] -
        this._n[2]*this._p[2];
    }
  };
});
