'use strict';

describe('KraGL.shaders.Uniforms', () => {
  const assert = chai.assert;
  const ShaderProgram = KraGL.shaders.ShaderProgram;

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
    }
  };

  describe('ShaderVar properties', () => {
    it('simple shader', () => {
      let canvas = document.createElement('canvas');
      let gl = canvas.getContext('webgl');

      return ShaderProgram.createProgram(gl, SIMPLE_OPTS
      .then(program => {
        program.enable();

        let solidColor = program.uniforms['solidColor'];
        assert.isFalse(solidColor.isArray);
        assert.isFalse(solidColor.isBuiltIn);
        assert.equal(solidColor.length, 1);
        assert.equal(solidColor.name, 'solidColor');
        assert.equal(solidColor.sizeBytes, 16);
        assert.equal(solidColor.sizeUnits, 4);
        assert.equal(solidColor.type, GL_FLOAT_VEC4);
        assert.equal(solidColor.unitType, GL_FLOAT);

        program.clean();
      });
    });
  });

  describe('value', () => {
    it('simple shader', () => {
      let canvas = document.createElement('canvas');
      let gl = canvas.getContext('webgl');

      return ShaderProgram.createProgram(gl, SIMPLE_OPTS)
      .then(program => {
        program.enable();

        // float
        let opacity = program.uniforms['opacity'];
        opacity.value = 0.5;
        assert.deepEqual(opacity.value, 0.5);

        // bool
        let useTex = program.uniforms['useTex'];
        useTex.value = true;
        assert.isTrue(useTex.value);
        useTex.value = false;
        assert.isFalse(useTex.value);

        // vec
        let solidColor = program.uniforms['solidColor'];
        solidColor.value = [1, 0.5, 0, 0.8]; // semi-transparent orange
        assert.vecApproximately(Array.from(solidColor.value),
          [1, 0.5, 0, 0.8], 0.00001);

        // mat
        let mvpTrans = program.uniforms['mvpTrans'];
        mvpTrans.value = mat4.identity([]);
        assert.vecApproximately(Array.from(mvpTrans.value),
          [ 1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1], 0.00001);

        program.clean();
      });
    });
  });


});
