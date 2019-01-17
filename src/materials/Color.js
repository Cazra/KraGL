'use strict';

import { ValidationError } from '../ValidationError';
import { Material } from './Material';

/**
 * A Material for a uniform color. Colors support various types of formats,
 * but internally they are represented as a vec4 in normalized RGBA format.
 * This means that each RGBA component of the color is a float in the range
 * [0, 1].
 *
 * This can be bound to the Uniform assigned to the "color" property.
 * This Uniform is expected to be of type vec4.
 *
 * @memberof KraGL.materials
 * @implements {Cloneable}
 */
class Color extends Material {

  /**
   * The color's normalized alpha component.
   * @type {number}
   */
  get a() {
    return this._rgba[3];
  }
  set a(a) {
    this._rgba[3] = a;
  }

  /**
   * The color's normalized blue component.
   * @type {number}
   */
  get b() {
    return this._rgba[2];
  }
  set b(b) {
    this._rgba[2] = b;
  }

  /**
   * The color expressed as a CSS string.
   * @type {string}
   */
  get css() {
    let bytes = this.rgbBytes;
    let r = bytes[0];
    let g = bytes[1];
    let b = bytes[2];
    let a = this._rgba[3];
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  set css(css) {
    let canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    let ctx = canvas.getContext('2d');
    ctx.fillStyle = css;
    ctx.fillRect(0, 0, 1, 1);
    this.rgbaBytes = ctx.getImageData(0, 0, 1, 1).data;
  }

  /**
   * The color's normalized green component.
   * @type {number}
   */
  get g() {
    return this._rgba[1];
  }
  set g(g) {
    this._rgba[1] = g;
  }

  /**
   * The color expressed as a 32-bit unsigned integer in ARGB format.
   * @type {uint32}
   */
  get hex() {
    let bytes = this.rgbaBytes;
    let hex = bytes[3] << 24;
    hex += bytes[0] << 16;
    hex += bytes[1] << 8;
    hex += bytes[2] << 0;
    return hex>>>0;
  }
  set hex(hex) {
    let a = (hex & 0xFF000000) >>> 24;
    let r = (hex & 0x00FF0000) >>> 16;
    let g = (hex & 0x0000FF00) >>> 8;
    let b = (hex & 0x000000FF);
    this.rgbaBytes = [r, g, b, a];
  }

  /**
   * The color expressed in normalized HSBA (Hue, Saturation, Brightness)
   * format. Alpha is assumed to be 1.
   * See https://en.wikipedia.org/wiki/HSL_and_HSV
   * @type {vec3}
   */
  get hsb() {
    return this.hsba.slice(0, 3);
  }
  set hsb(hsb) {
    this.hsba = [...hsb, 1];
  }

  /**
   * The color expressed in normalized HSBA (Hue, Saturation, Brightness)
   * format.
   * See https://en.wikipedia.org/wiki/HSL_and_HSV
   * @type {vec4}
   */
  get hsba() {
    let [r, g, b, a] = this._rgba;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let chroma = max-min;

    let hue = 0;
    let brightness = max;
    let saturation = 0;

    if(chroma !== 0) {
      if(max === r)
        hue = ((g-b)/chroma + 6) % 6;
      else if(max === g)
        hue = (b-r)/chroma + 2;
      else if(max === b)
        hue = (r-g)/chroma + 4;
      hue /= 6;
    }
    if(brightness !== 0)
      saturation = chroma/brightness;
    return [hue, saturation, brightness, a];
  }
  set hsba(hsba) {
    let [h, s, b, a] = hsba;
    let hp = (h - Math.floor(h))*6;
    let c = s * b;
    let x = c * (1 - Math.abs(hp % 2 - 1));
    let m = b - c;

    let [r1, g1, b1] = [0, 0, 0];
    if(hp >= 0 && hp < 1)
      [r1, g1, b1] = [c, x, 0];
    else if(hp >= 1 && hp < 2)
      [r1, g1, b1] = [x, c, 0];
    else if(hp >= 2 && hp < 3)
      [r1, g1, b1] = [0, c, x];
    else if(hp >= 3 && hp < 4)
      [r1, g1, b1] = [0, x, c];
    else if(hp >= 4 && hp < 5)
      [r1, g1, b1] = [x, 0, c];
    else if(hp >= 5 && hp < 6)
      [r1, g1, b1] = [c, 0, x];
    this.rgba = [r1 + m, g1 + m, b1 + m, a];
  }

  /**
   * The color expressed in normalized HSL (Hue, Saturation, Lightness)
   * format. Alpha is assumed to be 1.
   * See https://en.wikipedia.org/wiki/HSL_and_HSV
   * @type {vec3}
   */
  get hsl() {
    return this.hsla.slice(0, 3);
  }
  set hsl(hsl) {
    this.hsla = [...hsl, 1];
  }

  /**
   * The color expressed in normalized HSL (Hue, Saturation, Lightness)
   * format.
   * See https://en.wikipedia.org/wiki/HSL_and_HSV
   * @type {vec4}
   */
  get hsla() {
    let [r, g, b, a] = this._rgba;
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    let chroma = max-min;

    let hue = 0;
    let lightness = (max+min)/2;
    let saturation = 0;

    if(chroma !== 0) {
      if(max === r)
        hue = ((g-b)/chroma + 6) % 6;
      else if(max === g)
        hue = (b-r)/chroma + 2;
      else if(max === b)
        hue = (r-g)/chroma + 4;
      hue /= 6;
    }
    if(lightness !== 1)
      saturation = chroma / (1 - Math.abs(2 * lightness - 1));
    return [hue, saturation, lightness, a];
  }
  set hsla(hsla) {
    let [h, s, l, a] = hsla;
    let hp = (h - Math.floor(h))*6;
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs(hp % 2 - 1));
    let m = l - c/2;

    let [r, g, b] = [0, 0, 0];
    if(hp >= 0 && hp < 1)
      [r, g, b] = [c, x, 0];
    else if(hp >= 1 && hp < 2)
      [r, g, b] = [x, c, 0];
    else if(hp >= 2 && hp < 3)
      [r, g, b] = [0, c, x];
    else if(hp >= 3 && hp < 4)
      [r, g, b] = [0, x, c];
    else if(hp >= 4 && hp < 5)
      [r, g, b] = [x, 0, c];
    else if(hp >= 5 && hp < 6)
      [r, g, b] = [c, 0, x];
    this.rgba = [r + m, g + m, b + m, a];
  }

