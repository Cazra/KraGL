'use strict';

import { Types } from '../Types';

/**
 * Base class for Uniforms and Attributes.
 * @abstract
 * @memberof KraGL.shaders
 */
export class ShaderVar {

  /**
   * True iff this is an array variable.
   * @type {boolean}
   */
  get isArray() {
    return this._size > 1;
  }

  /**
   * True iff this is a built-in GL variable.
   * All built-in variables start with 'gl_'.
   * @type {boolean}
   */
  get isBuiltIn() {
    return this._name.startsWith('gl_');
  }

  /**
   * Returns the number of elements in this variable. For arrays, this is the
   * capacity of the array. For all other variables (including vec types),
   * this is 1.
   * @type {uint}
   */
  get length() {
    return this._size;
  }

  /**
   * The variable's name.
   * @type {string}
   */
  get name() {
    return this._name;
  }

  /**
   * The size of the variable in bytes.
   * @type {unit}
   */
  get sizeBytes() {
    return this._sizeBytes;
  }

  /**
   * The size of the variable in unit types.
   * @type {uint}
   */
  get sizeUnits() {
    return this._sizeUnits;
  }

  /**
   * The variable's GL type.
   * @type {GLenum}
   */
  get type() {
    return this._type;
  }

  /**
   * The variable's unit type. E.g. GL_FLOAT_VEC3 -> GL_FLOAT
   */
  get unitType() {
    return this._unitType;
  }

  /**
   * @param {WebGLProgram} program
   * @param {WebGLActiveInfo} info
   */
  constructor(program, info) {
    this._program = program;
    this._name = info.name;
    this._size = info.size;
    this._type = info.type;

    this._sizeBytes = info.size * Types.getSizeBytes(info.type);
    this._sizeUnits = Types.getSizeUnits(info.type);
    this._unitType = Types.getUnitType(info.type);
  }
}
