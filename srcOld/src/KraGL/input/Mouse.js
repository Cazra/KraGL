/** 
 * An object for capturing and polling mouse input.
 * This keeps track of mouse detection, mouse presses and releases for the 
 * left, middle, and right buttons, and vertical and horizontal mouse wheel 
 * scroll detection.
 * @constructor
 * @param {DivElement} container  The application's container.
 */
KraGL.input.Mouse = function(container) {
    this._container = container;

    this._initMouseState();

    container.addEventListener('mousemove', this._handleMouseMove.bind(this));
    container.addEventListener('contextmenu', this._handleContextMenu.bind(this));
    container.addEventListener('mousedown', this._handleMouseDown.bind(this));
    container.addEventListener('mouseup', this._handleMouseUp.bind(this));
    container.addEventListener('wheel', this._handleWheel.bind(this));
};


KraGL.extend(KraGL.input.Mouse, KraGL.Base, {
    
    _initMouseState: function() {
        this._xy = [0, 0];
        this._xyPage = [0, 0];
        this._mouseMovedSinceLast = false;
        this._mouseMoved = false;
        this._pressedSinceLast = {};
        this._releasedSinceLast = {};

        this._isPressed = {};
        this._justPressed = {};
        this._justReleased = {};

        this._clickCount = {};
        this._clickCount[MouseCode.LEFT] = 0;
        this._clickCount[MouseCode.MIDDLE] = 0;
        this._clickCount[MouseCode.MIDDLE] = 0;
        this._lastClickTime = {};
        this._lastClickTime[MouseCode.LEFT] = 0;
        this._lastClickTime[MouseCode.MIDDLE] = 0;
        this._lastClickTime[MouseCode.MIDDLE] = 0;
        this._multiClickTime = 400;

        this._wheelTicksXSinceLast = 0;
        this._wheelTicksYSinceLast = 0;
        this._wheelTicksZSinceLast = 0;
        this._wheelTicksX = 0;
        this._wheelTicksY = 0;
        this._wheelTicksZ = 0;
    },
    
    ////// General methods
    
    /**
     * Returns the container capturing the mouse events.
     */
    getContainer: function() {
        return this._container;
    },
    
    /**
     * Sets or gets the multi-click time in milliseconds. Consecutive clicks
     * must happen within this time frame to be considered multiple clicks.
     * E.G. double-click.
     * By default, the multi-click time is 400ms.
     * @param {int} [time]      Sets the multi-click time if provided.
     * @return {int}
     */
    multiClickTime: function(time) {
        if(time != undefined) {
            this._multiClickTime = time;
        }
        return this._multiClickTime;
    },
    
    /**
     * Polls for the current mouse state since the last time this was called.
     */
    poll:function() {
        this._pollWheel();
        this._pollMove();
        this._pollPresses();

        this._pressedSinceLast = [];
        this._releasedSinceLast = [];
    },
    
    _pollWheel: function() {
        this._wheelTicksX = this._wheelTicksXSinceLast;
        this._wheelTicksY = this._wheelTicksYSinceLast;
        this._wheelTicksZ = this._wheelTicksZSinceLast;
        this._wheelTicksXSinceLast = 0;
        this._wheelTicksYSinceLast = 0;
        this._wheelTicksZSinceLast = 0;
    },
    
    _pollMove: function() {
        this._mouseMoved = this._mouseMovedSinceLast;
        this._mouseMovedSinceLast = false;
    },
    
    _pollPresses: function() {
        this._justPressed = [];
        for(var i in this._pressedSinceLast) {
            if(!this._isPressed[i])
                this._justPressed[i] = true;
            this._isPressed[i] = true;
        }
    },
    
    _pollReleases: function() {
        this._justReleased = [];
        for(var i in this._releasedSinceLast) {
            this._isPressed[i] = false;
            this._justReleased[i] = true;
        }
    },
    
    
    ////// Event handlers
    
    /**
     * contextmenu handler prevents right-click from opening the browser's 
     * context menu (the normal behavior for right-clicking). This
     * allows us to capture right-clicks to do other, funner things.
     */
    _handleContextMenu: function(evt) {
        return false;
    },
    
    /**
     * mousedown handler captures mouse clicks and holds.
     */
    _handleMouseDown: function(evt) {
        this._pressedSinceLast[evt.button] = true;

        var now = Date.now();
        var dt = now - this._lastClickTime[evt.button];
        this._lastClickTime[evt.button] = now;

        if(dt < this._multiClickTime)
            this._clickCount[evt.button]++;
        else
            this._clickCount[evt.button] = 1;
    },
    
    /**
     * mousemove handler captures mouse position and movement.
     */
    _handleMouseMove: function(evt) {
        var container = this.getContainer();
        
        var xy = Util.DOM.getAbsolutePosition(this);
        var rect = container.getBoundingClientRect();
        var left = TentaGL.Math.clamp(Math.floor(rect.left), 0, container.width);
        var top = TentaGL.Math.clamp(Math.floor(rect.top), 0, container.height);

        xy = [evt.clientX - left, evt.clientY - top];
        var xyPage = [evt.pageX, evt.pageY];

        var lastXY = this._xy;
        this._xy = xy;
        this._xyPage = xyPage;

        // Mouse clicks also fire mousemoved events, so check if we actually moved.
        if(lastXY[0] != this._xy[0] || lastXY[1] != this._xy[1]) {
            this._mouseMovedSinceLast = true;
        }
    },
    
    /**
     * mouseup handler captures when the user releases a mouse button.
     */
    _handleMouseUp: function(evt) {
        this._releasedSinceLast[evt.button] = true;
    },
    
    /**
     * wheel handler captures mouse wheel scrolling.
     */
    _handleWheel: function(evt) {
        var deltaX = evt.deltaX;
        var deltaY = evt.deltaY;
        var deltaZ = evt.deltaZ;

        this._wheelTicksXSinceLast += TentaGL.Math.sign(deltaX);
        this._wheelTicksYSinceLast += TentaGL.Math.sign(deltaY);
        this._wheelTicksZSinceLast += TentaGL.Math.sign(deltaZ);
        
        evt.preventDefault();
    },
    
    
    ////// Cursor movement/position methods
    
    /** 
     * Checks whether the mouse has moved.
     * @return {boolean}
     */
    hasMoved:function() {
        return this._mouseMoved;
    },
  
    /** 
     * Returns the X position of the mouse in page coordinates. 
     * @return {number}
     */
    pageX:function() {
        return this._xyPage[0];
    },
    
    /** 
     * Returns the XY position of the mouse in page coordinates. 
     * @return {number[]}
     */
    pageXY:function() {
        return [this._xyPage[0], this._xyPage[1]];
    },
  
    /** 
     * Returns the Y position of the mouse in page coordinates. 
     * @return {number}
     */
    pageY:function() {
        return this._xyPage[1];
    },
  
    /**
     * Returns the X position of the mouse relative to its container.
     * @return {number}
     */
    x:function() {
        return this._xy[0];
    },
    
    /**
     * Returns the XY position of the mouse relative to its container.
     * @return {number[]}
     */
    xy:function() {
        return [this._xy[0], this._xy[1]];
    },
  
    /** 
     * Returns the Y position of the mouse relative to its container.
     * @return {number}
     */
    y:function() {
        return this._xy[1];
    },
    
    
    ////// Mouse presses/releases methods
    
    /**
     * Returns the amount of consecutive clicks just made by some mouse button.
     * @param {MouseCode} mouseCode     The enum for the mouse button.
     * @return {int}    The number of consecutive clicks.
     */
    clickCount: function(mouseCode) {
        return this._clickCount[mouseCode];
    },
    
    /**
     * Returns whether some mouse button is currently being held.
     * @param {MouseCode} mouseCode   The enum for the mouse button.
     * @return {boolean}    True iff the button is pressed.
     */
    isPressed: function(mouseCode) {
        return this._isPressed(mouseCode) || false;
    },
    
    /**
     * Returns whether some mouse button was just pressed. 
     * @param {MouseCode} mouseCode   The enum for the mouse button.
     * @return {boolean}    True iff the button was just pressed.
     */ 
    justPressed: function(mouseCode) {
        return this._justPressed(mouseCode) || false;
    },
    
    /**
     * Returns whether some mouse button was just released.
     * @param {MouseCode} mouseCode   The enum for the mouse button.
     * @return {boolean}    True iff the button was just released.
     */
    justReleased: function(mouseCode) {
        return this._justReleased(mouseCode) || false;
    },
    
    
    ////// Mouse scrolling methods
    
    /**
     * Returns how many ticks the mouse has scrolled vertically down, or 0
     * if it didn't scroll down.
     * @return {int}
     */
    scrolledDown: function() {
        return Math.abs(Math.max(this._wheelTicksY, 0));
    },
    
    /**
     * Returns how many ticks the mouse has scrolled horizontally left, or 0
     * if it didn't scroll left.
     * @return {int}
     */
    scrolledLeft: function() {
        return Math.abs(Math.min(this._wheelTicksX, 0));
    },
    
    /**
     * Returns how many ticks the mouse has scrolled horizontally right, or 0
     * if it didn't scroll right.
     * @return {int}
     */
    scrolledRight: function() {
        return Math.abs(Math.max(this._wheelTicksX, 0));
    },
    
    /**
     * Returns how many ticks the mouse has scrolled vertically up, or 0
     * if it didn't scroll up.
     * @return {int}
     */
    scrolledUp: function() {
        return Math.abs(Math.min(this._wheelTicksY, 0));
    }
});