  /**
   * The color's normalized red component.
   * @type {number}
   */
  get r() {
    return this._rgba[0];
  }
  set r(r) {
    this._rgba[0] = r;
  }

  /**
   * The color in normalized RGB format. (Alpha is assumed to be 1.0)
   * @type {vec3}
   */
  get rgb() {
    return this._rgba.slice(0, 3);
  }
  set rgb(rgb) {
    this.rgba = [...rgb, 1];
  }

  /**
   * The color expressed in RGB format with each component as an unsigned byte.
   * @type {vec3}
   */
  get rgbBytes() {
    return this.rgbaBytes.slice(0, 3);
  }
  set rgbBytes(rgb) {
    this.rgbaBytes = [...rgb, 0xFF];
  }

  /**
   * The color in normalized RGBA format.
   * @type {vec4}
   */
  get rgba() {
    return this._rgba;
  }
  set rgba(rgba) {
    this._rgba = rgba;
  }

  /**
   * The color expressed in RGBA format with each component as an unsigned byte.
   * @type {vec4}
   */
  get rgbaBytes() {
    return _.map(this._rgba, c => {
      return (c*0xFF) & 0xFF;
    });
  }
  set rgbaBytes(rgba) {
    this.rgba = _.map(rgba, c => {
      return c/0xFF;
    });
  }

  /**
   * @param {object} opts
   * @param {string} [css]
   *        Specifies the color as any valid CSS color value.
   * @param {uint32} [hex]
   *        Specifies the color as an unsigned 32-bit integer in ARGB format.
   * @param {vec3} [hsb]
   *        Specifies the color in normalized HSB format (the alpha component
   *        will be set to 1).
   * @param {vec4} [hsba]
   *        Specifies the color in normalized HSBA format.
   * @param {vec3} [hsl]
   *        Specifies the color in normalized HSL format.
   * @param {vec4} [hsla]
   *        Specifies the color in normalized HSLA format.
   * @param {vec3} [rgb]
   *        Specifies the color in normalized RGB format (the alpha component
   *        will be set to 1).
   * @param {vec3} [rgbBytes]
   *        Specifies the color in RGB format with each component as an
   *        unsigned byte value.
   * @param {vec4} [rgba]
   *        Specifies the color in normalized RGBA format.
   * @param {vec4} [rgbaBytes]
   *        Specifies the color in RGBA format with each
   */
  constructor(opts) {
    super(opts);
    if(opts.css)
      this.css = opts.css;
    else if(opts.hex)
      this.hex = opts.hex;
    else if(opts.hsb)
      this.hsb = opts.hsb;
    else if(opts.hsba)
      this.hsba = opts.hsba;
    else if(opts.hsl)
      this.hsl = opts.hsl;
    else if(opts.hsla)
      this.hsla = opts.hsla;
    else if(opts.rgb)
      this.rgb = opts.rgb;
    else if(opts.rgbBytes)
      this.rgbBytes = opts.rgbBytes;
    else if(opts.rgba)
      this.rgba = opts.rgba;
    else if(opts.rgbaBytes)
      this.rgbaBytes = opts.rgbaBytes;
    else
      throw new ValidationError('No valid color format was specified.');
  }

  /**
   * @inheritdoc
   */
  bind(app) {
    let shader = app.shaderLib.curProgram;
    let uniform = shader.getPropertyUniform('color');
    if(uniform)
      uniform.value = this.rgba;
  }

  /**
   * @inheritdoc
   */
  clean(gl) {
    // Cleaning a color is trivial.
    _.noop(gl);
    return Promise.resolve();
  }

  /**
   * Produces a cloned copy of this color.
   * @return {KraGL.materials.Color}
   */
  clone() {
    return new Color({
      rgba: _.clone(this.rgba)
    });
  }

  /**
   * Check if this equals another color. Two colors are equal if their RGBA
   * values are the same.
   */
  equals(other) {
    return this.r === other.r &&
      this.g === other.g &&
      this.b === other.b &&
      this.a === other.a;
  }

  /**
   * @inheritdoc
   */
  load(gl) {
    // Loading a color is trivial.
    _.noop(gl);
    return Promise.resolve();
  }
}
export { Color };
