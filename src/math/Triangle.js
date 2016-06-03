define('KraGL.math.Triangle', ['KraGL.math.PlanarShape'], function() {
  'use strict';

  /**
   * @class Triangle
   * @memberof KraGL.math
   * @extends KraGL.math.PlanarShape
   * @classdesc A triangle in 3D space defined by either 3 points or 1 point and 2 vectors.
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
  KraGL.math.Triangle = class Triangle extends KraGL.math.PlanarShape {
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
     * @inheritdoc
     */
    approx(other, tolerance) {
      // Two triangles are considered approximately equal if they have
      // approximately the same set of points.
      if(other instanceof KraGL.math.Triangle) {
        var thisPts = this.points;
        var otherPts = other.points;

        _.each(thisPts, function(p) {
          var q = _.find(otherPts, function(q) {
            return KraGL.math.Vectors.approx(p, q, tolerance);
          });
          otherPts = _.without(otherPts, q);
        });
        return otherPts.length === 0;
      }
      return false;
    }

    /**
     * @inheritdoc
     */
    clone() {
      return new KraGL.math.Triangle({
        p1: this.p1,
        p2: this.p2,
        p3: this.p3
      });
    }

    /**
     * @inheritdoc
     */
    distanceTo(shape) {
      if(shape instanceof KraGL.math.Shape) {
        if(shape instanceof KraGL.math.AbstractLine)
          return this._distanceToAbstractLine(shape);
        if(shape instanceof KraGL.math.Triangle)
          return this._distToTriangle(shape);
        else
          throw new Error('Shape not supported: ' + shape);
      }
      else
        return this._distToPoint(shape);
    }

    /**
     * @private
     * @param {KraGL.math.AbstractLine}
     * @return {number}
     */
    _distanceToAbstractLine(line) {
      var me = this;

      if(this.intersects(line))
        return 0;
      else {
        var ptsMin = _.chain([line.p1, line.p2])
          .map(function(pt) {
            return me.dist(pt);
          })
          .min().value();
        var segsMin = _.chain(this.toSegments())
          .map(function(seg) {
            return seg.dist(line);
          })
          .min().value();
        return _.min([ptsMin, segsMin]);
      }
    }

    /**
     * Gets the distance of a point to this Triangle.
     * @private
     * @param  {vec4} p
     * @return {number}
     */
    _distToPoint(p) {
      // If the point is directly above the Triangle, then get the distance to
      // its plane.
      if(this.isPointAbove(p)) {
        var wHat = vec3.normalize([], vec3.sub([], p, this.p1));
        var cosNW = vec3.dot(wHat, this.nHat);
        return cosNW*vec3.dist(p, this.p1);
      }

      // Otherwise, get the nearest distance to one of its sides.
      else {
        var segs = this.toSegments();
        _.chain(segs)
          .map(function(seg) {
            return seg.dist(p);
          })
          .min().value();
      }
    }

    /**
     * @private
     * @param  {KraGL.math.Triangle} other
     * @return {number}
     */
    _distToTriangle(other) {
      var tests = [
        [this, other.toSegments()],
        [other, this.toSegments()]
      ];

      // Get the minimal distance from one triangle's segments to the other triangle.
      return _.chain(tests)
        .map(function(test) {
          var tri = test[0];
          var segments = test[1];

          return _.chain(segments)
            .map(function(seg) {
              return tri.dist(seg);
            })
            .min().value();
        })
        .min().value();
    }

    /**
     * @inheritdoc
     */
    getPlane() {
      return new KraGL.math.Plane({
        p: this.p1,
        n: this.nHat
      });
    }

    /**
     * @inheritdoc
     */
    intersection(shape, tolerance) {
      if(shape instanceof KraGL.math.AbstractLine) {
        return this._intersectionAbstractLine(shape, tolerance);
      }
      throw new Error('Shape not supported: ' + shape);
    }

    /**
     * @private
     * @param {KraGL.math.AbstractLine} line
     * @param {number} tolerance
     * @return {(vec4|KraGL.math.AbstractLine)}
     */
    _intersectionAbstractLine(line, tolerance) {
      // Parallel case.
      if(vec3.dot(line.vec, this.nHat) === 0) {
        var segments = this.toSegments();
        var intersections = _.chain(segments)
          .map(function(seg) {
            return line.intersection(seg, tolerance);
          })
          .compact().value();

        // If the line overlaps a side, return the overlapped area.
        var sideOverlap = _.find(intersections, function(intr) {
          return (intr instanceof KraGL.math.AbstractLine);
        });
        if(sideOverlap)
          return sideOverlap;

        // Filter out any identical points.
        intersections = _.reject(intersections, function(p, i) {
          return _.find(intersections, function(q, j) {
            if(i === j)
              return false;
            else
              return KraGL.math.Vectors.approx(p, q, tolerance);
          });
        });

        // The line passes all the way through.
        if(intersections.length === 2)
          return new KraGL.math.Segment({
            p1: intersections[0],
            p2: intersections[1]
          });

        // An endpoint is inside.
        else if(intersections.length === 1) {
          if(this.isPointAbove(line.p1))
            return new KraGL.math.Segment({
              p1: line.p1,
              p2: intersections[0]
            });
          else
            return new KraGL.math.Segment({
              p1: intersections[0],
              p2: line.p2
            });
        }

        // No intersection.
        else
          return undefined;
      }

      // Skew case
      else {
        var plane = this.toPlane();
        var planeIntr = plane.intersection(line);

        if(this.isPointAbove(planeIntr))
          return planeIntr;
        else
          return undefined;
      }
    }

    /**
     * Checks if this Triangle's plane is parallel with some other planar shape.
     * @param  {KraGL.math.Shape}  shape
     * @return {Boolean}
     */
    isParallel(shape) {
      var plane = this.toPlane();
      return plane.isParallel(shape);
    }

    /**
     * Checks if a point is directly above/below the triangle.
     * @param  {vec4}  p
     * @return {Boolean}
     */
    isPointAbove(p) {
      var a = this.u;
      var b = vec3.sub([], this.p3, this.p2);
      var c = vec3.sub([], this.p1, this.p3);

      var x = vec3.sub([], p, this.p1);
      var y = vec3.sub([], p, this.p2);
      var z = vec3.sub([], p, this.p3);

      var n = this.nHat;

      var crossAX = vec3.cross([], a, x);
      var crossBY = vec3.cross([], b, y);
      var crossCZ = vec3.cross([], c, z);
      return  vec3.dot(n, crossAX) >= 0 &&
              vec3.dot(n, crossBY) >= 0 &&
              vec3.dot(n, crossCZ) >= 0;
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
     * A list of the 3 points.
     * @type {vec4[]}
     */
     get points() {
       return [this._p1, this._p2, this._p3];
     }
     set points(pts) {
       this.p1 = pts[0];
       this.p2 = pts[1];
       this.p3 = pts[2];
     }

    /**
     * Produces the Segments forming the Triangle's sides.
     * @return {KraGL.math.Segment[]}
     */
    toSegments() {
      return [
        KraGL.math.Segment({ p1: this.p1, p2: this.p2 }),
        KraGL.math.Segment({ p1: this.p2, p2: this.p3 }),
        KraGL.math.Segment({ p1: this.p3, p2: this.p1 })
      ];
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

  KraGL.math.PlanarShape.checkImpl(KraGL.math.Triangle);

  _.aliasProperties(KraGL.math.Triangle, {
    nHat: 'normal',
    p1: 'point1',
    p2: 'point2',
    p3: 'point3',
    u: 'vectorU',
    v: 'vectorV'
  });
});
