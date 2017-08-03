/**
 * The KraGL wrapper object for the WebGLRenderingContext.
 * 
 * @required
 * @config {CanvasElement} cavas 
 * The GL context's canvas.
 * 
 * @config {WebGLContextAttributes} contextAttrs 
 * The attributes used in the creation of the GL context.
 */
KraGL.Context = function(config) {
    this._contextAttrs = config.contextAttrs;
    this._initContext(config._canvas, config.contextAttrs);
};

KraGL.extend(KraGL.Context, KraGL.Base, {
    
    /**
     * Initializes the GL context wrapped by this KraGL instance.
     * @param {CanvasElement} canvas
     * @param {WebGLContextAttributes} contextAttrs
     */
    _initContext: function(canvas, contextAttrs) {
        var errorInfo = {
            msg: ''
        };
        this._registerContextCreationErrorHandler(canvas, errorInfo);
        
        var gl = this._createGlContext(canvas, contextAttrs);
        if(gl) {
            this._gl = gl;
            this.resetState();
        }
        else {
            throw new Error('The WebGL context could not be created: ' + errorInfo.msg);
        }
    },
    
    /**
     * Registers the event handler to capture any error message generated from
     * being unable to load the GL context.
     * @param {CanvasElement} canvas
     * @param {Object} errorInfo  The object used to capture the error message.
     */ 
    _registerContextCreationErrorHandler: function(canvas, errorInfo) {
        var onContextCreationError = function(e) {
            canvas.removeEventListener('webglcontextcreationerror', onContextCreationError, false);
            errorInfo.msg = e.statusMessage || 'Unknown';
        };
        canvas.addEventListener('webglcontextcreationerror', onContextCreationError, false);
    },
    
    /**
     * Obtains the WebGLRenderingContext from the canvas.
     * @param {CanvasElement} canvas
     * @param {WebGLContextAttributes} attrs
     * @return {WebGLRenderingContext}
     */
    _createGlContext: function(canvas, attrs) {
        return  canvas.getContext("webgl", attrs) || 
                canvas.getContext("experimental-webgl", attrs) || 
                canvas.getContext("webkit-3d", attrs) || 
                canvas.getContext("moz-webgl", attrs);
    },
    
    
    
    ////// General methods
    
    /**
     * Obtains the canvas associated with this context.
     * @return {CanvasElement}
     */
    getCanvas: function() {
        return this._gl.canvas;
    },
    
    /**
     * Obtains the div container for this context's canvas.
     * @return {DivElement}
     */
    getContainer: function() {
        return this._container;
    },
    
    /**
     * Obtains the GL context associated with this wrapper.
     * @return {WebGLRenderingContexT}
     */
    getGL: function() {
        return this._gl;
    },
    
    /**
     * Returns the attributes used to create the GL context.
     * @return {WebGLContextAttributes}
     */
    getWebGLContextAttributes: function() {
        return this._contextAttrs;
    },
    
    /**
     * Resets the GL state.
     */
    reset: function() {
        // TODO
    },
    
    
    ////// GL state accessors
    
    /**
     * Returns the GL blend state.
     * @return {KraGL.state.Blend}
     */
    blend: function() {
        return this._blend;
    },
    
    /**
     * Returns the GL color buffer state.
     * @return {KraGL.state.Color}
     */
    color: function() {
        return this._color;
    },
    
    /**
     * Returns the GL face-culling state.
     * @return {KraGL.state.Cull}
     */
    cull: function() {
        return this._cull;
    },
    
    /**
     * Returns the GL depth buffer state.
     * @return {KraGL.state.Depth}
     */
    depth: function() {
        return this._depth;
    },
    
    /**
     * Returns the state for the primitives drawing mode.
     * @return {KraGL.state.DrawMode}
     */
    drawMode: function() {
        return this._drawMode;
    },
    
    /**
     * Gets the API for geometries loaded into the GL context.
     * @return {KraGL.geom.GeometryLib}
     */
    geometries: function() {
        return this._geometries;
    },
    
    /**
     * Gets the API for textures and other kinds of materials used to color
     * the surfaces of geometries loaded into the GL context.
     * @return {KraGL.material.MaterialLib}
     */
    materials: function() {
        return this._materials;
    },
    
    /**
     * Returns the GL scissor state.
     * @return {KraGL.state.Scissor}
     */
    scissor: function() {
        return this._scissor;
    },
    
    /**
     * Gets API for shader programs loaded into the GL context.
     * @return {KraGL.shader.ShaderLib}
     */
    shaders: function() {
        return this._shaders;
    },
    
    /**
     * Returns the GL stencil buffer state.
     * @return {KraGL.state.Stencil}
     */
    stencil: function() {
        return this._stencil;
    },
    
    /**
     * Returns the GL viewport state.
     * @return {KraGL.state.Viewport}
     */
    viewport: function() {
        return this._viewport
    },
    
    
    ////// Version
    
    /**
     * Returns the name of renderer used for the WebGL implementation.
     * @return {String}
     */
    getGlRendererName: function() {
        return this._gl.getParameter(GL_RENDERER);
    },
    
    /**
     * Returns the GLSL version used in the WebGL implementation.
     * @return {String}
     */
    getGlslVersion: function() {
        return this._gl.getParameter(GL_SHADING_LANGUAGE_VERSION);
    },
    
    /**
     * Returns the name of the vendor responsible for the WebGL implementation.
     * @return {String}
     */
    getGlVendorName: function() {
        return this._gl.getParameter(GL_VENDOR);
    },
    
    /**
     * Returns the version of the WebGL implementation.
     * @return {String}
     */
    getGlVersion: function() {
        return this._gl.getParameter(GL_VERSION);
    }
});

