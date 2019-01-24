'use strict';

describe('KraGL.img.Raster', () => {
  const assert = chai.assert;
  const IOError = KraGL.io.IOError;
  const Raster = KraGL.img.Raster;
  const RasterError = KraGL.img.RasterError;

  const COINBLOCK_URL = '../resources/images/coinBlock.png';

  describe('static createFromCanvas', () => {
    it('normal', () => {
      let canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;

      return Raster.createFromCanvas(canvas)
      .then(raster => {
        assert.isTrue(raster instanceof Raster);
        assert.equal(raster.width, 32);
        assert.equal(raster.height, 32);
      });
    });
  });

  describe('static createFromImage', () => {
    it('normal', () => {
      return KraGL.io.Ajax.getImage(COINBLOCK_URL)
      .then(image => {
        return Raster.createFromImage(image);
      })
      .then(raster => {
        assert.isTrue(raster instanceof Raster);
        assert.equal(raster.width, 64);
        assert.equal(raster.height, 32);
      });
    });
  });

  describe("static createFromURL", () => {
    it('normal', () => {
      return Raster.createFromURL(COINBLOCK_URL)
      .then(raster => {
        assert.isTrue(raster instanceof Raster);
        assert.equal(raster.width, 64);
        assert.equal(raster.height, 32);
      });
    });

    it('error - bad URL', () => {
      return Raster.createFromURL('../hello/IAmError.png')
      .then(() => {
        throw new Error('You shall not pass!');
      })
      .catch(err => {
        assert.isTrue(err instanceof IOError);
      });
    });
  });

  describe('static createFromWebGLTexture', () => {
    it('normal');
  });

  describe('data', () => {
    it('normal', () => {
      return Raster.createFromURL(COINBLOCK_URL)
      .then(raster => {
        assert.isTrue(raster.data instanceof Uint8Array);
        assert.equal(raster.data.length, 32*64*4);
      });
    });
  });

  describe('height', () => {
    it('normal', () => {
      return Raster.createFromURL(COINBLOCK_URL)
      .then(raster => {
        assert.equal(raster.height, 32);
      });
    });
  });

  describe('width', () => {
    it('normal', () => {
      return Raster.createFromURL(COINBLOCK_URL)
      .then(raster => {
        assert.equal(raster.width, 64);
      });
    });
  });

  describe('clone', () => {
    it('normal', () => {
      return Raster.createFromURL(COINBLOCK_URL)
      .then(raster => {
        let clone = raster.clone();

        assert.equal(clone.width, 64);
        assert.equal(clone.height, 32);

        assert.isTrue(clone.data instanceof Uint8Array);
        assert.equal(clone.data.length, 32*64*4);
        assert.notEqual(raster.data, clone.data);
        assert.deepEqual(raster.data, clone.data);
      });
    });
  });

  describe('crop', () => {
    it('normal', () => {
      return Raster.createFromURL(COINBLOCK_URL)
      .then(raster => {
        let crop1 = raster.crop(0, 0, 32, 32);
        assert.isTrue(crop1 instanceof Raster);
        assert.equal(crop1.width, 32);
        assert.equal(crop1.height, 32);

        let crop2 = raster.crop(32, 16, 32, 16);
        assert.isTrue(crop2 instanceof Raster);
        assert.equal(crop2.width, 32);
        assert.equal(crop2.height, 16);
      });
    });

    it('error - out of bounds - left border', () => {
      return Raster.createFromURL(COINBLOCK_URL)
      .then(raster => {
        raster.crop(-1, 0, 32, 32);
      })
      .then(() => {
        throw new Error('You shall not pass!');
      })
      .catch(err => {
        assert.isTrue(err instanceof RasterError);
      });
    });

    it('error - out of bounds - top border', () => {
      return Raster.createFromURL(COINBLOCK_URL)
      .then(raster => {
        raster.crop(0, -1, 32, 32);
      })
      .then(() => {
        throw new Error('You shall not pass!');
      })
      .catch(err => {
        assert.isTrue(err instanceof RasterError);
      });
    });

    it('error - out of bounds - right border', () => {
      return Raster.createFromURL(COINBLOCK_URL)
      .then(raster => {
        raster.crop(48, 0, 32, 32);
      })
      .then(() => {
        throw new Error('You shall not pass!');
      })
      .catch(err => {
        assert.isTrue(err instanceof RasterError);
      });
    });

    it('error - out of bounds - bottom border', () => {
      return Raster.createFromURL(COINBLOCK_URL)
      .then(raster => {
        raster.crop(0, 16, 32, 32);
      })
      .then(() => {
        throw new Error('You shall not pass!');
      })
      .catch(err => {
        assert.isTrue(err instanceof RasterError);
      });
    });
  });

  describe('flipX', () => {
    it('normal', () => {
      return Raster.createFromURL(COINBLOCK_URL)
      .then(raster => {
        let flipped = raster.flipX();
        assert.isTrue(flipped instanceof Raster);
      });
    });
  });

  describe('flipY', () => {
    it('normal', () => {
      return Raster.createFromURL(COINBLOCK_URL)
      .then(raster => {
        let flipped = raster.flipY();
        assert.isTrue(flipped instanceof Raster);
      });
    });
  });

  describe('getPixel', () => {
    it('normal', () => {
      return Raster.createFromURL(COINBLOCK_URL)
      .then(raster => {
        let pixel = raster.getPixel(48, 16);
        assert.equal(pixel.length, 4);
        assert.deepEqual(pixel, new Uint8Array([255, 244, 202, 255]));
      });
    });

    it('error - out of bounds - left', () => {
      return Raster.createFromURL(COINBLOCK_URL)
      .then(raster => {
        raster.getPixel(-1, 0);
        throw new Error('You shall not pass!');
      })
      .catch(err => {
        assert.isTrue(err instanceof RasterError);
      });
    });

    it('error - out of bounds - top', () => {
      return Raster.createFromURL(COINBLOCK_URL)
      .then(raster => {
        raster.getPixel(0, -1);
        throw new Error('You shall not pass!');
      })
      .catch(err => {
        assert.isTrue(err instanceof RasterError);
      });
    });

    it('error - out of bounds - right', () => {
      return Raster.createFromURL(COINBLOCK_URL)
      .then(raster => {
        raster.getPixel(64, 0);
        throw new Error('You shall not pass!');
      })
      .catch(err => {
        assert.isTrue(err instanceof RasterError);
      });
    });

    it('error - out of bounds - bottom', () => {
      return Raster.createFromURL(COINBLOCK_URL)
      .then(raster => {
        raster.getPixel(0, 32);
        throw new Error('You shall not pass!');
      })
      .catch(err => {
        assert.isTrue(err instanceof RasterError);
      });
    });
  });

  describe('setPixel', () => {
    it('normal', () => {
      return Raster.createFromURL(COINBLOCK_URL)
      .then(raster => {
        raster.setPixel(32, 16, [0, 127, 255, 128]);
        let pixel = raster.getPixel(32, 16);
        assert.deepEqual(pixel, new Uint8Array([0, 127, 255, 128]));
      });
    });

    it('error - out of bounds - top', () => {
      return Raster.createFromURL(COINBLOCK_URL)
      .then(raster => {
        raster.setPixel(0, -1, [255, 255, 255, 255]);
        throw new Error('You shall not pass!');
      })
      .catch(err => {
        assert.isTrue(err instanceof RasterError);
      });
    });

    it('error - out of bounds - left', () => {
      return Raster.createFromURL(COINBLOCK_URL)
      .then(raster => {
        raster.setPixel(-1, 0, [255, 255, 255, 255]);
        throw new Error('You shall not pass!');
      })
      .catch(err => {
        assert.isTrue(err instanceof RasterError);
      });
    });

    it('error - out of bounds - right', () => {
      return Raster.createFromURL(COINBLOCK_URL)
      .then(raster => {
        raster.setPixel(64, 0, [255, 255, 255, 255]);
        throw new Error('You shall not pass!');
      })
      .catch(err => {
        assert.isTrue(err instanceof RasterError);
      });
    });

    it('error - out of bounds - bottom', () => {
      return Raster.createFromURL(COINBLOCK_URL)
      .then(raster => {
        raster.setPixel(0, 32, [255, 255, 255, 255]);
        throw new Error('You shall not pass!');
      })
      .catch(err => {
        assert.isTrue(err instanceof RasterError);
      });
    });
  });

  describe('toCanvas', () => {
    it('normal', () => {
      return Raster.createFromURL(COINBLOCK_URL)
      .then(raster => {
        let canvas = raster.toCanvas();

        assert.isTrue(canvas instanceof HTMLCanvasElement);
        assert.equal(canvas.width, 64);
        assert.equal(canvas.height, 32);
      });
    });
  });


});
