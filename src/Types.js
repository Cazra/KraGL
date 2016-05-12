define('KraGL.Types', ['KraGL'], function() {
  'use strict';

  /**
   * Shorthand name for WebGLRenderingContext.
   * @typedef {WebGLRenderingContext} WebGL
   */

  // Type meta-data declarations
  var typeNames = {};
  typeNames[GL_BYTE]            = "BYTE";
  typeNames[GL_UNSIGNED_BYTE]   = "UNSIGNED_BYTE";
  typeNames[GL_SHORT]           = "SHORT";
  typeNames[GL_UNSIGNED_SHORT]  = "UNSIGNED_SHORT";
  typeNames[GL_INT]             = "INT";
  typeNames[GL_UNSIGNED_INT]    = "UNSIGNED_INT";
  typeNames[GL_FLOAT]           = "FLOAT";
  typeNames[GL_FLOAT_VEC2]      = "FLOAT_VEC2";
  typeNames[GL_FLOAT_VEC3]      = "FLOAT_VEC3";
  typeNames[GL_FLOAT_VEC4]      = "FLOAT_VEC4";
  typeNames[GL_INT_VEC2]        = "INT_VEC2";
  typeNames[GL_INT_VEC3]        = "INT_VEC3";
  typeNames[GL_INT_VEC4]        = "INT_VEC4";
  typeNames[GL_BOOL]            = "BOOL";
  typeNames[GL_BOOL_VEC2]       = "BOOL_VEC2";
  typeNames[GL_BOOL_VEC3]       = "BOOL_VEC3";
  typeNames[GL_BOOL_VEC4]       = "BOOL_VEC4";
  typeNames[GL_FLOAT_MAT2]      = "FLOAT_MAT2";
  typeNames[GL_FLOAT_MAT3]      = "FLOAT_MAT3";
  typeNames[GL_FLOAT_MAT4]      = "FLOAT_MAT4";
  typeNames[GL_SAMPLER_2D]      = "SAMPLER_2D";
  typeNames[GL_SAMPLER_CUBE]    = "SAMPLER_CUBE";


  var sizeUnits = {};
  sizeUnits[GL_BYTE]           = 1;
  sizeUnits[GL_UNSIGNED_BYTE]  = 1;
  sizeUnits[GL_SHORT]          = 1;
  sizeUnits[GL_UNSIGNED_SHORT] = 1;
  sizeUnits[GL_INT]            = 1;
  sizeUnits[GL_UNSIGNED_INT]   = 1;
  sizeUnits[GL_FLOAT]          = 1;
  sizeUnits[GL_FLOAT_VEC2]     = 2;
  sizeUnits[GL_FLOAT_VEC3]     = 3;
  sizeUnits[GL_FLOAT_VEC4]     = 4;
  sizeUnits[GL_INT_VEC2]       = 2;
  sizeUnits[GL_INT_VEC3]       = 3;
  sizeUnits[GL_INT_VEC4]       = 4;
  sizeUnits[GL_BOOL]           = 1;
  sizeUnits[GL_BOOL_VEC2]      = 2;
  sizeUnits[GL_BOOL_VEC3]      = 3;
  sizeUnits[GL_BOOL_VEC4]      = 4;
  sizeUnits[GL_FLOAT_MAT2]     = 4;
  sizeUnits[GL_FLOAT_MAT3]     = 9;
  sizeUnits[GL_FLOAT_MAT4]     = 16;


  var sizeBytes = {};
  sizeBytes[GL_BYTE]           = 1;
  sizeBytes[GL_UNSIGNED_BYTE]  = 1;
  sizeBytes[GL_SHORT]          = 2;
  sizeBytes[GL_UNSIGNED_SHORT] = 2;
  sizeBytes[GL_INT]            = 4;
  sizeBytes[GL_UNSIGNED_INT]   = 4;
  sizeBytes[GL_FLOAT]          = 4;
  sizeBytes[GL_BOOL]           = 4;


  var unitTypes = {};
  unitTypes[GL_BYTE]           = GL_BYTE;
  unitTypes[GL_UNSIGNED_BYTE]  = GL_UNSIGNED_BYTE;
  unitTypes[GL_SHORT]          = GL_SHORT;
  unitTypes[GL_UNSIGNED_SHORT] = GL_UNSIGNED_SHORT;
  unitTypes[GL_INT]            = GL_INT;
  unitTypes[GL_UNSIGNED_INT]   = GL_UNSIGNED_INT;
  unitTypes[GL_FLOAT]          = GL_FLOAT;
  unitTypes[GL_FLOAT_VEC2]     = GL_FLOAT;
  unitTypes[GL_FLOAT_VEC3]     = GL_FLOAT;
  unitTypes[GL_FLOAT_VEC4]     = GL_FLOAT;
  unitTypes[GL_INT_VEC2]       = GL_INT;
  unitTypes[GL_INT_VEC3]       = GL_INT;
  unitTypes[GL_INT_VEC4]       = GL_INT;
  unitTypes[GL_BOOL]           = GL_BOOL;
  unitTypes[GL_BOOL_VEC2]      = GL_BOOL;
  unitTypes[GL_BOOL_VEC3]      = GL_BOOL;
  unitTypes[GL_BOOL_VEC4]      = GL_BOOL;
  unitTypes[GL_FLOAT_MAT2]     = GL_FLOAT;
  unitTypes[GL_FLOAT_MAT3]     = GL_FLOAT;
  unitTypes[GL_FLOAT_MAT4]     = GL_FLOAT;



  /**
   * @class Types
   * @memberof KraGL
   * @classdesc A singleton for getting information about GL types.
   */
  KraGL.Types = {
    /**
     * Gets the name of a GL type.
     * @param {GLenum} type
     * @return {string}
     */
    getName: function(type) {
      return typeNames[type];
    },

    /**
     * Gets the size in bytes for a GL type.
     * @param  {GLenum} type
     * @return {int}
     */
    getSizeBytes: function(type) {
      var unitType = unitTypes[type];
      var unitBytes = sizeBytes[unitType];
      var numUnits = sizeUnits[type];
      return unitBytes*numUnits;
    },

    /**
     * Gets the unit size of a GL type.
     * For base types, this is 1.
     * For vector types, this is the vector's legnth.
     * For matrix types, this is the square of the matrix's magnitude.
     * @param  {GLenum} type
     * @return {int}
     */
    getSizeUnits: function(type) {
      return sizeUnits[type];
    },

    /**
     * Gets the unit type for a GL type.
     * For example, the unit type of GL_FLOAT_VEC2 is GL_FLOAT
     * @param  {GLenum} type
     * @return {GLenum}
     */
    getUnitType: function(type) {
      return unitTypes[type];
    }
  };


});
