'use strict';

import { GeometryError } from './GeometryError';
import { VBO } from './VBO';
import { Vertex } from './Vertex';

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
   * GL_FRONT: cull front faces for each triangle.
   * GL_BACK: cull back faces for each triangle.
   * GL_FRONT_AND_BACK: cull both faces for each triangle.
   * @type {GLenum}
   */
  get cullMode() {
    return this._cullMode;
  }
  set cullMode(mode) {
    this._cullMode = mode || GL_BACK;
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
   * @param {class} [opts.vertexClass=KraGL.geo.Vertex]
   *        The class used to construct the vertices.
   *        If given, this must be a child class of KraGL.geo.Vertex.
   * @param {object} opts.vertices
   *        A list of options for constructing the mesh's vertices.
   */
  constructor(opts) {
    let VertClass = opts.vertexClass || Vertex;

    this.vertices = [];
    _.each(opts.vertices, vertOpts => {
      let vertex = new VertClass(vertOpts);
      this.vertices.push(vertex);
    });
    this.indices = opts.indices;
    this.drawMode = opts.drawMode;
    this.cullMode = opts.cullMode;
    this.frontFace = opts.frontFace;

    // A map of ShaderProgram names to Vertex Buffer Objects (VBOs).
    this._vbos = {};
  }

  /**
   * Unloads any GL resources associated with this mesh.
   * @param {WebGLRenderingContext} gl
   */
  clean(gl) {
    _.each(this._vbos, vbo => {
      vbo.clean(gl);
    });
    this._vbos = {};
  }

  /**
   * Creates a cloned copy of this mesh.
   * @return {KraGL.geo.Mesh}
   */
  clone() {
    return this.transform(mat4.identity([]));
  }

  /**
   * Generates the tangent and bitangent vectors for each each vertex in the
   * mesh, based on relative texture coordinates.
   * Algorithm stolen from
   * https://learnopengl.com/Advanced-Lighting/Normal-Mapping.
   */
  _generateTangents() {
    if(this.drawMode === GL_TRIANGLES) {
      let numTriangles = Math.floor(this.indices.length/3);

      _.each(numTriangles, triIndex => {
        let i1 = this.indices[triIndex * 3];
        let i2 = this.indices[triIndex * 3 + 1];
        let i3 = this.indices[triIndex * 3 + 2];

        let v1 = this.vertices[i1];
        let v2 = this.vertices[i2];
        let v3 = this.vertices[i3];

        let edge1 = vec3.sub([], v2.xyz, v1.xyz);
        let edge2 = vec3.sub([], v3.xyz, v1.xyz);

        let deltaUV1 = vec2.sub([], v2.uv, v1.uv);
        let du1 = deltaUV1[0];
        let dv1 = deltaUV1[1];
        let deltaUV2 = vec2.sub([], v3.uv, v1.uv);
        let du2 = deltaUV2[0];
        let dv2 = deltaUV2[1];

        // Keep in mind that in the GL matrices used here are in
        // row-major order. That is - the coordinates XY correspond to
        // row and column, respectively.
        let matUV = [
          du1, du2,
          dv1, dv2
        ];
        let matEdges = [
          edge1[0], edge2[0],
          edge1[1], edge2[1],
          edge1[2], edge2[2]
        ];

        let matUVInv = mat2.invert([], matUV);
         _.noop(matEdges, matUVInv); // TODO
      });
    }
    throw new GeometryError('');
  }

  /**
   * Renders the mesh using the VBO associated with the currently bound
   * ShaderProgram.
   * @param {KraGL.app.Application} app
   *        The application the mesh is being rendered in.
   */
  render(app) {
    let shaderName = app.shaderLib.curName;
    let shader = app.shaderLib.curProgram;
    let gl = app.gl;

    // Set up GL state.
    gl.cullFace(this.cullMode);
    gl.frontFace(this.frontFace);

    // Create the VBO data for the model if it doesn't already exist for
    // the current shader.
    if(!this._vbos[shaderName])
      this._vbos[shaderName] = new VBO(shader, this);

    // Render the mesh's VBO for the current shader.
    let vbo = this._vbos[shaderName];
    vbo.render(gl, this.drawMode);
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
