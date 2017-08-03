/**
 * An encapsulation of a GLSL shader program loaded into the GL context.
 *
 * @param {KraGL.Context} ctx
 *
 * @param {Object} config
 *
 * @cfg {function} [callback]
 * The callback function invoked when the ShaderProgram finishes loading,
 * regardless of success or failure.
 *      -param {KraGL.ShaderProgram}    this
 *      -param {boolean}                success 
 *
 * @cfg {String|String[]} fragUrls
 * The URL(s) of the source code file(s) for the ShaderProgram's fragment shaders.
 * 
 * @cfg {String|String[]} vertUrls
 * The URL(s) of the source code file(s) for the ShaderProgram's vertex shaders.
 */
KraGL.ShaderProgram = function(ctx, config) {
    var vertUrls = ctx.vertUrls;
    if(!_.isArray(vertUrls))
        vertUrls = [vertUrls];
    
    var fragUrls = ctx.fragUrls;
    if(!_.isArray(fragUrls))
        fragUrls = [fragUrls];
    
    var callback = config.callback || _.noop;
    
    this._gl = ctx.getGL();
    
    this._isCompiled = false;
    
    var ajaxFailed = false;
    var verts = [];
    var frags = [];
    
    // Once we have fetched all the source files, compile them into the 
    // ShaderProgram.
    // Invoke the user's callback when we're done.
    var semaphore = new KraGL.Asem({
        callback: function() {
            if(ajaxFailed)
                callback.call(config.scope, this, false);
            
            var success = this._compile(verts, frags);
            callback.call(config.scope, this, success);
        },
        lock: 1,
        scope: this
    });
    
    // Fetch the vertex shader source files.
    _.each(vertUrls, function(url) {
        semaphore.wait();
        KraGL.Ajax.request({
            url: url,
            success: function(response) {
                verts[url] = response;
                semaphore.signal();
            },
            failure: function(statusCode, response) {
                KraGL.Log.error(statusCode, response);
                ajaxFailed = true;
                semaphore.signal();
            }
        });
    }, this);
    
    // Fetch the fragment shader source files.
    _.each(fragUrls, function(url) {
        semaphore.wait();
        KraGL.Ajax.request({
            url: url,
            success: function(response) {
                frags[url] = response;
                semaphore.signal();
            },
            failure: function(statusCode, response) {
                KraGL.Log.error(statusCode, response);
                ajaxFailed = true;
                semaphore.signal();
            }
        });
    }, this);
    
    semaphore.signal();
};

