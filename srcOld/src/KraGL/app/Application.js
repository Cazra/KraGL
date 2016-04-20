/**
 * The base class for all KraGL applications.
 * 
 * @required
 * @config {DivElement} container 
 * The div element containing the application.
 *
 * @config {WebGLContextAttributes} contextAttrs
 * The attributes used to create the GL context.
 */
KraGL.Application = function(config) {
    this._container = config.container;
    
    try {
        var canvas = this.getCanvas();
        this._context = new KraGL.Context({
            canvas: canvas,
            config: contextAttrs
        });
        
        this._initInput();
        this._initEvents();
    }
    catch(err) {
            
        // If there was a problem during initialization, 
        // Display the error in the div.
        this._container.innerHTML = 
            'Could not initialize KraGL application: ' + err.message;
        this._container.style.border = 'solid red 2px';
        this._container.style.padding = '16px';
    }
};

KraGL.extend(KraGL.Application, KraGL.Base, {
    
    _initInput: function() {
        this._keyboard = new KraGL.input.Keyboard(this._container);
        this._mouse = new KraGL.input.Mouse(this._container);
        this._picker = new KraGL.input.Picker(this._context);
            
    },
    
    _initEvents: function() {
        var self = this;
        
        // Fail safely if a context lost event occurs.
        this._canvas.addEventListener('webglcontextlost', 
            this._handleWebglcontextlostEvent.bind(this));
        
        this._canvas.addEventListener('webglcontextrestored', 
            this._handleWebglcontextrestoredEvent.bind(this));
    },
    
    
    ////// General methods
    
    /**
     * Returns the canvas for the application, creating it the first time
     * this is called.
     */
    getCanvas: function() {
        if(!this._canvas) {
            this._canvas = document.createElement('canvas');
            this._container.appendChild(this._canvas);
            
            var size = this.getSize();
            
            this._canvas.width = size.getWidth();
            this._canvas.height = size.getHeight();
        }
        return this._canvas;
    },
    
    /**
     * Returns the Div element containing the application.
     * @return {DivElement}
     */
    getContainer: function() {
        return this._container;
    },
    
    /**
     * Returns the application's KraGL Context.
     * @return {KraGL.Context}
     */
    getContext: function() {
        return this._context;
    },
    
    /**
     * Returns the application's LevelManager, used to change levels and to run
     * and render the current level.
     * @return {KraGL.app.LevelManager}
     */
    getLevelManager: function() {
        // TODO
    },
    
    
    /**
     * Handler for canvas webglcontextlost events.
     * Prevent WebGL from crashing and cancel the application's animation until
     * the context is restored.
     * @param {Event} event
     * @return {boolean} False iff any of the handlers return false.
     * @fires contextlost
     */
    _handleWebglcontextlostEvent: function(event) {
        event.preventDefault();
            
        this.stop();
        return this.fireEvent('contextlost', this);
    },
    
    /**
     * Handler for canvas webglcontextrestored events.
     * Re-initializes the context and continues running the application.
     * @param {Event} event
     * @return {boolean} False iff any of the handlers return false.
     * @fires contextrestored
     */
    _handleWebglcontextrestoredEvent: function(event) {
        this.initResources();
        this.run();
        
        return this.fireEvent('contextrestored', this);
    },
    
    /**
     * Loads the resources for the Application and the current Level.
     */
    initResources: function() {
        var gl = this.getContext();
        gl.reset();
        
        this.initShaders(gl);
        this.initMaterials(gl);
        this.initGeometry(gl);
        
        // TODO: Load resources of current level.
        this.getLevelManager().initResources(gl);
    },
    
    /**
     * Returns whether the application's main animation loop is running.
     * @return true.
     */
    isRunning: function() {
        return this._isRunning;
    },
    
    /**
     * Resets the application.
     */
    reset: function() {
        this.initResources();
        
        var firstLevel = this.getFirstLevel();
        this.getLevelManager().setLevel(firstLevel);
    },
    
    /**
     * Starts or resumes running the game's animation loop.
     * @param {DOMHighResTimeStamp} [timestamp] The timestamp for the current,
     *                              frame, passed in by requestAnimationFrame.
     */
    run: function(timestamp) {
        this._isRunning = true;
        
        this._updateFps(timestamp);
        
        // Reset the scene graph for this frame and poll for input.
        this.getContext().resetSceneGraph();
        this.getKeyboard().poll();
        this.getMouse().poll();
        // TODO this.getPicker().poll();
        
        this.getLevelManager().runLevel();
        
        // Schedule the next animation frame.
        this._nextAnimFrame = requestAnimationFrame(this.run.bind(this));
    },
    
    /**
     * Updates the frame rate counter.
     */
    _updateFps: function(timestamp) {
        if(!timestamp) {
            timestamp = 0;
            this._lastTimestamp = 0;
            this._lastFpsTimestamp = 0;
            this._fpsCount = 0;
        }
        
        if(timestamp - this._lastFpsTimestamp > 1000) {
            console.log('running. FPS: ' + this._fpsCount);
            this._lastFpsTimestamp = timestamp;
            this._fpsCount = 0;
        }
    },
    
    /**
     * Initializes the application and starts its animation loop.
     */
    start: function() {
        this.reset();
        this.run();
    },
    
    /**
     * Hard-pauses the application. The game's animation loop will stop running
     * until run() is invoked again.
     */
    stop: function() {
        cancelAnimationFrame(this._nextAnimFrame);
        this._isRunning = false;
    },
    
    
    ////// Input
    
    /**
     * Returns the application's Keyboard.
     * @return {KraGL.input.Keyboard}
     */
    getKeyboard: function() {
        return this._keyboard;
    },
    
    /**
     * Returns the application's Mouse.
     * @return {KraGL.input.Mouse}
     */
    getMouse: function() {
        return this._mouse;
    },
    
    /**
     * Returns the application's Picker.
     * @return {KraGL.input.Picker}
     */
    getPicker: function() {
        return this._picker;
    },
    
    
    ////// Metrics
    
    /**
     * Returns the container's aspect ratio.
     * @return {number}
     */
    getAspectRatio: function() {
        return this.getWidth()/this.getHeight();
    },
    
    /**
     * Returns the container's height.
     * @return {number}
     */
    getHeight: function() {
        return this._container.offsetHeight;
    },
    
    /**
     * Returns the container's dimensions.
     * @return {number[]}   An array containing the container's width and height,
     *                      in that order.
     */
    getSize: function() {
        var w = this.getWidth();
        var h = this.getHeight();
        return [w, h];
    },
    
    /**
     * Returns the container's width.
     * @return {number}
     */
    getWidth: function() {
        return this._container.offsetWidth;
    },
    
    /**
     * Resizes the container. The canvas and its GL viewport are also resized 
     * to fit.
     * @param {number[]} dims   The width, height array specifying the new
     *                          dimensions.
     * @return {boolean} False iff any handlers return false.
     * @fire resize
     */
    resize: function(dims) {
        var w = dims[0];
        var h = dims[1];
        var oldDims = this.getSize();
        
        var canvas = this.getCanvas();
        var container = this.getContainer();
        var viewport = this.getContext().viewport();
        
        canvas.width = w;
        canvas.height = h;
        
        container.style.width = w;
        container.style.height = h;
        
        viewport.size(dims);
        
        return this.fireEvent('resize', this, dims, oldDims);
    },
    
    
    ////// Abstract methods
    
    /**
     * @abstract
     * Returns a new instance of the application's first Level.
     * @return {KraGL.app.Level}
     */ 
    getFirstLevel: function(gl) {},
    
    /**
     * @abstract
     * Initializes the application's shaders by loading them into the
     * ShaderLibrary.
     * @param {KraGL.Context} gl
     */
    initShaders: function(gl) {},
    
    /**
     * @abstract
     * Initializes the application's materials.
     * @param {KraGL.Context} gl
     */
    initMaterials: function(gl) {},
    
    /**
     * @abstract
     * Initializes the application's geometries.
     * @param {KraGL.Context} gl
     */
    initGeometries: function(gl) {}
});
