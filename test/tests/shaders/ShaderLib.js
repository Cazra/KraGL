'use strict';

describe('KraGL.shaders.ShaderLib', () => {
  const assert = chai.assert;
  const ShaderProgram = KraGL.shaders.ShaderProgram;
  const ShaderLib = KraGL.shaders.ShaderLib;

  const SIMPLE_OPTS = {
    shaders: {
      frag: {
        urls: ['../shaders/old/simple.frag']
      },
      vert: {
        urls: ['../shaders/old/simple.vert']
      }
    },
    attributeGetters: {
      vertexNormal: 'n',
      vertexPos: 'xyz',
      vertexTexCoords: 'texST'
    },
    uniformGetters: {
      mvpTrans: 'mvpTrans',
      normalTrans: 'normalTrans',
      opacity: 'opacity',
      fogColor: 'fogColor',
      fogEquation: 'fogEquation',
      fogDensity: 'fogDensity',
      solidColor: 'color',
      tex: 'texture',
      useTex: 'textureFlag'
    }
  };

  const NORMAL_OPTS = {
    shaders: {
      frag: {
        urls: ['../shaders/old/normal.frag']
      },
      vert: {
        urls: ['../shaders/old/normal.vert']
      }
    },
    attributeGetters: {
      vertexNormal: 'n',
      vertexPos: 'xyz',
      vertexTexCoords: 'texST'
    },
    uniformGetters: {
      mvpTrans: 'mvpTrans',
      normalTrans: 'normalTrans',
      fogColor: 'fogColor',
      fogEquation: 'fogEquation',
      fogDensity: 'fogDensity',
      tex: 'texture',
      useTex: 'textureFlag'
    }
  };

  const PHONG_OPTS = {
    shaders: {
      vert: { urls: ['../shaders/old/phong.vert'] },
      frag: { urls: ['../shaders/old/phong.frag'] },
    },
    attributeGetters: {
      vertexNormal: 'n',
      vertexPos: 'xyz',
      vertexTang: 't',
      vertexTexCoords: 'texST'
    },
    uniformGetters: {
      mvpTrans: 'mvpTrans',
      mvTrans: 'mvTrans',
      vTrans: 'vTrans',
      normalTrans: 'normalTrans',
      opacity: 'opacity',
      fogColor: 'fogColor',
      fogEquation: 'fogEquation',
      fogDensity: 'fogDensity',
      solidColor: 'color',
      tex: 'texture',
      useTex: 'textureFlag',
      bumpTex: 'bumpTexture',
      useBumpTex: 'bumpTextureFlag'
    }
  };

  describe('add, has, get, clean', () => {
    it('normal', () => {
      let canvas = document.createElement('canvas');
      let gl = canvas.getContext('webgl');

      let shaderLib = new ShaderLib(gl);
      assert.isFalse(shaderLib.has('simple'));

      return Promise.all([
        ShaderProgram.createProgram(gl, SIMPLE_OPTS),
        ShaderProgram.createProgram(gl, NORMAL_OPTS)
      ])
      .then(programs => {
        shaderLib.add('simple', programs[0]);
        shaderLib.add('normal', programs[1]);

        assert.isTrue(shaderLib.has('simple'));
        assert.isTrue(shaderLib.has('normal'));
        assert.isFalse(shaderLib.has('phong'));

        assert.equal(shaderLib.get('simple'), programs[0]);
        assert.equal(shaderLib.get('normal'), programs[1]);
      })
      .then(() => {
        shaderLib.clean();
        assert.equal(shaderLib.size, 0);
      });
    });

    it('duplicate', () => {
      let canvas = document.createElement('canvas');
      let gl = canvas.getContext('webgl');

      let shaderLib = new ShaderLib(gl);

      return Promise.all([
        ShaderProgram.createProgram(gl, SIMPLE_OPTS),
        ShaderProgram.createProgram(gl, NORMAL_OPTS)
      ])
      .then(programs => {
        assert.throws(() => {
          shaderLib.add('simple', programs[0]);
          shaderLib.add('simple', programs[1]);
        }, KraGL.shaders.ShaderError);
      })
      .then(() => {
        shaderLib.clean();
      });
    });
  });

  describe('createPrograms', () => {
    it('normal', () => {
      let canvas = document.createElement('canvas');
      let gl = canvas.getContext('webgl');

      let shaderLib = new ShaderLib(gl);
      return shaderLib.createPrograms({
        'simple': SIMPLE_OPTS,
        'normal': NORMAL_OPTS
      })
      .then(() => {
        assert.isTrue(shaderLib.has('simple'));
        assert.isTrue(shaderLib.has('normal'));
      })
      .then(() => {
        shaderLib.clean();
      });
    });
  });


  describe('enable', () => {
    it('normal', () => {
      let canvas = document.createElement('canvas');
      let gl = canvas.getContext('webgl');

      let shaderLib = new ShaderLib(gl);
      return shaderLib.createPrograms({
        'simple': SIMPLE_OPTS,
        'normal': NORMAL_OPTS
      })
      .then(() => {
        _.each(shaderLib.get('simple').attributes, attr => {
          assert.isFalse(attr.isEnabled);
        });

        shaderLib.enable('simple');
        assert.equal(shaderLib.curName, 'simple');
        assert.equal(shaderLib.curProgram, shaderLib.get('simple'));
        _.each(shaderLib.get('simple').attributes, attr => {
          assert.isTrue(attr.isEnabled);
        });

        shaderLib.enable('normal');
        assert.equal(shaderLib.curName, 'normal');
        assert.equal(shaderLib.curProgram, shaderLib.get('normal'));
        _.each(shaderLib.get('normal').attributes, attr => {
          assert.isTrue(attr.isEnabled);
        });
      })
      .then(() => {
        shaderLib.clean();
      });
    });
  });

  describe('push, pop', () => {
    it('normal', () => {
      let canvas = document.createElement('canvas');
      let gl = canvas.getContext('webgl');

      let shaderLib = new ShaderLib(gl);
      return shaderLib.createPrograms({
        'simple': SIMPLE_OPTS,
        'normal': NORMAL_OPTS,
        'phong': PHONG_OPTS
      })
      .then(() => {
        shaderLib.enable('simple');
        shaderLib.push();
        shaderLib.enable('normal');
        shaderLib.push();
        shaderLib.enable('phong');
        shaderLib.push();

        shaderLib.pop();
        assert.equal(shaderLib.curName, 'phong');
        shaderLib.pop();
        assert.equal(shaderLib.curName, 'normal');
        shaderLib.pop();
        assert.equal(shaderLib.curName, 'simple');
      })
      .then(() => {
        shaderLib.clean();
      });
    });
  });

  describe('remove', () => {
    it('normal', () => {
      let canvas = document.createElement('canvas');
      let gl = canvas.getContext('webgl');

      let shaderLib = new ShaderLib(gl);
      return shaderLib.createPrograms({
        'simple': SIMPLE_OPTS,
        'normal': NORMAL_OPTS
      })
      .then(() => {
        assert.isTrue(shaderLib.has('normal'));
        shaderLib.remove('normal');
        assert.isFalse(shaderLib.has('normal'));
      })
      .then(() => {
        shaderLib.clean();
      });
    });
  });

});
