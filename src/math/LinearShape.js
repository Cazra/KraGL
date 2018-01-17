'use strict';

import { AbstractError } from '../AbstractError';
import { MathError } from './MathError';
import { Shape } from './Shape';
import { Vectors } from './Vectors';

/**
 * Superclass for 3D line-like shapes such as lines, rays, and segments.
 * @abstract
 * @memberof KraGL.math
 * @extends KraGL.math.Shape
 */
class LinearShape extends Shape {

  /**
   * The line's vector start point.
   * @type {vec4}
   */
  get p1() {
    return this._p1;
  }
  set p1(p) {
    p[3] = 1;
    if(this._p2 && KraGL.math.Vectors.equal(p, this._p2))
      throw new MathError('Line endpoints cannot be the same.');
    this._p1 = p;
  }

  /**
   * The line's vector end point.
   * @type {vec4}
   */
  get p2() {
    return this._p2;
  }
  set p2(p) {
    p[3] = 1;
    if(this._p1 && KraGL.math.Vectors.equal(p, this._p1))
      throw new MathError('Line endpoints cannot be the same.');
    this._p2 = p;
  }

  /**
   * The quaternion defining the line's orientation.
   * @type {quat}
   */
  get quat() {
    let u = [1,0,0];
    let v = this.vec;
    return KraGL.math.Quaternions.rotate(u, v);
  }
  set quat(q) {
    let length = vec4.length(this.vec);
    let v = vec3.scale([], [1, 0, 0], length);
    this.vec = vec3.transformQuat([], v, q);
  }

  /**
   * The vector from p1 to p2.
   * @type {vec3}
   */
  get vec() {
    return vec3.sub([], this._p2, this._p1);
  }
  set vec(v) {
    this.p2 = vec3.add([], this._p1, v);
  }

  /**
   * @param {object} options
   * @param {vec4} options.p1
   *        The first endpoint.
   * @param {vec4} options.p2
   *        The second endpoint.
   */
  constructor(options) {
    super();
    this.p1 = options.p1;
    this.p2 = options.p2;
  }

  /**
   * Checks if the projected point q = p + alpha*u is contained in this shape.
   * @abstract
   * @param {number} alpha
   * @return {boolean}
   */
  containsProjection(alpha) {
    _.noop(alpha);
    throw new AbstractError('Must be implemented by subclass.');
  }

  /**
   * @inheritdoc
   */
  dist(other) {
    // Dist to other LinearShapes.
    if(other instanceof LinearShape)
      return this._distLine(other);

    // For other shapes, delegate to the higher-level shape.
    else if(other instanceof Shape)
      return other.dist(this);

    // Dist to point.
    else
      return this._distPt(other);
  }

  /**
   * Gets the distance from this to another LinearShape.
   * @private
   * @param {KraGL.math.LinearShape} other
   * @return {number}
   */
  _distLine(other) {
    let [alpha, beta] = this._getClosestLineCoeffs(other);
    let p = this.projection(alpha);
    let q = other.projection(beta);

    let validAlpha = this.containsProjection(alpha);
    let validBeta = this.containsProjection(beta);

    if(validAlpha && validBeta)
      return vec4.dist(p, q);
    else if(validAlpha) {
      let dist1 = vec4.dist(p, other._p1);
      let dist2 = vec4.dist(p, other._p2);
      return Math.min(dist1, dist2);
    }
    else if(validBeta) {
      let dist1 = vec4.dist(q, this._p1);
      let dist2 = vec4.dist(q, this._p2);
      return Math.min(dist1, dist2);
    }
    else {
      p = this._p2;
      if(alpha < 0)
        p = this._p1;

      q = other._p2;
      if(beta < 0)
        q = other._p1;

      return vec4.dist(p, q);
    }
  }

  /**
   * Gets the distance from this to a point.
   * @private
   * @param {vec4} p
   * @return {number}
   */
  _distPt(p) {
    let u = this.vec;
    let v = vec3.sub([], p, this._p1);
    let lenV = vec3.length(v);

    // 0 if the point is our first endpoint.
    if(lenV === 0)
      return 0;

    let uHat = vec3.normalize([], u);
    let vHat = vec3.normalize([], v);

    let sprojUV = Vectors.scalarProjection(u, v);
    let alpha = sprojUV/vec3.length(u);
    if(this.containsProjection(alpha)) {
      let sinUV = vec3.len(vec3.cross([], uHat, vHat));
      return lenV*Math.abs(sinUV);
    }
    else {
      let q = this._p2;
      if(alpha < 0)
        q = this._p1;
      return vec4.dist(p, q);
    }
  }

  /**
   * Finds the parametric coefficients for the closest projected points on this
   * and line. This is meant as a helper method for the LinearShape distanceTo
   * and intersection implementations.
   *
   * See
   * http://homepage.univie.ac.at/franz.vesely/notes/hard_sticks/hst/hst.html
   *
   * If the lines are parallel, then the coefficients are undefined.
   * @private
   * @param {KraGL.math.LinearShape} other
   * @return {vec2}
   *         The first value is this line's coefficient.
   *         The second value is the other line's coefficient.
   */
  _getClosestLineCoeffs(other) {
    let u = this.vec;
    let uHat = vec3.normalize([], u);
    let v = other.vec;
    let vHat = vec3.normalize([], v);
    let z = vec3.sub([], other._p1, this._p1);

    let dotUV = vec3.dot(uHat, vHat);
    let dotUZ = vec3.dot(uHat, z);
    let dotVZ = vec3.dot(vHat, z);

    let alpha = (dotUZ-dotUV*dotVZ) / (1-dotUV*dotUV) / vec3.len(u);
    let beta = (dotUV*dotUZ-dotVZ) / (1-dotUV*dotUV) / vec3.len(v);
    return [alpha, beta];
  }

