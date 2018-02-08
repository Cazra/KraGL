'use strict';

import { Ajax } from '../io';
import { Attribute } from './Attribute';
import { ShaderError } from './ShaderError';
import { Uniform } from './Uniform';

/**
 * Options for loading and compiling a vertex or fragment shader.
 * @typedef {object} ShaderOpts
 * @property {string} [sources[]]
 *           One or more strings containing the raw source code for the shader.
 *           Multiple source codes can be provided in much the same way that
 *           C libraries can be linked. However, only one source string can
 *           have a main function.
 * @property {string} [urls[]]
 *           URLs to a file defining the shader source code.
 *           Multiple source codes can be provided in much the same way that
 *           C libraries can be linked. However, only one source string can
 *           have a main function.
 */

/**
 * A compiled GLSL shader program with access to its uniform and attribute
 * variables. For WebGL 1.0 contexts, this supports shaders that conform to the
 * OpenGL ES Shading Language v1.0. For WebGL 2.0 contexts, it supports shaders
 * that conform to OpenGL ES Shading Language v3.0.
 * @memberof KraGL.shaders
 */
class ShaderProgram {

  /**
   * A map of the program's attribute variables, keyed by name.
   * @type {map<string, KraGL.shaders.Attribute>}
   */
  get attributes() {
    return this._attributes;
  }

  /**
   * A map of the program's uniform variables, keyed by name.
   * @type {map<string, KraGL.shaders.Uniform>}
   */
  get uniforms() {
    return this._uniforms;
  }

  /**
   * Please do not directly use the constructor. Create ShaderProgram through
   * the static createProgram method instead.
   * @param {object} opts
   * @param {WebGLProgram} opts.program
   * @param {map<string, KraGL.shaders.Uniform>} opts.uniforms
   * @param {map<string, KraGL.shaders.Attribute>} opts.attributes
   */
  constructor(gl, opts) {
    this._gl = gl;
    this._program = opts.program;
    this._uniforms = opts.uniforms;
    this._attributes = opts.attributes;
  }

  /**
   * Produces the map of information for a program's attribute variables.
   * @private
   * @param {WebGL} gl
   * @param {WebGLProgram} program
   * @return {map<string, KraGL.shaders.Attribute>}
   *         A map of the attribute variables, keyed by name.
   */
  static _analyzeAttributes(gl, program) {
    let result = {};
    let count = gl.getProgramParameter(program, GL_ACTIVE_ATTRIBUTES);
    _.each(_.range(count), i => {
      let info = gl.getActiveAttrib(program, i);
      let attr = new Attribute(gl, program, info);
      result[info.name] = attr;
    });
    return result;
  }

  /**
   * Produces the map of information for a program's uniform variables.
   * @private
   * @param {WebGL} gl
   * @param {WebGLProgram} program
   * @return {map<string, KraGL.shaders.Uniform>}
   *         A map of the uniform variables, keyed by name.
   */
  static _analyzeUniforms(gl, program) {
    let result = {};
    let count = gl.getProgramParameter(program, GL_ACTIVE_UNIFORMS);
    _.each(_.range(count), i => {
      let info = gl.getActiveUniform(program, i);
      let uniform = new Uniform(gl, program, info);
      result[info.name] = uniform;
    });
    return result;
  }

  /**
   * Builds a ShaderProgram from the source code given for its vertex and
   * fragment shaders.
   * @private
   * @param {WebGL} gl
   * @param {string} vertSrc
   *        Source code for the vertex shader.
   * @param {string} fragSrc
   *        Source code for the fragment shader.
   * @return {KraGL.shaders.ShaderProgram}
   */
  static _build(gl, vertSrc, fragSrc) {
    let vertShader = ShaderProgram._compileShader(gl, GL_VERTEX_SHADER,
      vertSrc);
    let fragShader = ShaderProgram._compileShader(gl, GL_FRAGMENT_SHADER,
      fragSrc);

    let program = ShaderProgram._linkProgram(gl, vertShader, fragShader);
    let uniforms = ShaderProgram._analyzeUniforms(gl, program);
    let attributes = ShaderProgram._analyzeAttributes(gl, program);

    return new ShaderProgram(gl, { attributes, program, uniforms });
  }

