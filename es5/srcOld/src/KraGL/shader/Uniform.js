/**
 * A uniform variable for a ShaderProgram. Don't instantiate this class 
 * directly. When a ShaderProgram is created, it will create its own list
 * of Attributes and Uniforms. 
 */
KraGL.shader.Uniform = function(gl, program, info) {
    KraGL.shader.ShaderVar.call(this, program, info);
    
    this._gl = gl;
    this._location = this._gl.getUniformLocation(program, this.getName());
};

KraGL.extend(KraGL.shader.Uniform, KraGL.shader.ShaderVar, {
    
    /**
     * Returns the current value of the Uniform.
     * @return {any}
     */
    get: function() {
        return this._gl.getUniform(this.getProgram(), this.getLocation());
    },
    
    
    /**
     * Returns the location of this Uniform within its ShaderProgram.
     * @return {WebGLUniformLocation}
     */
    getLocation: function() {
        return this._location;
    },
    
    /**
     * Sets the value of the Uniform.
     * @param {any} value
     */
    set: function(value) {
        var setter = KraGL.shader.Uniform.setters[this.getType()];
        setter.call(this, this._gl, value);
    }
});

// Below is a mapping of GL types to static functions used to set them in
// Uniforms.
KraGL.shader.Uniform.setters = [];

KraGL.shader.Uniform.setters[GL_FLOAT] = function(gl, values) { 
    gl.uniform1fv(this._location, values); 
};

KraGL.shader.Uniform.setters[GL_FLOAT_VEC2] = function(gl, values) { 
    gl.uniform2fv(this._location, values); 
};

KraGL.shader.Uniform.setters[GL_FLOAT_VEC3] = function(gl, values) { 
    gl.uniform3fv(this._location, values); 
};

KraGL.shader.Uniform.setters[GL_FLOAT_VEC4] = function(gl, values) { 
    gl.uniform4fv(this._location, values); 
};

KraGL.shader.Uniform.setters[GL_INT] = function(gl, values) { 
    gl.uniform1iv(this._location, values); 
};

KraGL.shader.Uniform.setters[GL_INT_VEC2] = function(gl, values) { 
    gl.uniform2iv(this._location, values); 
};

KraGL.shader.Uniform.setters[GL_INT_VEC3] = function(gl, values) { 
    gl.uniform3iv(this._location, values); 
};

KraGL.shader.Uniform.setters[GL_INT_VEC4] = function(gl, values) { 
    gl.uniform4iv(this._location, values); 
};

KraGL.shader.Uniform.setters[GL_BOOL] = function(gl, values) { 
    gl.uniform1iv(this._location, values); 
};

KraGL.shader.Uniform.setters[GL_BOOL_VEC2] = function(gl, values) { 
    gl.uniform2iv(this._location, values); 
};
KraGL.shader.Uniform.setters[GL_BOOL_VEC3] = function(gl, values) { 
    gl.uniform3iv(this._location, values); 
};

KraGL.shader.Uniform.setters[GL_BOOL_VEC4] = function(gl, values) { 
    gl.uniform4iv(this._location, values); 
};

KraGL.shader.Uniform.setters[GL_FLOAT_MAT2] = function(gl, values) { 
    gl.uniformMatrix2fv(this._location, false, values); 
};

KraGL.shader.Uniform.setters[GL_FLOAT_MAT3] = function(gl, values) { 
    gl.uniformMatrix3fv(this._location, false, values); 
};

KraGL.shader.Uniform.setters[GL_FLOAT_MAT4] = function(gl, values) { 
    gl.uniformMatrix4fv(this._location, false, values); 
};

KraGL.shader.Uniform.setters[GL_SAMPLER_2D] = function(gl, values) { 
    gl.uniform1iv(this._location, values); 
};

KraGL.shader.Uniform.setters[GL_SAMPLER_CUBE] = function(gl, values) {
    gl.uniform1iv(this._location, values);
};
