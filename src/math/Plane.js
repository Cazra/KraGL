define('KraGL.math.Plane', ['KraGL.math.PlanarShape'], function() {
  'use strict';

  /**
   * @class Plane
   * @memberof KraGL.math
   * @extends KraGL.math.PlanarShape
   * @classdesc An infinitely spanning plane.
   * @param {object} options
   * @param {vec4} [options.p=[0,0,0,1]]
   *        A point lying on the plane.
   * @param {vec3} [options.n=[0,0,1]]
   *        The normal vector for the plane.
   * @throws Error if normal vector is [0,0,0].
   */
  KraGL.math.Plane = class Plane extends KraGL.math.PlanarShape {
    constructor(options) {
      super();
      options = options || {};
      this.p = options.p || [0,0,0,1];
      this.n = options.n || [0,0,1];
    }

    /**
     * @inheritdoc
     */
    approx(other, tolerance) {
      if(other instanceof KraGL.math.Plane) {
        return this.isParallel(other) &&
          this.contains(other.p, tolerance);
      }
      return false;
    }

    /**
     * @inheritdoc
     */
    clone() {
      return new KraGL.math.Plane({
        n: this.n,
        p: this.p
      });
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
        throw new Error('Shape not supported: ' + shape);
      }

      // Assume that the argument is a point (A vec4).
      return this._distanceToPoint(shape);
    }

    /**
     * Gets the distance between this Plane and an AbstractLine.
     * @private
     * @param  {KraGL.math.AbstractLine} line
     * @return {number}
     */
    _distanceToAbstractLine(line) {
      var p = this._p;
      var q = line.p1;

      var n = this._n;
      var u = line.vec;
      var v = vec3.sub([], p, q);

      var dotNV = vec3.dot(n, v);
      var dotNU = vec3.dot(n, u);

      // Is the line parallel to the plane?
      if(dotNU === 0)
        // Just get the distance to one of the line's points.
        return this.distanceTo(line.p1);
      else {
        var alpha = dotNV/dotNU;

        // If the parametric value lies in the appropriate range for the type
        // of AbstractLine, then it intersects and the distance is 0.
        if( line.containsProjection(alpha))
          return 0;

        // Otherwise, get the distance to the closest point.
        else
          return Math.min(this.distanceTo(line.p1), this.distanceTo(line.p2));
      }
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
      var lenV = vec3.len(v);
      if(lenV === 0)
        return 0;

      var vHat = vec3.normalize([], v);
      var nHat = vec3.normalize([], this._n);
      var dotNV = vec3.dot(vHat, nHat);

      return lenV*Math.abs(dotNV);
    }

    /**
     * @inheritdoc
     */
    getPlane() {
      return this.clone();
    }


    /**
     * Finds the intersection between this plane and some Shape.
     * @param  {KraGL.math.Shape} shape
     * @return {(vec4|KraGL.math.Shape)}
     */
    intersection(shape) {
      if(shape instanceof KraGL.math.AbstractLine)
        return this._intersectionAbstractLine(shape);
      else if(shape instanceof KraGL.math.Plane)
        return this._intersectionPlane(shape);
      else
        throw new Error('Shape not supported: ' + shape);
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
      var q = line.p1;

      var n = this._n;
      var u = line.vec;
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
        if( line.containsProjection(alpha)) {
          var result = vec3.add([], q, vec3.scale([], u, alpha));
          result[3] = 1;
          return result;
        }
        else
          return undefined;
      }
    }

    /**
     * Gets the intersection between this and another Plane. The result
     * could be a line, an identical plane, or no intersection.
     * @private
     * @param  {KraGL.math.Plane} other
     * @return {(KraGL.math.Line|KraGL.math.Plane)}
     */
    _intersectionPlane(other) {

      // If the planes are parallel, they are either the same plane, or they
      // never intersect.
      if(this.isParallel(other)) {
        if(other.contains(this.p))
          return this.clone();
        else
          return undefined;
      }

      // Non-parallel planes will always intersect on a line.
      else {
        var p = this.p;
        var m = this.n;

        var q = other.p;
        var n = other.n;

        // The vector for the line.
        var u = vec3.cross([], m, n);

        // Get the normal for the plane through the origin that the line can
        // intersect with.
        var w;
        if(u[3] === 0)
          w = [1,0,0];
        else
          w = [0,0,1];

        var mat = [
          m[0], n[0], w[0],
          m[1], n[1], w[1],
          m[2], n[2], w[2]
        ];
        var matInv = mat3.invert([], mat);
        var p1 = mat3.mul([], matInv, [vec3.dot(p,m), vec3.dot(q,n), 0]);
        var p2 = vec3.add([], p1, u);

        return new KraGL.math.Line({
          p1: p1,
          p2: p2
        });
      }
    }

    /**
     * The plane's normal vector.
     * @type {vec3}
     */
    get normal() {
      return _.clone(this._n);
    }
    set normal(n) {
      if(_.isEqual(n, [0,0,0]))
        throw new Error('Normal cannot be [0,0,0].');

      this._n = vec3.copy([], n);
      this._recalcPlaneEquation();
    }

    /**
     * A point lying on the plane.
     * @type {vec4}
     */
    get point() {
      return _.clone(this._p);
    }
    set point(p) {
      this._p = vec4.copy([], p);
      this._p[3] = 1;
      this._recalcPlaneEquation();
    }

    /**
     * Recalculates the internal vector equation for this plane.
     * nx*x + ny*y + nz*z + d = 0
     * or
     * dot(n, p) + d = 0
     * @private
     */
    _recalcPlaneEquation() {
      if(this._n && this._p)
        this._d = -vec3.dot(this._n, this._p);
    }
  };

  KraGL.math.PlanarShape.checkImpl(KraGL.math.Plane);

  _.aliasProperties(KraGL.math.Plane, {
    n: 'normal',
    p: 'point'
  });
});
