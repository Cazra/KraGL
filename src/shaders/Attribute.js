'use strict';

import { ShaderVar } from './ShaderVar';

/**
 * A shader variable that varies from vertex to vertex.
 * @memberof KraGL.shaders
 */
export class Attribute extends ShaderVar {

  /**
   * The size of this attribute in its bound vertex buffer.
   * @type {uint}
   */
  get arraySize() {
    return this._gl.getVertexAttrib(this._location,
      GL_VERTEX_ATTRIB_ARRAY_SIZE);
  }

  /**
   * The base GL type for the array type.
   * @type {GLenum}
   */
  get arrayType() {
    return this._gl.getVertexAttrib(this._location,
      GL_VERTEX_ATTRIB_ARRAY_TYPE);
  }

  /**
   * The vertex buffer this attribute is currently bound to.
   * @type {WebGLBuffer}
   */
  get bufferBinding() {
    return this._gl.getVertexAttrib(this._location,
      GL_VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
  }

  /**
   * Whether this attribute is currently enabled.
   * @type {boolean}
   */
  get isEnabled() {
    return this._gl.getVertexAttrib(this._location,
      GL_VERTEX_ATTRIB_ARRAY_ENABLED);
  }

  /**
   * Whether this attribute becomes normalized when converted to floating
   * point values.
   * @type {boolean}
   */
  get isNormalized() {
    return this._gl.getVertexAttrib(this._location,
      GL_VERTEX_ATTRIB_ARRAY_NORMALIZED);
  }

  /**
   * The location of the attribute in its shader program.
   * @type {int}
   */
  get location() {
    return this._location;
  }

  /**
   * Gets the offset for this attribute in its currently bound vertex buffer.
   * @type {uint}
   */
  get offset() {
    return this._gl.getVertexAttribOffset(this._location,
      GL_VERTEX_ATTRIB_ARRAY_POINTER);
  }

  /**
   * The number of bytes between successive elements for this attribute in
   * its currently bound vertex buffer.
   * @type {uint}
   */
  get stride() {
    return this._gl.getVertexAttrib(this._location,
      GL_VERTEX_ATTRIB_ARRAY_STRIDE);
  }

  /**
   * A snapshot of the current value of the attribute as a vec4.
   * @type {vec4}
   */
  get value() {
    return this._gl.getVertexAttrib(this._location, GL_CURRENT_VERTEX_ATTRIB);
  }

  /**
   * @param {WebGL} gl
   * @param {WebGLProgram} program
   * @param {WebGLActiveInfo} info
   */
  constructor(gl, program, info) {
    super(program, info);

    this._gl = gl;
    this._location = gl.getAttribLocation(program, info.name);
  }

  /**
   * Binds the attribute to the currently bound vertex buffer.
   * Stride and offset MUST be a multiple of the size for the attribute's
   * unit type. As long as all of the attributes in the vertex buffer use the
   * same unit type (typically GL_FLOAT), this isn't much of an issue.
   * @param {uint} stride
   *        The number of bytes between successive vertices in the buffer.
   * @param {uint} offset
   *        The byte offset of this attribute from the start of a vertex in
   *        the buffer.
   */
  bind(stride, offset) {
    this._gl.vertexAttribPointer(this._location, this.sizeUnits, this.unitType,
      false, stride, offset);
  }

  /**
   * Disables the attribute.
   */
  disable() {
    this._gl.disableVertexAttribArray(this._location);
  }

  /**
   * Enables the attribute for use in a vertex buffer.
   */
  enable() {
    this._gl.enableVertexAttribArray(this._location);
  }
}
