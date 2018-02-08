'use strict';

describe('KraGL.shaders.ShaderProgram', () => {
  const assert = chai.assert;
  const ShaderProgram = KraGL.shaders.ShaderProgram;

  describe('static createProgram, clean', () => {
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
        assert.isDefined(program);
        program.clean();
      });
    });
  });

  describe('attributes, uniforms', () => {
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
        assert.isDefined(program.attributes['vertexNormal']);
        assert.isDefined(program.attributes['vertexTexCoords']);
        assert.isDefined(program.attributes['vertexPos']);

        assert.isDefined(program.uniforms['mvpTrans']);
        assert.isDefined(program.uniforms['normalTrans']);
        assert.isDefined(program.uniforms['fogColor']);
        assert.isDefined(program.uniforms['fogEquation']);
        assert.isDefined(program.uniforms['fogDensity']);
        assert.isDefined(program.uniforms['solidColor']);
        assert.isDefined(program.uniforms['tex']);
        assert.isDefined(program.uniforms['useTex']);
        assert.isDefined(program.uniforms['opacity']);

        program.clean();
      });
    });
  });

  describe('enable, disable', () => {
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
        assert.isFalse(program.attributes['vertexNormal'].isEnabled);
        program.enable();
        assert.isTrue(program.attributes['vertexNormal'].isEnabled);
        program.disable();
        assert.isFalse(program.attributes['vertexNormal'].isEnabled);

        program.clean();
      });
    });
  });
});
