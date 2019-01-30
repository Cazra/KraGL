'use strict';

describe('KraGL.shaders.ShaderProgram', () => {
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
      vertexTexCoords: 'uv'
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

  describe('static createProgram, clean', () => {
    it('simple shader', () => {
      let canvas = document.createElement('canvas');
      let gl = canvas.getContext('webgl');

      return ShaderProgram.createProgram(gl, SIMPLE_OPTS)
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

      return ShaderProgram.createProgram(gl, SIMPLE_OPTS)
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

      return ShaderProgram.createProgram(gl, SIMPLE_OPTS)
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

  describe('getPropertyUniform', () => {
    it('simple shader', () => {
      let canvas = document.createElement('canvas');
      let gl = canvas.getContext('webgl');

      return ShaderProgram.createProgram(gl, SIMPLE_OPTS)
      .then(program => {
        let uniform = program.getPropertyUniform('texture');
        assert.equal(uniform.name, 'tex');
        program.clean();
      });
    });
  });
});
