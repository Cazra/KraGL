'use strict';

describe('KraGL.materials.Color', () => {
  const assert = chai.assert;
  const Color = KraGL.materials.Color;

  describe('constructor', () => {
    it('css', () => {
      let css = 'blue';
      let color = new Color({ css });
      assert.equal(color.css, 'rgba(0, 0, 255, 1)');
    });

    it('hex', () => {
      let hex = 0xAA112233;
      let color = new Color({ hex });
      assert.equal(color.hex, hex);
    });

    it('hsb', () => {
      let hsb = [0.1, 0.2, 0.3];
      let color = new Color({ hsb });
      assert.vecApproximately(color.hsba, [...hsb, 1], 0.00001);
    });

    it('hsba', () => {
      let hsba = [0.1, 0.2, 0.3, 1];
      let color = new Color({ hsba });
      assert.vecApproximately(color.hsba, hsba, 0.00001);
    });

    it('hsl', () => {
      let hsl = [0.1, 0.2, 0.3];
      let color = new Color({ hsl });
      assert.vecApproximately(color.hsla, [...hsl, 1], 0.00001);
    });

    it('hsla', () => {
      let hsla = [0.1, 0.2, 0.3, 1];
      let color = new Color({ hsla });
      assert.vecApproximately(color.hsla, hsla, 0.00001);
    });

    it('rgb', () => {
      let rgb = [0.1, 0.2, 0.3];
      let color = new Color({ rgb });
      assert.vecApproximately(color.rgba, [...rgb, 1], 0.00001);
    });

    it('rgbBytes', () => {
      let rgbBytes = [40, 80, 120];
      let color = new Color({ rgbBytes });
      assert.vecApproximately(color.rgbBytes, rgbBytes, 0.000001);
    });

    it('rgba', () => {
      let rgba = [0.1, 0.2, 0.3, 1];
      let color = new Color({ rgba });
      assert.vecApproximately(color.rgba, rgba, 0.00001);
    });

    it('rgbaBytes', () => {
      let rgbaBytes = [40, 80, 120, 240];
      let color = new Color({ rgbaBytes });
      assert.vecApproximately(color.rgbaBytes, rgbaBytes, 0.000001);
    });
  });

  describe('a', () => {
    it('normal', () => {
      let color = new Color({ hex: 0xFF112233 });
      assert.equal(color.a, 1.0);

      color.a = 0.5;
      assert.equal(color.a, 0.5);
    });
  });

  describe('b', () => {
    it('normal', () => {
      let color = new Color({ hex: 0x11223344 });
      assert.equal(color.b, 0x44/0xFF);

      color.b = 0.5;
      assert.equal(color.b, 0.5);
    });
  });

  describe('css', () => {
    it('normal', () => {
      let color = new Color({ css: 'blue' });
      assert.equal(color.css, 'rgba(0, 0, 255, 1)');

      color.css = 'red';
      assert.equal(color.css, 'rgba(255, 0, 0, 1)');
    });
  });

  describe('g', () => {
    it('normal', () => {
      let color = new Color({ rgba: [0.1, 0.2, 0.3, 0.5] });
      assert.equal(color.g, 0.2);

      color.g = 0.5;
      assert.equal(color.g, 0.5);
    });
  });

  describe('hex', () => {
    it('normal', () => {
      let color = new Color({ rgbaBytes: [0xAA, 0xBB, 0xCC, 0xFF] });
      assert.equal(color.hex, 0xFFAABBCC);

      color.hex = 0xAA112233;
      assert.equal(color.hex, 0xAA112233);
    });
  });

  describe('hsb', () => {
    it('normal', () => {
      let color = new Color({ hex: 0xFFAABBCC });
      assert.vecApproximately(color.hsb, [210/360, 0.1666666, 0.8], 0.00001);

      color.hsb = [0.1, 0.2, 0.3];
      assert.vecApproximately(color.hsb, [0.1, 0.2, 0.3], 0.00001);
    });
  });

  describe('hsba', () => {
    it('normal', () => {
      let color = new Color({ hex: 0xFFAABBCC });
      assert.vecApproximately(color.hsba, [210/360, 0.166666, 0.8, 1], 0.00001);

      color.hsba = [0.1, 0.2, 0.3, 0.4];
      assert.vecApproximately(color.hsba, [0.1, 0.2, 0.3, 0.4], 0.0001);
    });
  });

  describe('hsl', () => {
    it('normal', () => {
      let color = new Color({ hex: 0xFFAABBCC });
      assert.vecApproximately(color.hsl, [210/360, 0.25, 0.733333], 0.00001);

      color.hsl = [0.1, 0.2, 0.3];
      assert.vecApproximately(color.hsl, [0.1, 0.2, 0.3], 0.0001);
    });
  });

  describe('hsla', () => {
    it('normal', () => {
      let color = new Color({ hex: 0xFFAABBCC });
      assert.vecApproximately(color.hsla, [210/360, 0.25, 0.733333, 1], 0.00001);

      color.hsla = [0.1, 0.2, 0.3, 0.4];
      assert.vecApproximately(color.hsla, [0.1, 0.2, 0.3, 0.4], 0.0001);
    });
  });

  describe('r', () => {
    it('normal', () => {
      let color = new Color({ hex: 0xFFAABBCC });
      assert.equal(color.r, 0xAA/0xFF);

      color.r = 0.5;
      assert.equal(color.r, 0.5);
    });
  });

  describe('rgb', () => {
    it('normal', () => {
      let color = new Color({ rgba: [0.1, 0.2, 0.3, 1] });
      assert.vecApproximately(color.rgb, [0.1, 0.2, 0.3], 0.00001);

      color.rgb = [0.8, 0.9, 0.7];
      assert.vecApproximately(color.rgb, [0.8, 0.9, 0.7], 0.00001);
    });
  });

  describe('rgbBytes', () => {
    it('normal', () => {
      let color = new Color({ hex: 0xFFAABBCC });
      assert.vecApproximately(color.rgbBytes, [0xAA, 0xBB, 0xCC], 0.00001);

      color.rgb = [40, 80, 120];
      assert.vecApproximately(color.rgb, [40, 80, 120], 0.00001);
    });
  });

  describe('rgba', () => {
    it('normal', () => {
      let color = new Color({ hex: 0xFFAABBCC });
      assert.vecApproximately(color.rgba, [0xAA/0xFF, 0xBB/0xFF, 0xCC/0xFF, 1], 0.0001);

      color.rgba = [0.1, 0.2, 0.3, 0.4];
      assert.vecApproximately(color.rgba, [0.1, 0.2, 0.3, 0.4], 0.0001);
    });
  });

  describe('rgbaBytes', () => {
    it('normal', () => {
      let color = new Color({ hex: 0xFFAABBCC });
      assert.vecApproximately(color.rgbaBytes, [0xAA, 0xBB, 0xCC, 0xFF], 0.0001);

      color.rgbaBytes = [40, 80, 120, 160];
      assert.vecApproximately(color.rgbaBytes, [40, 80, 120, 160], 0.0001);
    });
  });

  describe('bind', () => {
    it('normal');
  });

  describe('clean', () => {
    it('normal', () => {
      let canvas = document.createElement('canvas');
      let gl = canvas.getContext('webgl');
      let color = new Color({ css: 'blue' });
      color.clean(gl);
    });
  });

  describe('clone', () => {
    it('normal', () => {
      let color = new Color({ hex: 0xFFAABBCC });
      let clone = color.clone();

      color.r = 1;
      assert.equal(clone.hex, 0xFFAABBCC);
    });
  });

  describe('equals', () => {
    it('true', () => {
      let color1 = new Color({ css: 'red' });
      let color2 = new Color({ hex: 0xFFFF0000 });
      assert.isTrue(color1.equals(color2));
    });

    it('false', () => {
      let color1 = new Color({ css: 'blue' });
      let color2 = new Color({ hex: 0xFFFF0000 });
      assert.isFalse(color1.equals(color2));

      color1 = new Color({ hex: 0xAABBCCDD });
      color2 = new Color({ hex: 0xFFBBCCDD});
      assert.isFalse(color1.equals(color2));

      color2 = new Color({ hex: 0xAAFFCCDD});
      assert.isFalse(color1.equals(color2));

      color2 = new Color({ hex: 0xAABBFFDD});
      assert.isFalse(color1.equals(color2));

      color2 = new Color({ hex: 0xAABBCCFF});
      assert.isFalse(color1.equals(color2));
    });
  });

  describe('static create', () => {
    it('normal', () => {
      let canvas = document.createElement('canvas');
      let gl = canvas.getContext('webgl');

      return Color.create(gl, { css: 'blue' })
      .then(color => {
        assert.equal(color.hex, 0xFF0000FF);
      });
    });
  });
});
