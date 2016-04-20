/**
 * @singleton
 * A utility library for creating and drawing on offscreen Canvas elements.
 */
KraGL.Canvas = {
    // TODO
    
    /**
     * Creates a new canvas element with the specified dimensions.
     * @param {vec2} size       The width and height of the canvas.
     * @param {KraGL.Color} [color]     The initial color of the entire canvas.
     * @return {CanvasElement}
     */
    create: function(size, color) {
        var canvas = document.createElement('canvas');
        canvas.width = size[0];
        canvas.height = size[1];
        
        this.clear(canvas, color);
        
        return canvas;
    }
};