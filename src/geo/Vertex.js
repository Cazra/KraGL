'use strict';

import { Color } from '../materials';

/**
 * A 3D vertex primitive.
 * @memberof KraGL.geo
 * @implements {Cloneable}
 */
export class Vertex {

  /**
   * The vertex's color.
   * @type {KraGL.materials.Color}
   */
  get color() {
    return this._color;
  }
  set color(v) {
    this._color = v || new Color({ rgba: [1,1,1,1] });
  }

  /**
   * The surface normal vector.
   * @type {vec3}
   */
  get n() {
    return this._n;
  }
  set n(v) {
    this._n = v || [0, 0, 1];
  }

  /**
   * The surface tangent vector. This should be orthogonal to n.
   * The surface normal vector, the surface tangent vector, and surface
   * bitangent vector (n x t), together form the tangential basis for the
   * vertex used for special techniques such as normal mapping textures.
   * @type {vec3}
   */
  get t() {
    return this._t;
  }
  set t(v) {
    if(!v) {
      // If undefined, auto-calculate t to be orthogonal to n.
      let nHat = vec3.normalize([], this.n);
      let up = [0,1,0];
      if(nHat[1] === 1)
        up = [0, 0, -1];
      v = vec3.cross([], up, nHat);
    }
    this._t = v;
  }

  /**
   * The 2D texture coordinates.
   * @type {vec2}
   */
  get texST() {
    return this._texST;
  }
  set texST(v) {
    this._texST = v || [0, 0];
  }

  /**
   * The position of the vertex in homogeneous 3D coordinates.
   * @type {vec4}
   */
  get xyz() {
    return this._xyz;
  }
  set xyz(v) {
    this._xyz = [
      v[0] || 0,
      v[1] || 0,
      v[2] || 0,
      1
    ];
  }

  /**
   * @param {object} opts
   * @param {KraGL.materials.Color} [color]
   *        The vertex's color.
   * @param {vec3} [opts.n]
   *        The vertex's surface normal vector.
   * @param {vec3[]} [opts.t]
   *        The vector's surface tangent vector, orthogonal to n.
   * @param {vec2} [opts.texST]
   *        The vertex's 2D texture coordinates.
   * @param {vec4} opts.xyz
   *        The vertex's position.
   */
  constructor(opts) {
    this.xyz = opts.xyz;
    this.n = opts.n;
    this.t = opts.t;
    this.texST = opts.texST;
    this.color = opts.color;
  }

  /**
   * Produces a cloned copy of this Vertex.
   * @return {KraGL.geo.Vertex}
   */
  clone() {
    return new Vertex({
      xyz: _.clone(this.xyz),
      n: _.clone(this.n),
      t: _.clone(this.t),
      texST: _.clone(this.texST),
      color: this.color.clone()
    });
  }

  /**
   * Creates a new Vertex which is the result of applying an affine
   * transformation to this Vertex.
   * @param {mat4} m
   *        The matrix for the affine transformation.
   * @return {KraGL.geo.Vertex}
   */
  transform(m) {
    return new Vertex({
      color: this.color,
      n: vec4.transformMat4([], [...this.n, 0], m).slice(0, 3),
      t: vec4.transformMat4([], [...this.t, 0], m).slice(0, 3),
      texST: this.texST,
      xyz: vec4.transformMat4([], this.xyz, m)
    });
  }
}
