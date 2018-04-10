'use strict';

/**
 * A 3D object composed of a series of primitives (points, lines, or triangles)
 * defined by some list of vertices.
 * @memberof KraGL.geo
 * @implements {Cloneable}
 */
export class Mesh {

  /**
   * A point whose position is the average of all the vertices in the mesh.
   * @type {vec4}
   */
  get centroid() {
    let sumPts = _.reduce(this.vertices, (memo, v) => {
      memo[0] += v.xyz[0];
      memo[1] += v.xyz[1];
      memo[2] += v.xyz[2];
      return memo;
    }, [0,0,0]);

    let centroid = vec3.scale([], sumPts, 1/this.vertices.length);
    centroid[3] = 1;
    return centroid;
  }

  /**
   * The mesh's face culling mode. This can be any of the following:
   * GL_FRONT: draw only front faces for each triangle.
   * GL_BACK: draw only back faces for each triangle.
   * GL_FRONT_AND_BACK: draw both faces for each triangle.
   * @type {GLenum}
   */
  get cullMode() {
    return this._cullMode;
  }
  set cullMode(mode) {
    this._cullMode = mode || GL_FRONT_AND_BACK;
  }

  /**
   * The mesh's drawing mode. This defines how the indices should be ordered
   * to draw each primitive. This can be any of the following:
   * GL_POINTS: Each vertex is drawn as a point.
   * GL_LINES: Every 2 vertices are drawn as a line segment.
   * GL_LINE_STRIP: A line is drawn from each vertex to the next vertex.
   * GL_LINE_LOOP: A line is drawn from each vertex to the next, plus a line
   *    connecting the last vertex to the first.
   * GL_TRIANGLES: Every 3 vertices are drawn as a triangle.
   * @type {GLenum}
   */
  get drawMode() {
    return this._drawMode;
  }
  set drawMode(mode) {
    this._drawMode = mode || GL_TRIANGLES;
  }

  /**
   * The winding direction used to determine the front face of each triangle
   * in this mesh. This can be either of the following:
   * GL_CW: The face where the vertices are in clockwise order is the front.
   * GL_CCW: The face where the vertices are in counter-clockwise order is
   *    the front.
   * @type {GLenum}
   */
  get frontFace() {
    return this._frontFace;
  }
  set frontFace(mode) {
    this._frontFace = mode || GL_CCW;
  }

  /**
   * The vertex indices specifying the order to draw the mesh's primitives.
   * @type {uint[]}
   */
  get indices() {
    return this._indices;
  }
  set indices(v) {
    this._indices = v;
  }

  /**
   * The vertices defining the mesh.
   * @type {KraGL.geo.Vertex[]}
   */
  get vertices() {
    return this._vertices;
  }
  set vertices(v) {
    this._vertices = v;
  }

  /**
   * @param {object} opts
   * @param {GLenum} [opts.cullMode=GL_FRONT_AND_BACK]
   *        The face culling mode used for the mesh.
   * @param {GLenum} [opts.drawMode=GL_TRIANGLES]
   *        The drawing mode used for the mesh.
   * @param {GLenum} [opts.frontFace=GL_CCW]
   *        The winding direction used to determine the front of each triangle.
   * @param {uint[]} opts.indices
   *        The list of indices specifying the order to draw the vertices as
   *        more complex primitives defined by drawMode.
   * @param {KraGL.geo.Vertex[]} opts.vertices
   *        The vertices defining the mesh.
   */
  constructor(opts) {
    this.vertices = opts.vertices;
    this.indices = opts.indices;
    this.drawMode = opts.drawMode;
    this.cullMode = opts.cullMode;
    this.frontFace = opts.frontFace;
  }

  /**
   * Creates a cloned copy of this mesh.
   * @return {KraGL.geo.Mesh}
   */
  clone() {
    return this.transform(mat4.identity([]));
  }

  /**
   * Produces a mesh resulting from an affine transformation applied to this
   * mesh.
   * @param {mat4} m
   *        The matrix for the affine transformation.
   * @return {KraGL.geo.Mesh}
   */
  transform(m) {
    return new Mesh({
      cullMode: this.cullMode,
      drawMode: this.drawMode,
      frontFace: this.frontFace,
      indices: _.clone(this.indices),
      vertices: _.map(this.vertices, v => {
        return v.transform(m);
      })
    });
  }
}