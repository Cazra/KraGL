/**
 * An asynchronous semaphore, used to coordinate a callback between
 * several possibly concurrent processes.
 * @see http://en.wikipedia.org/wiki/Asynchronous_semaphore
 * 
 * @cfg {int} [lock]
 *      The initial lock value of the semaphore.
 *      Default 0.
 * 
 * @cfg {function} [callback]
 *      The callback function invoked when the semaphore's lock becomes 0.
 *      Default _.noop.
 * 
 * @cfg {Object} [scope]
 *      The scope of the callback.
 *      Default undefined.
 */
KraGL.concurrency.Asem = function(config) {
    this._lock = config.lock || 0;
    this._callback = config.callback || _.noop;
    this._scope = config.scope;
    
    this._debugTrack();
};

KraGL.extend(KraGL.concurrency.Asem, KraGL.Base, {
    
    /**
     * Prints a debug log about the Asem.
     * @param {String} msg  A message.
     */
    _debugMsg: function(msg) {
        if(KraGL.concurrency.Asem.debug) {
            var stack;
            try {
                throw new Error();
            }
            catch(err) {
                stack = err.stack;
            }
            
            KraGL.Log.debug(msg, {
                asem: this,
                stack: stack
            });
        }
    },
    
    _debugTrack: function() {
        if(KraGL.concurrency.Asem.debug) {
            KraGL.concurrency.Asem.activeAsems.push(this);
        }
    },
    
    _debugUntrack: function() {
        if(KraGL.concurrency.Asem.debug) {
            _.without(KraGL.concurrency.Asem.activeAsems, this);
        }
    },
    
    /**
     * Decrements the semaphore's lock. If it reaches 0, its callback is 
     * invoked.
     */
    signal: function() {
        this._lock--;
        
        this._debugMsg('Asem signalled ' + this._lock);
        
        if(this._lock == 0) {
            this._callback.call(this._scope);
            this._debugMsg('Asem fired!');
            this._debugUntrack();
        }
        else if(this._lock < 0) {
            KraGL.Log.error('Asem signalled below 0.', this);
        }
    },
    
    /**
     * Produces a callback function that signals this semaphore.
     * @return {function}
     */
    toCallback: function() {
        var self = this;
        return function() {
            self.signal();
        };
    },
    
    /**
     * Increments the semaphore's lock.
     */
    wait: function() {
        this._lock++;
        
        this._debugMsg('Asem waiting ' + this._lock);
    },
    
    statics: {
        /**
         * A list of Asems that haven't fired yet (for debug mode).
         */
        activeAsems: [],
        
        /**
         * Flag for debug mode. If true, Asems will print debugging messages.
         */
        debug: false
    }
    
});