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
      this._p1 = KraGL.Math.toVec4(options.p1);
      this._p2 = KraGL.Math.toVec4(options.p2);
    }

    /**
     * Checks if a projected point p = p1 + alpha*u is within the bounds of
     * this type of line.
     * @param  {number} alpha
     * @return {[type]}       [description]
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
      else if(other.containsProject(beta)) {
        let dist1 = vec4.dist(this._p1, q);
        let dist2 = vec4.dist(this._p2, q);

        return Math.min(dist1, dist2);
      }
      else {
        let dist1 = vec4.dist(this._p1, other._p1);
        let dist2 = vec4.dist(this._p1, other._p2);
        let dist3 = vec4.dist(this._p2, other._p1);
        let dist4 = vec4.dist(this._p2, other._p2);

        return Math.min(dist1, dist2, dist3, dist4);
      }
    }

    /**
     * Gets the distance between this and some point.
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
        var crossUV = vec3.cross([], uHat, vHat);
        return vec3.length(v)*Math.abs(crossUV);
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
     * Gets/sets the first point.
     * @param {vec4} [p]
     * @return {vec4}
     */
    point1(p) {
      if(p) {
        this._p1 = KraGL.Math.toVec4(p);
      }
      return _.clone(this._p1);
    }

    /**
     * Gets/sets the second point.
     * @param {vec4} [p]
     * @return {vec4}
     */
    point2(p) {
      if(p) {
        this._p2 = KraGL.Math.toVec4(p);
      }
      return _.clone(this._p2);
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
  };

  // Define method aliases.
  var proto = KraGL.math.AbstractLine.prototype;
  _.extend(proto, {
    p1: proto.point1,
    p2: proto.point2,
    quat: proto.getQuaternion,
    u: proto.getVector,
    vec: proto.getVector
  });
});
