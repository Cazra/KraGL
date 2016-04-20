/* 
 @preserve Copyright (c) 2014 Stephen "Cazra" Lindberg

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 The Software shall be used for Good, not Evil.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
*/

/**
 * The KraGL namespace and singleton.
 */
var KraGL = {
    
    /**
     * Makes a child inherit one or more classes plus a config object defining
     * new/overriding properties.
     * @param {Class...} arguments    The first argument is the derived class. The 
     * next arguments, up to the last one are inherited classes. 
     * The first inherited class is considered to be the parent of the derived
     * class. All other inherited classes are considered to be mix-ins.
     * The last argument is a config object defining the new, overridden, 
     * and static properties of the class.
     */
    extend: function() {
        var length = arguments.length;
        
        // The first argument is our derived class.
        var child = _.first(arguments);
        
        // The last argument contains the new/overriding properties.
        var config = _.last(arguments);
        
        // The config can have an optional statics property containing static
        // members of the class.
        var statics = config.statics;
        config = _.omit(config, statics);
        
        // Extend our class's prototype with the inherited classes and the config.
        var classes = _.take(arguments, length-1);
        var pTypes = _.map(classes, function(clazz) {
            return clazz.prototype
        });
        pTypes.push(config);
        _.extend.apply(this, pTypes);
        
        // Register the first inherited class as its parent.
        child.prototype._parentClass = arguments[1];
        
        // Add our statics as properties of the class.
        _.each(statics, function(val, key) {
            child.key = val;
        });
        
        // Add the class's id to its type-checking stuff.
        var uid = _.uniqueId('class');
        child.prototype._classUid = uid;
        child.prototype._isaClassUids[uid] = true;
    },
    
    
    /** 
     * Returns the string representation of a WebGL constant representing 
     * some data type or uniform variable type. 
     * @param {GLenum} type
     * @return {string}
     */
    glTypeName: function(type) {
        return this._glTypeNames[type];
    },
  
    /** 
     * Returns the size of a WebGL type in units of its base type.
     * @param {GLenum} type
     * @return {int}
     */
    glSizeUnits: function(type){
        return this._glSizeUnits[type];
    },
  
   /** 
    * Returns the size of a WebGL type in bytes.
    * @param {GLenum} type
    * @return {int}
    */
    glSizeBytes: function(type){
        var units = this._glSizeUnits(type);
        type = this.glUnitType(type);
        return units*this._glSizeBytes[type];
    },
  
    /** 
     * Returns the unit GL type of the given GL type. For example, the unit type
     * of FLOAT_VEC3 would be FLOAT.
     * @param {GLenum} type
     * @return {GLenum}
     */
    glUnitType: function(type){
        return this._glUnitTypes[type];
    },
    
    
    
    // Namespace declarations
    app: {},
    concurrency: {},
    geom: {},
    image: {
        filter: {}
    },
    input: {},
    material: {},
    math: {},
    math2D: {}, // src/KraGL/math/2D
    math3D: {}, // src/KraGL/math/3D
    scene: {
        camera: {},
        light: {}
    },
    shader: {},
    state: {},
    util: {}
};





// Type meta-data declarations
KraGL._glTypeName = {};
KraGL._glTypeName[GL_BYTE]            = "BYTE";
KraGL._glTypeName[GL_UNSIGNED_BYTE]   = "UNSIGNED_BYTE";
KraGL._glTypeName[GL_SHORT]           = "SHORT";
KraGL._glTypeName[GL_UNSIGNED_SHORT]  = "UNSIGNED_SHORT";
KraGL._glTypeName[GL_INT]             = "INT";
KraGL._glTypeName[GL_UNSIGNED_INT]    = "UNSIGNED_INT";
KraGL._glTypeName[GL_FLOAT]           = "FLOAT";
KraGL._glTypeName[GL_FLOAT_VEC2]      = "FLOAT_VEC2";
KraGL._glTypeName[GL_FLOAT_VEC3]      = "FLOAT_VEC3";
KraGL._glTypeName[GL_FLOAT_VEC4]      = "FLOAT_VEC4";
KraGL._glTypeName[GL_INT_VEC2]        = "INT_VEC2";
KraGL._glTypeName[GL_INT_VEC3]        = "INT_VEC3";
KraGL._glTypeName[GL_INT_VEC4]        = "INT_VEC4";
KraGL._glTypeName[GL_BOOL]            = "BOOL";
KraGL._glTypeName[GL_BOOL_VEC2]       = "BOOL_VEC2";
KraGL._glTypeName[GL_BOOL_VEC3]       = "BOOL_VEC3";
KraGL._glTypeName[GL_BOOL_VEC4]       = "BOOL_VEC4";
KraGL._glTypeName[GL_FLOAT_MAT2]      = "FLOAT_MAT2";
KraGL._glTypeName[GL_FLOAT_MAT3]      = "FLOAT_MAT3";
KraGL._glTypeName[GL_FLOAT_MAT4]      = "FLOAT_MAT4";
KraGL._glTypeName[GL_SAMPLER_2D]      = "SAMPLER_2D";
KraGL._glTypeName[GL_SAMPLER_CUBE]    = "SAMPLER_CUBE";


