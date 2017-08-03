/**
 * The base class for all KraGL objects (Except singletons). 
 * It provides methods for event handling, type-checking, and some other handy
 * things.
 */
KraGL.Base = function() {
    this._eventHandlers = {};
};

KraGL.Base.prototype = {
    
    constructor: KraGL.Base,
    
    _classUid: _.uniqueId('class'),
    
    _parentClass: undefined,
    
    _isaClassUids: (function(){
        var myTypes = {};
        myTypes[this._classUid] = true;
        return myTypes;
    })(),
    
    
    /**
     * Adds an event handler.
     * @param {String} eventName    The name of the event.
     * @param {Function} handler    The handler function.
     * @param {Object} [scope]      The scope of the handler function.
     */
    addEventHandler: function(eventName, handler, scope) {
        this._eventHandlers[eventName].push({
            fn: handler,
            scope: scope
        });
    },
    
    
    /**
     * Used to invoke a parent method from a derived class.
     */
    callParent: function() {
        var caller = this.callParent.caller;
        var methodName = caller.$name;
        var parentMethod = this._parentClass[methodName];
        
        return parentMethod.apply(this, arguments);
    },
    
    
    /**
     * Fires some event to any handlers registered to receive the event.
     * @param {String} eventName    The name of the event.
     * @param {Object...} args       The arguments passed to the event's handlers.
     * @return {Boolean} False iff any of the handlers return false.
     */
    fireEvent: function(eventName, args) {
        args = _.drop(arguments, 1);
        
        var handlers = this._eventHandlers[eventName];
        if(!handlers)
            handlers = this._eventHandlers[eventName] = [];
        
        var result = true;
        
        _.each(handlers, function(handler) {
            if(!handler.fn.apply(handler.scope, args))
                result = false;
        }, this);
        
        return result;
    },
    
    
    /**
     * Returns this class's parent class.
     * @return {class}
     */
    getParentClass: function() {
        return this._parentClass;
    },
    
    
    /**
     * Checks if this object has any handlers for the specified event.
     * @param {String} eventName    The name of the event.
     * @return {boolean} True iff the event has at least one handler.
     */
    hasHandlers: function(eventName) {
        var handlers = this._eventHandlers[eventName];
        return (handlers && handlers.length > 0);
    },
    
    /**
     * Type-checks this instance for some KraGL class.
     * @param {Class} clazz    The name of the class we're type-checking.
     * @return {boolean} true iff this is an instance of the specified class or
     *          one of its derived classes.
     */
    isa: function(clazz) {
        if(this._isaClassUids[clazz.prototype._classUid])
            return true;
        else
            return false;
    },
    
    /**
     * Alias for addEventHandler, but also accepts multiple handlers in one object
     * argument. E.G.
        sprite.on({
            click: this.clickHandler,
            destroy: this.destroyHandler,
            mouseover, this.mouseOverHandler,
            scope: this
        });
     */
    on: function(eventName, handler, scope) {
        if(_isFunction(handler))
            this.addEventHandler(eventName, handler, scope);
        else {
            var scope = eventName;
            var handlers = _.omit(eventName, 'scope');
            
            _.each(handlers, function(handler, eventName) {
                this.addEventHandler(eventName, handler, scope);
            }, this);
        }
    },
    
    /**
     * Removes an event handler.
     * @param {String} eventName    The event's name.
     * @param {Function} handler    The handler function.
     * @param {Object} [scope]      The original scope of the handler (must match).
     */
    removeHandler: function(eventName, handler, scope) {
        var handlers = this._eventHandlers[eventName];
        
        var result = _.find(handlers, function(h) {
            return (h.fn === handler && h.scope === scope);
        });
        
        if(result)
            handlers.remove(result);
    },
    
    /**
     * Alias for removeHandler, but also accepts multiple handlers in one
     * object argument. E.G.
        sprite.un({
            click: this.clickHandler,
            destroy: this.destroyHandler,
            mouseover, this.mouseOverHandler,
            scope: this
        });
     */
    un: function(eventName, handler, scope) {
        if(_isFunction(handler))
            this.removeHandler(eventName, handler, scope);
        else {
            var scope = eventName;
            var handlers = _.omit(eventName, 'scope');
            
            _.each(handlers, function(handler, eventName) {
                this.removeHandler(eventName, handler, scope);
            }, this);
        }
    }
};