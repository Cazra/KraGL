/**
 * An attribute variable for a ShaderProgram. Don't instantiate this class 
 * directly. When a ShaderProgram is created, it will create its own list
 * of Attributes and Uniforms. 
 */
KraGL.shader.Attribute = function(gl, program, info) {
    KraGL.shader.ShaderVar.call(this, program, info);
    
    this._gl = gl;
    this._location = this._gl.getAttribLocation(program, info.name);
};


KraGL.extend(KraGL.shader.Attribute, KraGL.shader.ShaderVar, {
    
    /**
     * Binds the attribute to the currently bound vertex buffer.
     * @param {int} stride      The bytes between successive vertices in the buffer.
     * @param {int} offset      The offset of this attribute from the start of 
     *                          a vertex in the buffer.
     */
    bind: function(stride, offset) {
        this._gl.vertexAttribPointer(this._location, this.getSizeUnits(), this.getUnitType(), false, stride, offset);
    },
    
    /**
     * Returns the unit size of elements of this attribute in the vertex 
     * attribute array.
     * TODO: Is this the same as getSizeUnits?
     * @return {int}
     */
    getArraySize: function() {
        return this._gl.getVertexAttrib(this._location, GL_VERTEX_ATTRIB_ARRAY_SIZE);
    },
    
    /**
     * Returns the base GL type for the array. 
     * TODO: Same as getUnitType?
     * @return {GLenum}
     */
    getArrayType: function() {
        return this._gl.getVertexAttrib(this._location, GL_VERTEX_ARRAY_TYPE);
    },
    
    /**
     * Returns the buffer this attribute is currently bound to.
     * @return {WebGLBuffer}
     */
    getBufferBinding: function() {
        return this._gl.getVertexAttrib(this._location, GL_VERTEX_ATTRIB_ARRAY_BUFFER_BINDING);
    },
    
    /**
     * Returns the location of this variable in its linked ShaderProgram.
     * @return {int}
     */
    getLocation: function() {
        return this._location;
    },
    
    /**
     * Returns the array stride for this attribute (the number of bytes between
     * successive elements). 
     * @return {int}
     */
    getStride: function() {
        return this._gl.getVertexAttrib(this._location, GL_ATTRIB_ARRAY_STRIDE);
    },
    
    
    /**
     * Returns the current value of the attribute as a vec4.
     * Since attribute values vary from vertex to vertex in GL memory, 
     * usefulness of this information cannot be guaranteed to be consistent.
     * @return {vec4} 
     */
    getValue: function() {
        return this.getVertexAttrib(this._location, GL_CURRENT_VERTEX_ATTRIB);
    },
    
    
    /**
     * Returns whether this attribute is currently enabled.
     * @return {boolean}
     */
    isEnabled: function() {
        return this._gl.getVertexAttrib(this._location, GL_ATTRIB_ARRAY_ENABLED);
    },
    
    /**
     * Returns whether this attribute becomes normalized when converted to
     * floating point values.
     * @return {boolean}
     */
    isNormalized: function() {
        return this._gl.getVertexAttrib(this._location, GL_ATTRIB_ARRAY_NORMALIZED);
    },
    
    
    /**
     * Gets the Attribute's values for a particular Vertex.
     * An error is thrown if size of the data read doesn't match the size of 
     * the attribute.
     * @param {KraGL.geom.Vertex}
     * @return {number[]}
     */
    readVertex: function(vertex) {
        var result = this._accessor.call(vertex);
        
        if(result.length != this.getSizeUnits())
            throw new Error("Attribute " + this.getName() + ": vertex data is wrong size: " + result.length + ". Expected: " + this.getSizeUnits());
        
        return result;
    },
    
    
    /**
     * Sets the function used to access the vertex data for this attribute.
     * @param {function} func       e.g. Vertex.xyz(), Vertex.normal(), etc.
     */
    setAccessor: function(func) {
        this._accessor = func;
    }
});