KraGL._glSizeUnits = {};
KraGL._glSizeUnits[GL_BYTE]           = 1; 
KraGL._glSizeUnits[GL_UNSIGNED_BYTE]  = 1; 
KraGL._glSizeUnits[GL_SHORT]          = 1; 
KraGL._glSizeUnits[GL_UNSIGNED_SHORT] = 1;
KraGL._glSizeUnits[GL_INT]            = 1; 
KraGL._glSizeUnits[GL_UNSIGNED_INT]   = 1; 
KraGL._glSizeUnits[GL_FLOAT]          = 1; 
KraGL._glSizeUnits[GL_FLOAT_VEC2]     = 2; 
KraGL._glSizeUnits[GL_FLOAT_VEC3]     = 3; 
KraGL._glSizeUnits[GL_FLOAT_VEC4]     = 4; 
KraGL._glSizeUnits[GL_INT_VEC2]       = 2;
KraGL._glSizeUnits[GL_INT_VEC3]       = 3; 
KraGL._glSizeUnits[GL_INT_VEC4]       = 4; 
KraGL._glSizeUnits[GL_BOOL]           = 1; 
KraGL._glSizeUnits[GL_BOOL_VEC2]      = 2; 
KraGL._glSizeUnits[GL_BOOL_VEC3]      = 3; 
KraGL._glSizeUnits[GL_BOOL_VEC4]      = 4;
KraGL._glSizeUnits[GL_FLOAT_MAT2]     = 4; 
KraGL._glSizeUnits[GL_FLOAT_MAT3]     = 9;
KraGL._glSizeUnits[GL_FLOAT_MAT4]     = 16; 


KraGL._glSizeBytes = {};
KraGL._glSizeBytes[GL_BYTE]           = 1;
KraGL._glSizeBytes[GL_UNSIGNED_BYTE]  = 1;
KraGL._glSizeBytes[GL_SHORT]          = 2;
KraGL._glSizeBytes[GL_UNSIGNED_SHORT] = 2;
KraGL._glSizeBytes[GL_INT]            = 4;
KraGL._glSizeBytes[GL_UNSIGNED_INT]   = 4;
KraGL._glSizeBytes[GL_FLOAT]          = 4;
KraGL._glSizeBytes[GL_BOOL]           = 4;


KraGL._glUnitTypes = {};
KraGL._glUnitTypes[GL_BYTE]           = GL_BYTE;
KraGL._glUnitTypes[GL_UNSIGNED_BYTE]  = GL_UNSIGNED_BYTE;
KraGL._glUnitTypes[GL_SHORT]          = GL_SHORT;
KraGL._glUnitTypes[GL_UNSIGNED_SHORT] = GL_UNSIGNED_SHORT;
KraGL._glUnitTypes[GL_INT]            = GL_INT;
KraGL._glUnitTypes[GL_UNSIGNED_INT]   = GL_UNSIGNED_INT;
KraGL._glUnitTypes[GL_FLOAT]          = GL_FLOAT;
KraGL._glUnitTypes[GL_FLOAT_VEC2]     = GL_FLOAT;
KraGL._glUnitTypes[GL_FLOAT_VEC3]     = GL_FLOAT;
KraGL._glUnitTypes[GL_FLOAT_VEC4]     = GL_FLOAT;
KraGL._glUnitTypes[GL_INT_VEC2]       = GL_INT;
KraGL._glUnitTypes[GL_INT_VEC3]       = GL_INT;
KraGL._glUnitTypes[GL_INT_VEC4]       = GL_INT;
KraGL._glUnitTypes[GL_BOOL]           = GL_BOOL;
KraGL._glUnitTypes[GL_BOOL_VEC2]      = GL_BOOL;
KraGL._glUnitTypes[GL_BOOL_VEC3]      = GL_BOOL;
KraGL._glUnitTypes[GL_BOOL_VEC4]      = GL_BOOL;
KraGL._glUnitTypes[GL_FLOAT_MAT2]     = GL_FLOAT;
KraGL._glUnitTypes[GL_FLOAT_MAT3]     = GL_FLOAT;
KraGL._glUnitTypes[GL_FLOAT_MAT4]     = GL_FLOAT;

