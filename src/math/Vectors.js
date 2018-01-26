'use strict';

/**
 * A collection of common vector math functions.
 * @memberof KraGL.math
 */
class Vectors {

  /**
   * Checks if two vectors are approximately equal.
   * @param {(vec2|vec3|vec4)} u
   * @param {(vec2|vec3|vec4)} v
   * @param {number} [tolerance=KraGL.EPSILON]
   * @return {boolean}
   */
  static approx(u, v, tolerance=KraGL.EPSILON) {
    if(u.length !== v.length)
      throw new Error('Vectors must be the same length.');

    return _.chain(_.range(u.length))
    .find(i => {
      return !KraGL.math.approx(u[i], v[i], tolerance);
    })
    .isUndefined()
    .value();
  }

  /**
   * Checks if two vectors are exactly equal.
   * @param {(vec2|vec3|vec4)} u
   * @param {(vec2|vec3|vec4)} v
   * @return {boolean}
   */
  static equal(u, v) {
    if(u.length !== v.length)
      throw new Error('Vectors must be the same length.');

    return _.chain(_.range(u.length))
    .find(i => {
      return u[i] !== v[i];
    })
    .isUndefined()
    .value();
  }

  /**
   * Getes the glmatrix type for a vector.
   * @param {(vec2|vec3|vec4)} u
   * @return {type}
   */
  static getType(u) {
    if(u.length === 2)
      return vec2;
    if(u.length === 3)
      return vec3;
    if(u.length === 4)
      return vec4;

    throw new Error('Not a valid glmatrix vector type.');
  }

  /**
   * Checks if two vectors are parallel.
   * @param {(vec2|vec3|vec4)} u
   * @param {(vec2|vec3|vec4)} v
   * @param {number} [tolerance=KraGL.EPSILON]
   * @return {boolean}
   */
  static parallel(u, v, tolerance=KraGL.EPSILON) {
    u = KraGL.math.toVec3(u);
    v = KraGL.math.toVec3(v);

    let cross = vec3.cross([], u, v);
    let sin = vec3.length(cross);
    return KraGL.math.approx(sin, 0, tolerance);
  }

  /**
   * Calculates the reflection vector of some incident vector.
   * See: https://www.opengl.org/sdk/docs/man/html/reflect.xhtml
   * @param  {vec3} i The normalized incident vector.
   * @param  {vec3} n The normalized surface normal vector.
   * @return {vec3}
   */
  static reflect(i, n) {
    let scalar = 2 * vec3.dot(n, i);
    let nScaled = vec3.scale([], n, scalar);
    return vec3.sub([], i, nScaled);
  }

  /**
   * Calculates the refraction vector of some incident vector.
   * See: https://www.opengl.org/sdk/docs/man/html/refract.xhtml
   * @param  {vec3} i The normalized incident vector.
   * @param  {vec3} n The normalized surface normal vector.
   * @param  {number} eta The ratio of indices of refraction.
   * @return {vec3}
   */
  static refract(i, n, eta) {
    let dotNI = vec3.dot(n, i);
    let k = 1.0 - eta*eta * (1.0 - dotNI*dotNI);
    if(k < 0)
      return [0,0,0];
    else {
      // eta * i - (eta * dot(n, i) + sqrt(k)) * n
      return vec3.sub([],
        vec3.scale([], i, eta),
        vec3.scale([], n, eta*dotNI + Math.sqrt(k))
      );
    }
  }

  /**
   * Computes the scalar projection of v onto u. This is also the length
   * of the projection of v onto u.
   * You can get the projection of v onto u by scaling uHat by this value.
   * @param  {(vec2|vec3|vec4)} u
   * @param  {(vec2|vec3|vec4)} v
   * @return {number}
   */
  static scalarProjection(u, v) {
    let clazz = this.getType(u);
    let uHat = clazz.normalize([], u);
    return clazz.dot(uHat, v);
  }

  /**
   * Spherically interpolates between two vectors.
   * @param {vec3} u
   * @param {vec3} v
   * @param {number} alpha
   * @return {vec3}
   */
  static slerp(u, v, alpha) {
    let uHat = vec3.normalize([], u);
    let vHat = vec3.normalize([], v);

    let n = vec3.cross([], u, v);
    let nHat = vec3.normalize([], n);
    if(nHat.length === 0)
      return vec3.lerp([], u, v, alpha);

    let dotUVHat = vec3.dot(uHat, vHat);
    let theta = Math.acos(dotUVHat) * alpha;

    let lenU = vec3.len(u);
    let lenV = vec3.len(v);
    let length = KraGL.math.mix(alpha, [lenU, lenV]);

    let q = quat.setAxisAngle([], nHat, theta);
    let slerpedHat = vec3.transformQuat([], uHat, q);
    return vec3.scale([], slerpedHat, length);
  }
}
export { Vectors };