KraGL.extend(KraGL.ShaderProgram, KraGL.Base, {
    
    /**
     * @private
     * Initializes the metadata about the ShaderProgram's uniforms and attributes.
     */
    _analyzeVariables: function() {
        this._uniforms = this._analyzeUniforms();
        this._attributes = this._analyzeAttributes();
        
        var info = this.toString();
        KragL.info('ShaderProgram ' + this._program, info);
    },
    
    /**
     * @private
     * Generates the dictionary of this program's Uniforms.
     * @return {Object} name -> Uniform map.
     */
    _analyzeUniforms: function() {
        var gl = this._gl;
        var count = gl.getProgramParameter(this._program, GL_ACTIVE_UNIFORMS);
        
        var result = {};
        for(var i=0; i<count; i++) {
            var info = gl.getActiveUniform(this._program, i);
            var uniform = new KraGL.shader.Uniform(gl, this._program, info);
            
            result[info.name] = uniform;
        }
        return result;
    },
    
    /**
     * @private
     * Generates the dictionary of this program's Attributes.
     * @return {Object} name -> Attribute map.
     */
    _analyzeAttributes: function() {
        var gl = this._gl;
        var count = gl.getProgramParameter(this._program, GL_ACTIVE_ATTRIBUTES);
        
        var result = {};
        for(var i=0; i < count; i++) {
            var info = gl.getActiveAttrib(this._program, i);
            var attribute = new KraGL.shader.Attribute(gl, this._program, info);
            
            result[info.name] = attribute;
        }
        
        return msg;
    },
    
    /**
     * @private
     * Compiles the ShaderProgram from the vertex and fragment shader sources.
     * @param {map: String -> String} verts   
     *      A map of vertex shader URLs to their source code contents.
     * @param {map: String -> String} frags   
     *      A map of fragment shader URLs to their source code contents.
     * @return {boolean}    True iff the ShaderProgram was compiled successfully.
     */
    _compile: function(verts, frags) {
        var gl = this._gl;
        var shaders = [];
        
        // Compile the vertex shaders.
        _.each(verts, function(src, url) {
            var shader = this._compileShader(GL_VERTEX_SHADER, src, url);
            shaders.push(shader);
        }, this);
        
        // Compile the fragment shaders.
        _.each(frags, function(src, url) {
            var shader = this._compileShader(GL_FRAGMENT_SHADER, src, url);
            shaders.push(shader);
        }, this);
        
        this._program = this._compileProgram(shaders);
        this._analyzeVariables();
        
        return this.isCompiled();
    },
    
    /**
     * @private
     * Compiles a shader object from its source code.
     * @param {GLenum} type     GL_VERTEX_SHADER or GL_FRAGMENT_SHADER.
     * @param {String} src      The shader source code.
     * @param {String} url      The url of the source code file.
     * @return {WebGLShader}
     */
    _compileShader: function(type, src, url) {
        var gl = this._gl;
        var shader = gl.createShader(type);
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        
        if(!gl.getShaderParameter(shader, GL_COMPILE_STATUS)) {
            var msg = gl.getShaderInfoLog(shader);
            var typeStr;
            if(type == GL_VERTEX_SHADER)
                typeStr = 'vertex';
            if(type == GL_FRAGMENT_SHADER)
                typeStr = 'fragment';
            
            KraGL.Log.error('Failed to compile ' + typeStr + ' shader: ' + url + 
                            '\n' + msg);
        }
        
        return shader;
    },
    
    /**
     * @private
     * Links and validates the ShaderProgram from its compiled shaders.
     * @param {WebGLShader[]} shaders
     * @return {WebGLProgram} The program or null if it failed to compile.
     */
    _compileProgram: function(shaders) {
        var gl = this._gl;
        var program = gl.createProgram();
        var success = true;
        
        // Attach the shaders to the program.
        _.each(shaders, function(shader) {
            gl.attachShader(program, shader);
        });
        
        // Link the program.
        gl.linkProgram(program);
        if(!gl.getProgramParameter(program, GL_LINK_STATUS)) {
            var msg = gl.getProgramInfoLog(program);
            KraGL.Log.error('Failed to link ShaderProgram:\n' + msg);
            success = false;
        }
        
        // Validate the program.
        gl.validateProgram(program);
        if(!gl.getProgramParameter(program, GL_VALIDATE_STATUS)) {
            var msg = gl.getProgramInfoLog(program);
            KraGL.Log.error('Failed to validate ShaderProgram:\n' + msg);
            success = false;
        }
        
        // Since the shaders' object code is now linked into the program, we can
        // safely detach and delete the shader objects.
        _.each(shaders, function(shader) {
            gl.detachShader(program, shader);
            gl.deleteShader(shader);
        });
        
        // Delete the program if it didn't link and validate successfully.
        if(success)
            return program;
        else {
            gl.deleteProgram(program);
            return null;
        }
    },
    
    /**
     * Returns the count of Attributes in this program.
     * @return {int}
     */
    getAttributeCount: function() {
        if(this._attributeCount === undefined)
            this._attributeCount = this._gl.getProgramParameter(this._program, GL_ACTIVE_ATTRIBUTES);
        
        return this._attributeCount;
    },
    
    /**
     * Returns the WebGL object for this ShaderProgram.
     * @return {WebGLProgram}
     */
    getGLProgram: function() {
        return this._program;
    },
    
    /**
     * Returns the count of Uniforms in this program.
     * @return {int}
     */
    getUniformCount: function() {
        if(this._uniformCount === undefined)
            this._uniformCount = this._gl.getProgramParameter(this._program, GL_ACTIVE_UNIFORMS);
        
        return this._uniformCount;
    },
    
    
    /**
     * Returns whether the ShaderProgram has been successfully compiled, 
     * linked, and validated.
     * @return {boolean}
     */
    isCompiled: function() {
        return !!this.getGLProgram();
    },
    
    /**
     * Produces a String with information about this ShaderProgram.
     * @return {String}
     */
    toString: function() {
        // TODO
    }
});