  /**
   * Compiles a shader from its source code.
   * @private
   * @param {WebGL} gl
   * @param {GLenum} type
   *        GL_VERTEX_SHADER or GL_FRAGMENT_SHADER
   * @param {string} source
   *        The shader source code.
   * @return {WebGLShader}
   */
  static _compileShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // Check for errors.
    if(!gl.getShaderParameter(shader, GL_COMPILE_STATUS)) {
      let msg = gl.getShaderInfoLog(shader);

      let typeStr = 'vertex';
      if(type === GL_FRAGMENT_SHADER)
        typeStr = 'fragment';

      throw new ShaderError(`Failed to compile ${typeStr} shader. ` +
        `Reason: ${msg}`);
    }
    return shader;
  }

  /**
   * @typedef {object} CreateProgramOpts
   * @property {ShaderOpts} opts.frag
   *        Options for loading and compiling the fragment shader.
   * @property {ShaderOpts} opts.vert
   *        Options for loading and compiling the vertex shader.
   */

  /**
   * Creates a ShaderProgram and loads its resources into the WebGL context.
   * @param {WebGL} gl
   * @param {CreateProgramOpts} opts
   * @return {Promise<ShaderProgram>}
   */
  static createProgram(gl, opts) {
    return ShaderProgram._loadSourceCode(gl, opts.vert, opts.frag)
    .then(sources => {
      let [vertSrc, fragSrc] = sources;
      return ShaderProgram._build(gl, vertSrc, fragSrc);
    });
  }

  /**
   * Links the shaders into a program.
   * @private
   * @param {WebGL} gl
   * @param {WebGLShader} vertShader
   * @param {WebGLShader} fragShader
   * @return {WebGLProgram}
   */
  static _linkProgram(gl, vertShader, fragShader) {
    let program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.validateProgram(program);

    // Check for errors.
    if(!gl.getProgramParameter(program, GL_LINK_STATUS)) {
      let msg = gl.getProgramInfoLog(program);
      throw new ShaderError(`Failed to link shader program. Reason: ${msg}`);
    }

    return program;
  }

  /**
   * Loads the vertex and fragment shaders' GLSL source code from their URLs.
   * @private
   * @param {WebGL} gl
   * @param {ShaderOpts} vertOpts
   *        Options for loading and compiling the vertex shader.
   * @param {ShaderOpts} fragOpts
   *        Options for loading and compiling the fragment shader.
   * @return {Promise<string[]>}
   *         The joined source strings for the vertex shader and the
   *         fragment shader.
   */
  static _loadSourceCode(gl, vertOpts, fragOpts) {
    return Promise.all(_.map([vertOpts, fragOpts], opts => {
      return Promise.all(_.map(opts.urls || [], url => {
        return Ajax.get(url);
      }))
      .then(newSources => {
        // WebGL cannot accept an array of source strings, so we must
        // concatenate them into one source string.
        let sources = opts.sources || [];
        let src = sources.concat(newSources).join("\n");

        // Detect whether any WebGL 2 shader code is being used.
        let isWebGL2 = false;
        src = src.replace(/#version 300 es/, () => {
          isWebGL2 = true;
          return '';
        });
        if(isWebGL2) {
          if(gl instanceof WebGLRenderingContext)
            throw new ShaderError('GLSL 3.0 ES shader source code cannot be ' +
              'compiled with a WebGL 1.0 rendering context.');

          // Make sure that the GLSL 3.0 ES declaration is the very first line
          // in the source code.
          src = '#version 300 es\n' + src;
        }

        return src;
      });
    }));
  }

  /**
   * Unloads the program's resources from WebGL.
   * Once this is done, you will no longer be able to use this ShaderProgram.
   */
  clean() {
    this._gl.deleteProgram(this._program);
  }

  /**
   * Disables this ShaderProgram and its variables. Please do not invoke this
   * directly. Use ShaderLib.bind instead.
   */
  disable() {
    _.each(this._attributes, attr => {
      attr.disable();
    });
  }

  /**
   * Enables this ShaderProgram and its variables. Please do not invoke this
   * directly. Use ShaderLib.bind instead.
   */
  enable() {
    _.each(this._attributes, attr => {
      attr.enable();
    });
    this._gl.useProgram(this._program);
  }
}
export { ShaderProgram };
