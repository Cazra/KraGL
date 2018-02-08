'use strict';

describe('KraGL.shaders.Attributes', () => {
  const assert = chai.assert;
  const ShaderProgram = KraGL.shaders.ShaderProgram;

  describe('unbound properties', () => {
    it('simple shader', () => {
      let canvas = document.createElement('canvas');
      let gl = canvas.getContext('webgl');

      return ShaderProgram.createProgram(gl, {
        vert: {
          urls: ['../shaders/old/simple.vert']
        },
        frag: {
          urls: ['../shaders/old/simple.frag']
        }
      })
      .then(program => {
        let attr = program.attributes['vertexNormal'];
        assert.isFalse(attr.isArray);
        assert.equal(attr.arraySize, 4);
        assert.equal(attr.arrayType, GL_FLOAT);

        assert.isFalse(attr.isBuiltIn);
        assert.equal(attr.length, 1);
        assert.isNumber(attr.location);
        assert.equal(attr.name, 'vertexNormal');

        assert.equal(attr.sizeBytes, 12); // 4(GL_FLOAT) * 3(size)
        assert.equal(attr.sizeUnits, 3);
        assert.equal(attr.type, GL_FLOAT_VEC3);
        assert.equal(attr.unitType, GL_FLOAT);

        program.clean();
      });
    });
  });

  describe('enable, disable, isEnabled', () => {
    it('simple shader', () => {
      let canvas = document.createElement('canvas');
      let gl = canvas.getContext('webgl');

      return ShaderProgram.createProgram(gl, {
        vert: {
          urls: ['../shaders/old/simple.vert']
        },
        frag: {
          urls: ['../shaders/old/simple.frag']
        }
      })
      .then(program => {
        let attr = program.attributes['vertexNormal'];
        assert.isFalse(attr.isEnabled);
        attr.enable();
        assert.isTrue(attr.isEnabled);
        attr.disable();
        assert.isFalse(attr.isEnabled);

        program.clean();
      });
    });
  });

  describe('bind, bound properties', () => {
    it('simple shader', () => {
      let canvas = document.createElement('canvas');
      let gl = canvas.getContext('webgl');

      return ShaderProgram.createProgram(gl, {
        vert: {
          urls: ['../shaders/old/simple.vert']
        },
        frag: {
          urls: ['../shaders/old/simple.frag']
        }
      })
      .then(program => {
        let vertNorm = program.attributes['vertexNormal'];
        let vertPos = program.attributes['vertexPos'];
        let vertTex = program.attributes['vertexTexCoords'];

        // Create a VBO.
        let buffer = gl.createBuffer();
        gl.bindBuffer(GL_ARRAY_BUFFER, buffer);
        let stride = vertNorm.sizeBytes + vertPos.sizeBytes +
          vertTex.sizeBytes;
        let offset = 0;

        // Bind the attrs.
        _.each([vertNorm, vertPos, vertTex], attr => {
          attr.bind(stride, offset);
          offset += attr.sizeBytes;
        });

        assert.equal(vertNorm.bufferBinding, buffer);
        assert.equal(vertPos.bufferBinding, buffer);
        assert.equal(vertTex.bufferBinding, buffer);

        assert.equal(vertNorm.offset, 0);
        assert.equal(vertPos.offset, 3*4);
        assert.equal(vertTex.offset, 7*4);

        assert.equal(vertNorm.stride, 36);
        assert.equal(vertPos.stride, 36);
        assert.equal(vertTex.stride, 36);

        assert.isFalse(vertNorm.isNormalized);
        assert.isFalse(vertPos.isNormalized);
        assert.isFalse(vertTex.isNormalized);

        gl.deleteBuffer(buffer);
        program.clean();
      });
    });
  });

});
