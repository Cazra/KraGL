'use strict';

import { ShaderVar } from './ShaderVar';

// A map of setters from a uniform's GL type to the correct
// uniform[Matrix][1234][ivf] function.
const UNI_SETTERS = {
  [GL_FLOAT]: (gl, location, values) => {
    gl.uniform1fv(location, values);
  },
  [GL_FLOAT_VEC2]: (gl, location, values) => {
    gl.uniform2fv(location, values);
  },
  [GL_FLOAT_VEC3]: (gl, location, values) => {
    gl.uniform3fv(location, values);
  },
  [GL_FLOAT_VEC4]: (gl, location, values) => {
    gl.uniform4fv(location, values);
  },
  [GL_INT]: (gl, location, values) => {
    gl.uniform1iv(location, values);
  },
  [GL_INT_VEC2]: (gl, location, values) => {
    gl.uniform2iv(location, values);
  },
  [GL_INT_VEC3]: (gl, location, values) => {
    gl.uniform3iv(location, values);
  },
  [GL_INT_VEC4]: (gl, location, values) => {
    gl.uniform4iv(location, values);
  },
  [GL_BOOL]: (gl, location, values) => {
    gl.uniform1iv(location, values);
  },
  [GL_BOOL_VEC2]: (gl, location, values) => {
    gl.uniform2iv(location, values);
  },
  [GL_BOOL_VEC3]: (gl, location, values) => {
    gl.uniform3iv(location, values);
  },
  [GL_BOOL_VEC4]: (gl, location, values) => {
    gl.uniform4iv(location, values);
  },
  [GL_FLOAT_MAT2]: (gl, location, values) => {
    gl.uniformMatrix2fv(location, false, values);
  },
  [GL_FLOAT_MAT3]: (gl, location, values) => {
    gl.uniformMatrix3fv(location, false, values);
  },
  [GL_FLOAT_MAT4]: (gl, location, values) => {
    gl.uniformMatrix4fv(location, false, values);
  },
  [GL_SAMPLER_2D]: (gl, location, values) => {
    gl.uniform1iv(location, values);
  },
  [GL_SAMPLER_CUBE]: (gl, location, values) => {
    gl.uniform1iv(location, values);
  }
};

/**
 * A shader variable whose value remains the same across many vertices.
 * @memberof KraGL.shaders
 */
export class Uniform extends ShaderVar {

  /**
   * The uniform's location in its shader program.
   * @type {WebGLUniformLocation}
   */
  get location() {
    return this._location;
  }

  /**
   * The current value of the uniform.
   * @type {(number|number[])}
   */
  get value() {
    return this._gl.getUniform(this.program, this.location);
  }
  set value(v) {
    let setter = UNI_SETTERS[this.type];
    setter(this._gl, this._location, v);
  }

  /**
   * @param {WebGL} gl
   * @param {WebGLProgram} program
   * @param {WebGLActiveInfo} info
   */
  constructor(gl, program, info) {
    super(program, info);
    this._gl = gl;
    this._location = this._gl.getUniformLocation(program, info.name);
  }
}
