define('KraGL.math.AbstractLine', ['KraGL.math.Shape'], function() {
  'use strict';

  /**
   * @class AbstractLine
   * @memberof KraGL.math
   * @extends KraGL.math.Shape
   * @classdesc Abstract base class for line-like shapes, such as Lines,
   * Rays, and Segments.
   * @param  {object} options
   * @param {vec4} options.p1
   *        A point that the line passes through.
   * @param {vec4} options.p2
   *        Another point that the line passes through.
   */
  KraGL.math.AbstractLine = class extends KraGL.math.Shape {
    constructor(options) {
      super();
      this._p1 = KraGL.Math.point(options.p1);
      this._p2 = KraGL.Math.point(options.p2);

      if(_.isEqual(this._p1, this._p2))
        throw new Error('Line endpoints cannot be the same.');
    }

    /**
     * Checks if a projected point p = p1 + alpha*u is within the bounds of
     * this type of line.
     * @param  {number} alpha
     * @return {boolean}
     */
    containsProjection(alpha) {
      _.noop(alpha);
      throw new Error('Must be implemented by subclass.');
    }

    /**
     * @inheritdoc
     */
    distanceTo(shape) {
      if(shape instanceof KraGL.math.Shape) {
        if(shape instanceof KraGL.math.AbstractLine)
          return this._distanceToAbstractLine(shape);
        else
          throw new Error('Shape not supported: ' + shape);
      }

      // Assume shape is a point.
      return this._distanceToPoint(shape);
    }

    /**
     * Gets the distance between this and another AbstractLine.
     * @private
     * @param  {KraGL.math.AbstractLine} other
     * @return {number}
     */
    _distanceToAbstractLine(other) {
      var coeffs = this._getClosestLineCoeffs(other);
      var alpha = this.projection(coeffs[0]);
      var beta = other.projection(coeffs[1]);
      var p = this.projection(alpha);
      var q = this.projection(beta);

      if(this.containsProjection(alpha) && other.containsProjection(beta)) {
        return vec4.dist(p, q);
      }
      else if(this.containsProjection(alpha)) {
        let dist1 = vec4.dist(p, other._p1);
        let dist2 = vec4.dist(p, other._p2);

        return Math.min(dist1, dist2);
      }
      else if(other.containsProjection(beta)) {
        let dist1 = vec4.dist(this._p1, q);
        let dist2 = vec4.dist(this._p2, q);

        return Math.min(dist1, dist2);
      }
      else {
        let dist1 = this._distanceToPoint(other._p1);
        let dist2 = this._distanceToPoint(other._p2);
        let dist3 = other._distanceToPoint(this._p1);
        let dist4 = other._distanceToPoint(this._p2);

        return Math.min(dist1, dist2, dist3, dist4);
      }
    }

    /**
     * Gets the distance between this and some point.
     * @private
     * @param  {vec4} p
     * @return {number}
     */
    _distanceToPoint(p) {
      var u = this.vec();
      var v = vec3.sub([], p, this._p1);
      var uHat = vec3.normalize([], u);
      var vHat = vec3.normalize([], v);

      // The scalar projection of v onto u.
      var scaleProjUV = vec3.dot(uHat, v);

      // Is the point's projection on our line?
      var alpha = scaleProjUV/vec3.length(u);
      if(this.containsProjection(alpha)) {
        var sinUV = vec3.len(vec3.cross([], uHat, vHat));
        return vec3.length(v)*Math.abs(sinUV);
      }
      else {
        var distP1 = vec4.dist(p, this._p1);
        var distP2 = vec4.dist(p, this._p2);
        return Math.min(distP1, distP2);
      }

    }

    /**
     * Finds the parametric coefficients for the closest projected points on this and
     * line. This is meant as a helper method for the AbstractLine distanceTo and
     * intersection implementations.
     *
     * See
     * http://homepage.univie.ac.at/franz.vesely/notes/hard_sticks/hst/hst.html
     *
     * If the lines are parallel, then the coefficients are undefined.
     *
     * @private
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
     * @inheritdoc
     */
    intersection(other, tolerance) {
      if(other instanceof KraGL.math.AbstractLine) {
        return this._intersectionAbstractLine(other, tolerance);
      }

      throw new Error('Shape not supported: ' + other);
    }

    /**
     * Gets the intersection between this and another AbstractLine. This could
     * produce one of 3 results:
     * If the lines never intersect, the result is undefined.
     * If the lines intersect at a single point, that point is returned.
     * If the lines overlap, then a new AbstractLine defining where they
     * overlap is returned.
     * @private
     * @param  {KraGL.math.AbstractLine} other
     * @param {number} [tolerance]
     * @return {(vec4|KraGL.math.AbstractLine)}
     */
    _intersectionAbstractLine(other, tolerance) {
      if(this.isCollinear(other)) {

        // Is either line a Line?
        if(this instanceof KraGL.math.Line)
          return other.clone();
        else if(other instanceof KraGL.math.Line)
          return this.clone();

        // Is either line a Ray?
        else if(this instanceof KraGL.math.Ray)
          return other._intersectionCollinearRay(this);
        else if(other instanceof KraGL.math.Ray)
          return this._intersectionCollinearRay(other);

        // Both lines are Segments.
        else
          return this._intersectionCollinearSegment(other);
      }
      else {
        return this._intersectionSkew(other, tolerance);
      }
    }

    /**
     * Gets the intersection of this with a collinear Ray.
     * @private
     * @param  {KraGL.math.Ray} other
     * @param  {number} [tolerance]
     * @return {(KraGL.math.Ray|KraGL.math.Segment)}
     */
    _intersectionCollinearRay(other, tolerance) {
      var u = this.vec();
      var v = other.vec();
      var sameDir = (vec3.dot(u,v) > 0);

      var containsP1 = other.contains(this._p1, tolerance);
      var containsP3 = this.contains(other._p1, tolerance);
      var containsP4 = this.contains(other._p2, tolerance);

      // Overlap of two Rays?
      if(this instanceof KraGL.math.Ray) {
        if(sameDir) {
          if(containsP1)
            return other.clone();
          else if(containsP3)
            return this.clone();
        }
        else if(containsP1)
          return new KraGL.math.Segment({
            p1: this._p1,
            p2: other._p1
          });
      }

      // Overlap with ta Segment?
      else if(containsP3 && containsP4)
        return new KraGL.math.Segment({
          p1: other._p1,
          p2: other._p2
        });
      else if(containsP3)
        return new KraGL.math.Segment({
          p1: this._p1,
          p2: other._p1
        });
      else if(containsP4)
        return new KraGL.math.Segment({
          p1: this._p1,
          p2: other._p2
        });

      // No overlap.
      else
        return undefined;
    }

    /**
     * Gets the intersection of this with a collinear segment.
     * @private
     * @param  {KraGL.math.Segment} other
     * @param {number} [tolerance]
     * @return {KraGL.math.Segment}
     */
    _intersectionCollinearSegment(other, tolerance) {
      var p1 = this._p1;
      var p2 = this._p2;
      var p3 = other._p1;
      var p4 = other._p2;

      var containsP1 = other.contains(p1, tolerance);
      var containsP2 = other.contains(p2, tolerance);
      var containsP3 = this.contains(p3, tolerance);
      var containsP4 = this.contains(p4, tolerance);

      if(containsP1 && containsP2)
        return this.clone();
      else if(containsP1 && containsP3)
        return new KraGL.math.Segment({
          p1: p1,
          p2: p3
        });
      else if(containsP1 && containsP4)
        return new KraGL.math.Segment({
          p1: p1,
          p2: p4
        });
      else if(containsP2 && containsP3)
        return new KraGL.math.Segment({
          p1: p2,
          p2: p3
        });
      else if(containsP2 && containsP4)
        return new KraGL.math.Segment({
          p1: p2,
          p2: p4
        });
      else if(containsP3 && containsP4)
        return other.clone();
      else
        return undefined;
    }

    /**
     * Gets the intersection of two skew lines, or undefined if they don't
     * intersect.
     * @param  {KraGL.math.AbstractLine} other
     * @param  {number} [tolerance]
     * @return {vec4}
     */
    _intersectionSkew(other, tolerance) {
      var coeffs = this._getClosestLineCoeffs(other);
      var alpha = coeffs[0];
      var beta = coeffs[1];

      if(this.containsProjection(alpha) && other.containsProjection(beta)) {
        var p = this.projection(alpha);
        var q = this.projection(beta);

        var dist = vec4.dist(p, q);
        if(KraGL.Math.approx(dist, 0, tolerance))
          return p;
        else
          return undefined;
      }
      else
        return undefined;
    }

    /**
     * Checks if this AbstractLine is collinear with another AbstractLine.
     * @param  {KraGL.math.AbstractLine}  other
     * @param {number} tolerance
     * @return {Boolean}
     */
    isCollinear(other, tolerance) {
      var u = this.getVector();
      var v = other.getVector();
      var w = vec3.sub([], this._p1, other._p1);

      var sinUV = vec3.length(vec3.cross([], u, v));
      var sinUW = vec3.length(vec3.cross([], u, w));

      return KraGL.Math.approx(sinUV, 0, tolerance) &&
              KraGL.Math.approx(sinUW, 0, tolerance);
    }

    /**
     * Checks whether this AbstractLine is paralell to another AbstractLine.
     * @param  {KraGL.math.AbstractLine}  other
     * @param {number} tolerance
     * @return {boolean}
     */
    isParallel(other, tolerance) {
      var u = this.getVector();
      var v = other.getVector();

      var sinUV = vec3.length(vec3.cross([], u, v));

      return KraGL.Math.approx(sinUV, 0, tolerance);
    }

    /**
     * The start point.
     * @type {vec4}
     */
    get point1() {
      return _.clone(this._p1);
    }
    set point1(p) {
      this._p1 = vec4.copy([], p);
    }

    /**
     * The end point.
     * @type {vec4}
     */
    get point2() {
      return _.clone(this._p2);
    }
    set point2(p) {
      this._p2 = vec4.copy([], p);
    }

    /**
     * Gets a point projected from p1 along the line's vector.
     * @param  {number} alpha
     *         The vector scalar for the projected point.
     * @return {vec4}
     *         The projected point.
     */
    projection(alpha) {
      var u = this.getVector();
      var scaledU = vec3.scale([], u, alpha);
      scaledU[3] = 0;
      return vec4.add([], this._p1, scaledU);
    }

    /**
     * The quaternion defining the line's orientation.
     * @type {quat}
     */
    get quaternion() {
      var u = [1,0,0];
      var v = this.vector;
      return KraGL.math.Quaternions.rotate(u, v);
    }
    set quaternion(q) {
      var length = vec4.length(this._p1, this._p2);
      var v = vec3.scale([], [1,0,0], length);
      this.vector = vec3.transformQuat([], v, q);
    }

    /**
     * Produces a new Line from this shape.
     * @return {KraGL.math.Line}
     */
    toLine() {
      return new KraGL.math.Line({
        p1: this._p1,
        p2: this._p2
      });
    }

    /**
     * Produces a new Ray from this shape.
     * @return {KraGL.math.Ray}
     */
    toRay() {
      return new KraGL.math.Ray({
        p1: this._p1,
        p2: this._p2
      });
    }

    /**
     * Produces a new Segment from this shape.
     * @return {KraGL.math.Segment}
     */
    toSegment() {
      return new KraGL.math.Segment({
        p1: this._p1,
        p2: this._p2
      });
    }

    /**
     * The vector from point1 to point2.
     * @type {vec3}
     */
    get vector() {
      return vec3.sub([], this._p2, this._p1);
    }
    set vector(v) {
      this._p2 = vec3.add(this._p1, v);
      this._p2[3] = 1;
    }
  };

  _.aliasProperties(KraGL.math.AbstractLine, {
    p1: 'point1',
    p2: 'point2',
    quat: 'quaternion',
    vec: 'vector'
  });
});
