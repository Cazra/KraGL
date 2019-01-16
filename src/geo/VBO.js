'use strict';

/**
 * A Vertex Buffer Object (VBO).
 * This loads vertex attributes and index information for a mesh into the
 * GPU memory to be rendered using some particular ShaderProgram.
 *
 * The advantage over VBOs over using vertex arrays is that VBOs allow shared
 * vertices between primitives. This means that in general VBOs have a
 * lower memory footprint on the GPU and can be rendered more quickly.
 *
 * VBOs are rendered by index rather than by vertex data. The primitives are
 * rendered from the order of the indices, which are used to look up
 * the vertex information.
 */
export class VBO {
  /**
   * The list of attributes loaded the GL buffer, sorted alphabetically by name.
   * @type {KraGL.shaders.Attribute[]}
   */
  get attributes() {
    return this._attrs;
  }

  /**
   * The GL buffer containing the loaded vertex attributes.
   * @type {WebGLBuffer}
   */
  get attrBuffer() {
    return this._attrBuffer;
  }

  /**
   * The VBO's drawing mode. This defines how the indices should be ordered
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

  /**
   * The GL buffer containing the loaded vertex indices.
   * @type {WebGLBuffer}
   */
  get indexBuffer() {
    return this._indexBuffer;
  }

  /**
   * The number of vertex indices loaded into the VBO.
   * @type {uint}
   */
  get indexCount() {
    return this._indexCount;
  }

  /**
   * The stride of the vertex attribute data in its GL buffer.
   * @type {uint}
   */
  get stride() {
    return this._stride;
  }

  /**
   * @param {KraGL.shaders.ShaderProgram} shader
   *        The ShaderProgram that will be used to render this VBO.
   * @param {KraGL.geo.Mesh} mesh
   *        The mesh whose data will be loaded into the VBO.
   */
  constructor(shader, mesh) {
    this._drawMode = mesh.drawMode;
    this._initStrideAndOffsets(shader);
    this._initAttrBuffer(shader, mesh);
    this._initIndexBuffer(shader, mesh);
  }

  /**
   * Unloads any GL objects associated with this VBO.
   * Once this is done, you will no longer be able to use this object.
   * @param {WebGLRenderingContext} gl
   */
  clean(gl) {
    gl.deleteBuffer(this.attrBuffer);
    gl.deleteBuffer(this.indexBuffer);
  }

  /**
   * Creates and fills the GL buffer that will hold the mesh's vertex
   * attribute data.
   * @param {KraGL.shaders.ShaderProgram} shader
   * @param {KraGL.geo.Mesh} mesh
   */
  _initAttrBuffer(shader, mesh) {
    let gl = shader.gl;

    // Get the attribute data for each vertex.
    let attrData = [];
    _.each(mesh.vertices, vertex => {
      _.each(this._attrs, attr => {
        // Only process attributes that have vertex property getters.
        if(attr.getterName) {
          let value = vertex[attr.getterName];
          _.each(value, elem => {
            attrData.push(elem);
          });
        }
      });
    });

    // All attributes are loaded as 32-bit floats.
    let f32Data = new Float32Array(attrData);

    // Load the vertex attribute data into a GL buffer.
    this._attrBuffer = gl.createBuffer();
    gl.bindBuffer(GL_ARRAY_BUFFER, this._attrBuffer);
    gl.bufferData(GL_ARRAY_BUFFER, f32Data, GL_STATIC_DRAW);
  }

  /**
   * Creates and fills the GL buffer that will hold the mesh's vertex indices.
   * @param {KraGL.shaders.ShaderProgram} shader
   * @param {KraGL.geo.Mesh} mesh
   */
  _initIndexBuffer(shader, mesh) {
    let gl = shader.gl;
    this._indexCount = mesh.indices.length;

    // All indices are loaded as 16-bit unsigned ints.
    let u16Data = new Uint16Array(mesh.indices);

    // Load the indices into a GL buffer.
    this._indexBuffer = gl.createBuffer();
    gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, this._indexBuffer);
    gl.bufferData(GL_ELEMENT_ARRAY_BUFFER, u16Data, GL_STATIC_DRAW);
  }

  /**
   * Initializes the VBO's attributes stride and offsets based on the
   * attributes of the provided ShaderProgram. These are all
   * measured in bytes.
   * @param {KraGL.shaders.ShaderProgram} shader
   */
  _initStrideAndOffsets(shader) {
    // Get the sorted attribute names.
    let attrNames = _.keys(shader.attributes);
    attrNames.sort();

    let curOffset = 0;
    this._attrs = [];
    this._offsets = [];
    _.each(attrNames, name => {
      let attr = shader.attributes[name];

      // Only process attributes that have vertex property getters.
      if(attr.getterName) {
        this._attrs.push(attr);
        this._offsets.push(curOffset);
        curOffset += attr.sizeBytes;
      }
    });
    this._stride = curOffset;
  }

  /**
   * Renders the VBO. It is assumed that the currently loaded ShaderProgram
   * is the one associated with this VBO.
   * @param {WebGLRenderingContext}
   */
  render(gl) {
    // Bind the attributes.
    gl.bindBuffer(GL_ARRAY_BUFFER, this.attrBuffer);
    _.each(this.attributes, (attr, index) => {
      let offset = this._offsets[index];
      attr.bind(this.stride, offset);
    });

    // Bind the indices and draw the VBO's data.
    gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements(this.drawMode, this.indexCount, GL_UNSIGNED_SHORT, 0);
  }
}
