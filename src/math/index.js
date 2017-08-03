'use strict';

/**
 * The namespace for mathematical utilities and classes.
 * @namespace math
 * @memberof KraGL
 */
var math = /** @lends KraGL.math */ {

  /**
   * A number of radians forming a whole circle.
   * @const {number}
   */
  TAU: Math.PI*2,

  /**
   * Checks if two numbers are approximately equal to each other within
   * a given tolerance.
   * @param {number} x
   * @param {number} y
   * @param {number} tolerance
   * @return {boolean}
   */
  approx: (x, y, tolerance=KraGL.EPSILON) => {
    if(tolerance < 0)
      throw new Error('Negative tolerance not allowed.');

    return Math.abs(x-y) <= tolerance;
  },

  /**
   * Converts a point from polar coordinates to Cartesian coordinates.
   * The result is a homogenous 3D point.
   * @param {(vec2|vec3)} pt
   * @return {vec4}
   */
  cartesian: pt => {
    let polar = vec3(pt);

    let r = polar[0];
    if(r === 0)
      return [0, 0, 0, 1];

    let theta = polar[1];
    let phi = polar[2];
    let cosTheta = Math.cos(theta);
    let sinTheta = Math.sin(theta);
    let cosPhi = Math.cos(phi);
    let sinPhi = Math.sin(phi); // I hope sinPhi notices me.

    return [
      r*cosTheta*sinPhi,
      r*sinTheta*sinPhi,
      r*cosPhi,
      1
    ];
  },

  /**
   * Constrains a value to lie between two bounds.
   * @param {number} x
   * @param {number} min
   * @param {number} max
   * @return {number}
   */
  clamp: (x, min, max) => {
    return Math.max(min, Math.min(x, max));
  },

  /**
   * Converts an angle from radians to degrees.
   * @param {number} radians
   * @return {number}
   */
  degrees: radians => {
    return radians/math.TAU*360;
  },

  /**
   * Gets the fractional part of some number, computed as x - floor(x).
   * @param {number} x
   * @return {number}
   */
  fract: x => {
    return x - Math.floor(x);
  },

  /**
   * Linearly maps a number from some domain to some range.
   * @param {number} x
   * @param {vec2} domain
   * @param {vec3} domain
   * @return {number}
   */
  linearMap: (x, domain, range) => {
    let dDomain = domain[1] - domain[0];
    let alpha = (x - domain[0])/dDomain;
    return math.mix(alpha, range);
  },

  /**
   * Produces a linear blend of a parametric value onto some range.
   * @param {number} alpha
   * @param {vec2} range
   * @return {number}
   */
  mix: (alpha, range) => {
    let dRange = range[1] - range[0];
    return range[0] + alpha*dRange;
  },

  /**
   * Converts a vector into a homogenous 3D point.
   * @param {(vec2|vec3|vec4)} v
   * @return {vec4}
   */
  point: v => {
    let pt = math.vec4(v);
    pt[3] = 1;
    return pt;
  },

  /**
   * Converts a vector into a homogenous 2D point.
   * @param {(vec2|vec3|vec4)} v
   * @return {vec3}
   */
  point2D: v => {
    let pt = math.vec3(v);
    pt[2] = 1;
    return pt;
  },

  /**
   * Converts a point from Cartesian coordinates to polar coordinates.
   * @param {(vec2|vec3|vec4)} pt
   * @return {vec3}
   */
  polar: pt => {
    pt = math.vec3(pt);
    let dist = vec3.dist(pt, [0,0,0]);
    if(dist === 0)
      return [0, NaN, NaN];
    else {
      let theta = Math.atan2(pt[1], pt[0]);
      let phi = Math.acos(pt[2]/dist);
      return [
        dist,
        theta,
        phi
      ];
    }
  },

  /**
   * Converts an angle from degrees to radians.
   * @param {number} degrees
   * @return {number}
   */
  radians: degrees => {
    return degrees/360*math.TAU;
  },

  /**
   * Gets the sign of some number. This results is 0 if the number is
   * 0, -1 if the number is negative, or 1 if the number is positive.
   * @param {number} x
   * @return {number}
   */
  sign: x => {
    if(x === 0)
      return 0;
    return x/Math.abs(x);
  },

  /**
   * A step function that returns 0 if x < edge. Else 1.
   * @see {@link https://www.khronos.org/registry/OpenGL-Refpages/gl4/html/
   * step.xhtml|GLSL step}
   * @param {number} edge
   * @param {number} x
   * @return {number}
   */
  step: (edge, x) => {
    if(x < edge)
      return 0;
    return 1;
  },

  /**
   * Gets the parametric value of x within some range.
   * @param {number} x
   * @param {vec2} range
   * @return {number}
   */
  unmix: (x, range) => {
    let dRange = range[1] - range[0];
    return (x - range[0])/dRange;
  },

  /**
   * Converts a vector of one type to another.
   * @private
   * @param {(vec2|vec3|vec4)} u
   * @param {int} degree
   * @return {(vec2|vec3|vec4)}
   */
  _vec: (u, degree) => {
    let result = u.slice(0, degree);
    while(result.length < degree)
      result.push(0);
    return result;
  },

  /**
   * Converts a vector into a vec2.
   * @param {(vec2|vec3|vec4)}
   * @return {vec2}
   */
  vec2: u => {
    return math._vec(u, 2);
  },

  /**
   * Converts a vector into a vec3.
   * @param {(vec2|vec3|vec4)}
   * @return {vec3}
   */
  vec3: u => {
    return math._vec(u, 3);
  },

  /**
   * Converts a vector into a vec4.
   * @param {(vec2|vec3|vec4)}
   * @return {vec4}
   */
  vec4: u => {
    return math._vec(u, 4);
  },

  /**
   * Wraps some value to lie in the range [min, max).
   * @param {number} x
   * @param {vec2} range
   * @return {number}
   */
  wrap: (x, range) => {
    let dRange = range[1] - range[0];
    let dx = (x - range[0]) % dRange;
    if(dx < 0)
      dx += dRange;

    return range[0] + dx;
  }
};
export { math };
