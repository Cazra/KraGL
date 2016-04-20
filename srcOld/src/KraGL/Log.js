/**
 * @singleton
 * An API for logging information such as debug messages, warnings, and errors.
 */
KraGL.Log = {
    
    SILENT: 0,
    ERROR: 1,
    WARN: 2,
    INFO: 3,
    DEBUG: 4,
    
    /**
     * Sets/gets the current verbosity level of the Log.
     * @param {KraGL.Log.enum} [level]
     * @return {KraGL.Log.enum}
     */
    verbosity: function(level) {
        if(level !== undefined) 
            this._level = level;
        
        return this._level;
    },
    
    /**
     * Prints an ERROR log to the console.
     * @param {any[]} args      Anything you want to print in the log.
     */
    error: function(args) {
        if(this.verbosity() >= this.ERROR)
            this._log('ERROR', args);
    },
    
    /**
     * Prints a WARN log to the console.
     * @param {any[]} args      Anything you want to print in the log.
     */
    warn: function(args) {
        if(this._level >= this.WARN)
            this._log('WARN', args);
    },
    
    /**
     * Prints an INFO log to the console.
     * @param {any[]} args      Anything you want to print in the log.
     */
    info: function(args) {
        if(this._level >= this.INFO)
            this._log('INFO', args);
    },
    
    /**
     * Prints a DEBUG log to the console.
     * @param {any[]} args      Anything you want to print in the log.
     */
    debug: function(args) {
        if(this._level >= this.DEBUG)
            this._log('DEBUG', args);
    },
    
    /**
     * @private
     * Prints a log to the console.
     * @param {String} prefix
     * @param {any[]} args
     */
    _log: function(prefix, args) {
        var contents = ['[' + prefix + ']'].concat(args);
        console.log(contents);
    }
};

KraGL.Log.verbosity(KraGL.Log.DEBUG);
