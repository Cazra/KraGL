/** 
 * Captures keyboard input for a container.
 * @constructor
 * @param {DivElement} container
 */
KraGL.input.Keyboard = function(container) {
    this._isPressed = [];
    this._justPressed = [];
    this._justReleased = [];
    this._repPressed = [];

    this._pressedSinceLast = [];
    this._releasedSinceLast = [];

    var self = this;
    var keyDownHandler = function(evt) {
        //  console.log("key down: " + evt.keyCode);
        self._pressedSinceLast[evt.keyCode] = true;
        evt.preventDefault();
    };

    var keyUpHandler = function(evt) {
        // console.log("key up: " + evt.keyCode);
        self._releasedSinceLast[evt.keyCode] = true;
        evt.preventDefault();
    };

    container.addEventListener("keydown", keyDownHandler, false);
    container.addEventListener("keyup", keyUpHandler, false);
};

KraGL.extend(KraGL.input.Keyboard, KraGL.Base, {
  
    /** 
     * Polls for updated keyboard input state. 
     * This will be automatically called by the Application at the start of
     * every frame.
     */
    poll:function() {
        this._justPressed = [];
        this._justReleased = [];
        this._repPressed = [];

        // Check for keys pressed.
        for(var keyCode in this._pressedSinceLast) {
            if(!this._isPressed[keyCode]) {
                this._justPressed[keyCode] = true;
            }
            this._isPressed[keyCode] = true;
            this._repPressed[keyCode] = true;
        }

        // Check for keys released.
        for(var keyCode in this._releasedSinceLast) {
            this._justReleased[keyCode] = true;
            this._isPressed[keyCode] = false;
        }

        this._pressedSinceLast = [];
        this._releasedSinceLast = [];
    },
  
  
  
    /** 
    * Returns whether a key is currently pressed. 
    * @param {int} keyCode
    * @return {boolean}
    */
    isPressed:function(keyCode) {
        return (this._isPressed[keyCode] || false);
    },
  
    /** Returns whether a key was just pressed. */
    justPressed:function(keyCode) {
        return (this._justPressed[keyCode] || false);
    },

    /** Returns whether a key was just released. */
    justReleased:function(keyCode) {
        return (this._justReleased[keyCode] || false);
    },

    /** Returns whether a key was just pressed or is repeat-pressing. */
    isPressedRepeating:function(keyCode) {
        return (this._repPressed[keyCode] || false);
    }
});

