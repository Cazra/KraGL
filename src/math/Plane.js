'use strict';

import { MathError } from './MathError';
import { Shape } from './Shape';

/**
 * An infinite plane dividing 3D space.
 * @memberof KraGL.math
 * @extends KraGL.math.Shape
 */
class Plane extends Shape {

  /**
   * The normal vector of the plane. Internally, this is stored as a
   * unit vector.
   * @type {vec3}
   */
  get n() {
    return this._n;
  }
  set n(n) {
    if(vec3.length(n) === 0)
      throw new MathError('Normal vector must be non-zero.');
    this._n = vec3.normalize([], n);
  }

  /**
   * A point lying on the plane.
   * @type {vec4}
   */
  get p() {
    return this._p;
  }
  set p(p) {
    p[3] = 1;
    this._p = p;
  }

  /**
   * @param {object} options
   * @param {vec4} options.p
   *        A point lying on the plane.
   * @param {vec3} options.n
   *        The normal vector of the plane.
   */
  constructor(options) {
    super();
    options = options || {};
    this.p = options.p || [0, 0, 0];
    this.n = options.n || [0, 0, 1];
  }

  /**
   * @inheritdoc
   */
  approx(other, tolerance=KraGL.EPSILON) {
    return other instanceof Plane &&
      this.contains(other.p) &&
      KraGL.math.Vectors.approx(this.n, other.n, tolerance);
  }

  /**
   * @inheritdoc
   */
  clone() {
    return new Plane({
      p: this.p,
      n: this.n
    });
  }

  /**
   * @inheritdoc
   */
  dist(other) {
    if(other instanceof Shape) {
      if(other instanceof KraGL.math.LinearShape)
        return this._distLinearShape(other);
      throw new MathError('Shape not supported: ' + other.constructor.name);
    }

    // Assume that other is a point.
    else
      return this._distPt(other);
  }

  /**
   * Get the distance from this plane to a LinearShape.
   * @private
   * @param {KraGL.math.LinearShape} line
   * @return {number}
   */
  _distLinearShape(line) {
    let p = this.p;
    let q = line.p1;
    let n = this.n;
    let u = line.vec;
    let v = vec3.sub([], p, q);

    let dotNV = vec3.dot(n, v);
    let dotNU = vec3.dot(n, u);

    // If the line is parallel to the plane, just get the distance to one of
    // its points.
    if(dotNU === 0)
      return this.dist(q);
    else {
      let alpha = dotNV/dotNU;

      if(line.containsProjection(alpha))
        return 0;
      else
        return Math.min(this.dist(line.p1), this.dist(line.p2));
    }
  }

  /**
   * Get the distance from this plane to a point.
   * @private
   * @param {vec4} q
   * @return {number}
   */
  _distPt(q) {
    let v = vec3.sub([], q, this.p);
    let dotNV = vec3.dot(this.n, v);
    return Math.abs(dotNV);
  }

  /**
   * @inheritdoc
   */
  intersection(other) {
    if(other instanceof Plane)
      return this._intersectionPlane(other);
    else if(other instanceof KraGL.math.LinearShape)
      return this._intersectionLinearShape(other);
    else
      throw new MathError('Shape not supported: ' + other.constructor.name);
  }

  /**
   * Finds the intersection between this plane and some LinearShape.
   * If the line intersects the plane at a single point, then that point is
   * returned.
   * If the line lies on the plane, then a clone of the line is returned.
   * If the line does not intersect the plane, then undefined is returned.
   * @private
   * @param  {KraGL.math.LinearShape} line
   * @return {(vec4|KraGL.math.LinearShape)}
   */
  _intersectionLinearShape(line) {
    let p = this.p;
    let q = line.p1;
    let n = this.n;
    let u = line.vec;
    let v = vec3.sub([], p, q);

    let dotNV = vec3.dot(n, v);
    let dotNU = vec3.dot(n, u);

    // Is the line parallel to the plane?
    if(dotNU === 0) {

      // Is the line on the plane?
      if(dotNV === 0)
        return line.clone();
      else
        return undefined;
    }
    else {
      let alpha = dotNV/dotNU;

      // Try to project the line to a point on the plane.
      if(line.containsProjection(alpha)) {
        let pt = vec3.add([], q, vec3.scale([], u, alpha));
        pt[3] = 1;
        return pt;
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
    if(this.isParallel(other)) {
      if(this.contains(other.p))
        return this.clone();
      else
        return undefined;
    }

    // Non-parallel planes will intersect on a line.
    else {
      let p = this.p;
      let q = other.p;
      let m = this.n;
      let n = other.n;

      // The vector for the intersection line.
      let u = vec3.cross([], m, n);

      // Normal vector for a plane going through the origin.
      // Make sure it is not parallel with the intersection line.
      let w = [0, 0, 1];
      if(u[2] === 0)
        w = [1, 0, 0];

      // Solve the system of planar equations for R:
      // M^.(R-P)=0
      // N^.(R-Q)=0
      // W^.(R-0)=0
      //    ->
      // [m^.P]   [m^x m^y m^z] [Rx]
      // [n^.Q] = [n^x n^y n^z] [Ry]
      // [ 0  ]   [w^x w^y w^z] [Rz]
      let mat = [...m, ...n, ...w];
      let matInv = mat3.invert([], mat3.transpose([], mat));
      let lhs = [vec3.dot(m, p), vec3.dot(n, q), 0];
      let p1 = vec3.transformMat3([], lhs, matInv);
      let p2 = vec3.add([], p1, u);
      return new KraGL.math.Line({p1, p2});
    }
  }

  /**
   * Checks if this plane is paraellel with another shape.
   * @param {KraGL.math.Shape} other
   * @param {number} [tolerance=KraGL.EPSILON]
   * @return {boolean}
   */
  isParallel(other, tolerance=KraGL.EPSILON) {
    if(other instanceof Plane) {
      let sinNormals = vec3.len(vec3.cross([], this.n, other.n));
      return KraGL.math.approx(sinNormals, 0, tolerance);
    }
    else if(other instanceof KraGL.math.LinearShape) {
      let cosVN = vec3.dot(this.n, other.vec);
      return KraGL.math.approx(cosVN, 0, tolerance);
    }
    else
      throw new MathError("Shape not supported: " + other.constructor.name);
  }
}
export { Plane };
