/**
 * Encapsulates a 32-bit color.
 * @param {Object|vec4} config
 *      If specified as a vec4, it specifies the normalized RGBA color components.
 *      The alpha component can be omitted. If it is, alpha will be set to 1.
 *                                    
 *
 * @cfg {vec3} rgb
 * Normalized RGB with A=1.
 *
 * @cfg {vec4} rgba
 * Normalized RGBA.
 *
 * @cfg {vec3} rgbBytes
 * Unsigned 8-bit integer RGB components with A=255.
 *
 * @cfg {vec4} rgbaBytes
 * Unsigned 8-bit integer RGBA components.
 * 
 * @cfg {int} hex
 * The color expressed as an unsigned 32-bit integer in ARGB format.
 *
 * @cfg {vec3} hsb
 * Normalized HSB format (hue, saturation, brightness).
 * 
 * @cfg {vec4} hsba
 * Normalized HSBA format (hue, saturation, brightness, alpha).
 * 
 * @cfg {vec3} hsl
 * Normalized HSL format (hue, saturation, lightness).
 *
 * @cfg {vec4} hsla
 * Normalized HSLA format (hue, saturation, lightness, alpha).
 *
 * @cfg {String} css
 * A CSS-valid color string.
 */
KraGL.Color = function(config) {
    if(_.isArray(config))
        this.rgba(config);
    else if(config.rgb)
        this.rgba(config.rgb.concat(1.0));
    else if(config.rgba)
        this.rgba(config.rgba);
    else if(config.rgbBytes)
        this.rgbaBytes(config.rgbBytes.concat(1.0));
    else if(config.rgbaBytes)
        this.rgbaBytes(config.rgbaBytes);
    else if(config.hex)
        this.hex(config.hex);
    else if(config.hsb)
        this.hsba(config.hsb.concat(1.0));
    else if(config.hsba)
        this.hsba(config.hsba);
    else if(config.hsl)
        this.hsla(config.hsl.concat(1.0));
    else if(config.hsla)
        this.hsla(config.hsla);
    else if(config.css)
        this.css(config.css);
};


KraGL.extend(KraGL.Color, KraGL.Material, {
    
    /**
     * Gets/sets the color components in normalized RGBA format.
     */
    rgba: function(rgba) {
        // TODO
    },
    
    rgbaBytes: function(bytes) {
        // TODO
    },
    
    hex: function(argb) {
        // TODO
    },
    
    hsba: function(hsba) {
        // TODO
    },
    
    hsla: function(hsla) {
        // TODO
    },
    
    css: function(css) {
        // TODO
    }
    
});
