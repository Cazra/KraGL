/**
 * @abstract
 * Base class for ShaderProgram Attributes and Uniforms.
 * @param {WebGLProgram} program
 * @param {WebGLActiveInfo} info
 */
KraGL.shader.ShaderVar = function(program, info) {
    this._program = program;
    this._name = info.name;
    this._size = info.size;
    this._type = info.type;
    
    
    this._sizeBytes = info.size*KraGL.glSizeBytes(info.type);
    this._sizeUnits = KraGL.glSizeUnits(info.type);
};

KraGL.extend(KraGL.shader.ShaderVar, KraGL.Base, {
    
    /**
     * Returns the name of the variable.
     * @return {String}
     */
    getName: function() {
        return this._name;
    },
    
    /**
     * Returns the number of elements in this variable. For arrays, this is the
     * capacity of the array. For non-array variables (including vec types), 
     * this is 1.
     * @return {int}
     */
    getLength: function() {
        return this._size;
    },
    
    /**
     * Returns the program this variable is part of.
     * @return {WebGLProgram}
     */
    getProgram: function() {
        return this._program;
    },
    
    /**
     * Returns the size of the variable in bytes.
     * @return {int}
     */
    getSizeBytes: function() {
        return this._sizeBytes;
    },
    
    /**
     * Returns the size of the variable in unit types.
     * @return {int}
     */
    getSizeUnits: function() {
        return this._sizeUnits;
    },
    
    /**
     * Returns this variable's GL type.
     * @return {GLenum}
     */
    getType: function() {
        return this._type;
    },
    
    /**
     * Returns the unit type for this variable. E.G., GL_FLOAT_VEC3 -> GL_FLOAT
     * @return {GLenum}
     */
    getUnitType: function() {
        return KraGL.glUnitType(this._type);
    },
    
    /**
     * Returns whether this is an array variable.
     * @return {boolean}
     */
    isArray: function() {
        return (this._size > 1);
    },
    
    /**
     * Returns whether this is a built-in GL shader variable.
     * Built-in variables start with 'gl_'.
     * @return {boolean}
     */
    isBuiltIn: function() {
        return (this._name.substring(0,3) == 'gl_');
    }
});
