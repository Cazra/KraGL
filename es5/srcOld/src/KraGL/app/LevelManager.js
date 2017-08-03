/**
 * The LevelManager is used to set the currently loaded Level for the 
 * application. It also runs the level's logic and rendering.
 */
KraGL.app.LevelManager = function(app) {
    this._app = app;
    
    this._curLevel = undefined;
    this._newLevel = undefined;
    this._levels = {};
};

KraGL.extend(KraGL.app.LevelManager, KraGL.Base, {
    
    /**
     * Returns the currently loaded level.
     * @return {KraGL.app.Level}
     */
    getLevel: function() {
        return this._curLevel;
    },
    
    /**
     * Initializes resources for the current level. Do not call this
     * manually!
     * @param {KraGL.Context} ctx  The application's GL context.
     */
    initResources: function(ctx) {
        if(this._curLevel)
            this._curLevel.initResources(ctx);
    },
    
    
    /**
     * Getter/storer for levels in the manager's cache of levels.
     * @param {String} id   The ID for the level we're getting/storing.
     * @param {KraGL.app.Level} [level]   Provided if we are storing a level.
     * @return {KraGL.app.Level} The level.
     */
    levels: function(id, level) {
        if(level) {
            if(this._levels[id]) {
                var oldLevel = this._levels[id];
                KraGL.Log.warning("Overwrote level with ID " + id + ". ", 
                    {oldLevel: oldLevel, newLevel: level}
                );
            }
            this._levels[id] = level;
        }
        return this._levels[id];
    },
    
    
    /**
     * Stages a new level to be loaded at the beginning of the next frame.
     * @param {KraGL.app.Level} The new level.
     */
    setLevel: function(level) {
        this._newLevel = level
    },
    
    
    /**
     * Runs and renderes the currently loaded level. If a new level is staged 
     * to be loaded, then first the previous level's resources are cleaned, 
     * the new level's resources are initialized, and the new level is loaded.
     * @param {KraGL.Context} ctx  The application's GL context.
     */
    runLevel: function(ctx) {
        if(this._newLevel) {
            if(this._curLevel)
                this._curLevel.clean(ctx);
            
            this._curLevel = this._newLevel;
            this._newLevel = undefined;
            
            this.initResources(ctx);
        }
        
        this._curLevel.run();
        this._curLevel.render(ctx);
    }
    
});