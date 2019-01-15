'use strict';

import { GLConstants as GL } from './GLConstants';

/**
 * Shorthand name for the WebGLRenderingContext.
 * @typedef {(WebGLRenderingContext|WebGL2RenderingContext)} WebGL
 */

// Type meta-data declarations
let typeNames = {};
typeNames[GL.BYTE]            = "BYTE";
typeNames[GL.UNSIGNED_BYTE]   = "UNSIGNED_BYTE";
typeNames[GL.SHORT]           = "SHORT";
typeNames[GL.UNSIGNED_SHORT]  = "UNSIGNED_SHORT";
typeNames[GL.INT]             = "INT";
typeNames[GL.UNSIGNED_INT]    = "UNSIGNED_INT";
typeNames[GL.FLOAT]           = "FLOAT";
typeNames[GL.FLOAT_VEC2]      = "FLOAT_VEC2";
typeNames[GL.FLOAT_VEC3]      = "FLOAT_VEC3";
typeNames[GL.FLOAT_VEC4]      = "FLOAT_VEC4";
typeNames[GL.INT_VEC2]        = "INT_VEC2";
typeNames[GL.INT_VEC3]        = "INT_VEC3";
typeNames[GL.INT_VEC4]        = "INT_VEC4";
typeNames[GL.BOOL]            = "BOOL";
typeNames[GL.BOOL_VEC2]       = "BOOL_VEC2";
typeNames[GL.BOOL_VEC3]       = "BOOL_VEC3";
typeNames[GL.BOOL_VEC4]       = "BOOL_VEC4";
typeNames[GL.FLOAT_MAT2]      = "FLOAT_MAT2";
typeNames[GL.FLOAT_MAT3]      = "FLOAT_MAT3";
typeNames[GL.FLOAT_MAT4]      = "FLOAT_MAT4";
typeNames[GL.SAMPLER_2D]      = "SAMPLER_2D";
typeNames[GL.SAMPLER_CUBE]    = "SAMPLER_CUBE";


let sizeUnits = {};
sizeUnits[GL.BYTE]           = 1;
sizeUnits[GL.UNSIGNED_BYTE]  = 1;
sizeUnits[GL.SHORT]          = 1;
sizeUnits[GL.UNSIGNED_SHORT] = 1;
sizeUnits[GL.INT]            = 1;
sizeUnits[GL.UNSIGNED_INT]   = 1;
sizeUnits[GL.FLOAT]          = 1;
sizeUnits[GL.FLOAT_VEC2]     = 2;
sizeUnits[GL.FLOAT_VEC3]     = 3;
sizeUnits[GL.FLOAT_VEC4]     = 4;
sizeUnits[GL.INT_VEC2]       = 2;
sizeUnits[GL.INT_VEC3]       = 3;
sizeUnits[GL.INT_VEC4]       = 4;
sizeUnits[GL.BOOL]           = 1;
sizeUnits[GL.BOOL_VEC2]      = 2;
sizeUnits[GL.BOOL_VEC3]      = 3;
sizeUnits[GL.BOOL_VEC4]      = 4;
sizeUnits[GL.FLOAT_MAT2]     = 4;
sizeUnits[GL.FLOAT_MAT3]     = 9;
sizeUnits[GL.FLOAT_MAT4]     = 16;


let sizeBytes = {};
sizeBytes[GL.BYTE]           = 1;
sizeBytes[GL.UNSIGNED_BYTE]  = 1;
sizeBytes[GL.SHORT]          = 2;
sizeBytes[GL.UNSIGNED_SHORT] = 2;
sizeBytes[GL.INT]            = 4;
sizeBytes[GL.UNSIGNED_INT]   = 4;
sizeBytes[GL.FLOAT]          = 4;
sizeBytes[GL.BOOL]           = 4;


let unitTypes = {};
unitTypes[GL.BYTE]           = GL.BYTE;
unitTypes[GL.UNSIGNED_BYTE]  = GL.UNSIGNED_BYTE;
unitTypes[GL.SHORT]          = GL.SHORT;
unitTypes[GL.UNSIGNED_SHORT] = GL.UNSIGNED_SHORT;
unitTypes[GL.INT]            = GL.INT;
unitTypes[GL.UNSIGNED_INT]   = GL.UNSIGNED_INT;
unitTypes[GL.FLOAT]          = GL.FLOAT;
unitTypes[GL.FLOAT_VEC2]     = GL.FLOAT;
unitTypes[GL.FLOAT_VEC3]     = GL.FLOAT;
unitTypes[GL.FLOAT_VEC4]     = GL.FLOAT;
unitTypes[GL.INT_VEC2]       = GL.INT;
unitTypes[GL.INT_VEC3]       = GL.INT;
unitTypes[GL.INT_VEC4]       = GL.INT;
unitTypes[GL.BOOL]           = GL.BOOL;
unitTypes[GL.BOOL_VEC2]      = GL.BOOL;
unitTypes[GL.BOOL_VEC3]      = GL.BOOL;
unitTypes[GL.BOOL_VEC4]      = GL.BOOL;
unitTypes[GL.FLOAT_MAT2]     = GL.FLOAT;
unitTypes[GL.FLOAT_MAT3]     = GL.FLOAT;
unitTypes[GL.FLOAT_MAT4]     = GL.FLOAT;

const Types = {
  /**
   * Gets the name of a GL type.
   * @param {GLEnum} type
   * @return {string}
   */
  getName: type => {
    return typeNames[type];
  },

  /**
   * Gets the number of bytes in a GL type.
   * @param {GLEnum} type
   * @return {int}
   */
  getSizeBytes: type => {
    let unitType = unitTypes[type];
    let unitBytes = sizeBytes[unitType];
    let units = sizeUnits[type];
    return unitBytes * units;
  },

  /**
   * Gets the number of units in a GL type.
   * For base types, this is 1.
   * For vector types, this is the vector's length.
   * For matrix types, this is the square of the matrix's magnitude.
   * @param {GLEnum} type
   * @return {int}
   */
  getSizeUnits: type => {
    return sizeUnits[type];
  },

  /**
   * Gets the typed array class appropriate for encapsulating a GL type.
   * @param {GLEnum} type
   * @return {class}
   */
  getTypedArray: type => {
    let unitType = Types.getUnitType(type);

    if(unitType === GL.BYTE)
      return Int8Array;
    else if(unitType === GL.UNSIGNED_BYTE)
      return Uint8Array;
    else if(unitType === GL.SHORT)
      return Int16Array;
    else if(unitType === GL.UNSIGNED_SHORT)
      return Uint16Array;
    else if(unitType === GL.INT)
      return Int32Array;
    else if(unitType === GL.UNSIGNED_INT)
      return Uint32Array;
    else if(unitType === GL.FLOAT)
      return Float32Array;
    else if(unitType === GL.BOOL)
      return Uint32Array;
  },

  /**
   * Gets the base type for a GL type.
   * For example, the unit type of FLOAT_VEC2 is FLOAT.
   * @param {GLEnum} type
   * @return {GLEnum}
   */
  getUnitType: type => {
    return unitTypes[type];
  }
};
export { Types };