  /**
   * @inheritdoc
   */
  intersection(other, tolerance=KraGL.EPSILON) {
    if(other instanceof LinearShape)
      return this._intersectionLinearShape(other, tolerance);
    else
      return other.intersection(this, tolerance);
  }

  /**
   * Gets the intersection between this and another LinearShape. This could
   * produce one of 3 results:
   * If the lines never intersect, the result is undefined.
   * If the lines intersect at a single point, that point is returned.
   * If the lines overlap, then a new LinearShape defining where they
   * overlap is returned.
   * @private
   * @param  {KraGL.math.LinearShape} other
   * @param {number} [tolerance]
   * @return {(vec4|KraGL.math.LinearShape)}
   */
  _intersectionLinearShape(other, tolerance) {
    const Line = KraGL.math.Line;
    const Ray = KraGL.math.Ray;

    if(this.isCollinear(other)) {

      // Is either a Line?
      if(this instanceof Line)
        return other.clone();
      else if(other instanceof Line)
        return this.clone();

      // Is either a Ray?
      else if(this instanceof Ray)
        return other._intersectionCollinearRay(this, tolerance);
      else if(other instanceof Ray)
        return this._intersectionCollinearRay(other, tolerance);

      // Both must be Segments.
      else
        return this._intersectionCollinearSegment(other, tolerance);
    }
    else
      return this._intersectionSkew(other, tolerance);
  }

  /**
   * Gets the intersection of this with a collinear Ray.
   * @private
   * @param  {KraGL.math.Ray} other
   * @param  {number} [tolerance]
   * @return {(KraGL.math.Ray|KraGL.math.Segment)}
   */
  _intersectionCollinearRay(other, tolerance) {
    let u = this.vec();
    let v = other.vec();
    let sameDir = (vec3.dot(u,v) > 0);

    let containsP1 = other.contains(this._p1, tolerance);
    let containsP3 = this.contains(other._p1, tolerance);
    let containsP4 = this.contains(other._p2, tolerance);

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
    let p1 = this._p1;
    let p2 = this._p2;
    let p3 = other._p1;
    let p4 = other._p2;

    let containsP1 = other.contains(p1, tolerance);
    let containsP2 = other.contains(p2, tolerance);
    let containsP3 = this.contains(p3, tolerance);
    let containsP4 = this.contains(p4, tolerance);

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
   * @param  {KraGL.math.LinearShape} other
   * @param  {number} [tolerance]
   * @return {vec4}
   */
  _intersectionSkew(other, tolerance) {
    let coeffs = this._getClosestLineCoeffs(other);
    let alpha = coeffs[0];
    let beta = coeffs[1];

    if(this.containsProjection(alpha) && other.containsProjection(beta)) {
      let p = this.projection(alpha);
      let q = other.projection(beta);

      let dist = vec4.dist(p, q);
      if(KraGL.math.approx(dist, 0, tolerance))
        return p;
      else
        return undefined;
    }
    else
      return undefined;
  }

  /**
   * Checks if this is collinear with another LinearShape.
   * @param {KraGL.math.LinearShape} other
   * @param {number} tolerance
   * @return {boolean}
   */
  isCollinear(other, tolerance) {
    let u = this.vec;
    let v = other.vec;
    let w = vec3.sub([], this._p1, other._p1);

    let sinUV = vec3.length(vec3.cross([], u, v));
    let sinUW = vec3.length(vec3.cross([], u, w));

    return KraGL.math.approx(sinUV, 0, tolerance) &&
      KraGL.math.approx(sinUW, 0, tolerance);
  }

  /**
   * Checks if this is parallel with another Shape.
   * @param {KraGL.math.Shape} other
   * @param {number} tolerance
   */
  isParallel(other, tolerance) {
    if(other instanceof KraGL.math.LinearShape) {
      let u = this.vec;
      let v = other.vec;

      let sinUV = vec3.length(vec3.cross([], u, v));
      return KraGL.math.approx(sinUV, 0, tolerance);
    }
    else
      return other.isParallel(this, tolerance);
  }

  /**
   * Gets a point projected from p1 along the line's vector.
   * @param {number} alpha The vector scalar to the projected point.
   * @return {vec4}
   */
  projection(alpha) {
    let u = this.vec;
    let scaledU = vec3.scale([], u, alpha);
    scaledU[3] = 0;
    return vec4.add([], this._p1, scaledU);
  }

  /**
   * Produces a Line from this shape.
   * @return {KraGL.math.Line}
   */
  toLine() {
    return new KraGL.math.Line({
      p1: this._p1,
      p2: this._p2
    });
  }

  /**
   * Produces a Ray from this shape.
   * @return {KraGL.math.Ray}
   */
  toRay() {
    return new KraGL.math.Ray({
      p1: this._p1,
      p2: this._p2
    });
  }

  /**
   * Produces a Segment from this shape.
   * @return {KraGL.math.Segment}
   */
  toSegment() {
    return new KraGL.math.Segment({
      p1: this._p1,
      p2: this._p2
    });
  }
}
export { LinearShape };
