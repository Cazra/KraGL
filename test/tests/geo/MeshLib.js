'use strict';

describe('KraGL.geo.MeshLib', () => {
  const assert = chai.assert;
  const Mesh = KraGL.geo.Mesh;
  const MeshLib = KraGL.geo.MeshLib;

  const UNIT_SQUARE = {
    vertices: [
      { xyz: [0,0,0] },
      { xyz: [1,0,0] },
      { xyz: [1,1,0] },
      { xyz: [0,1,0] }
    ],
    indices: [0,1,2, 2,3,0]
  };

  const WEIRD_POLY = {
    vertices: [
      { xyz: [1,1,0] },
      { xyz: [1,-1,0] },
      { xyz: [-1,-1,0] },
      { xyz: [-1,-2,0] }
    ],
    indices: [0,1,2,3,0],
    cullMode: GL_FRONT,
    drawMode: GL_TRIANGLE_STRIP,
    frontFace: GL_CW
  };

  describe('add, has, get, size', () => {
    it('normal', () => {
      let canvas = document.createElement('canvas');
      let gl = canvas.getContext('webgl');

      let meshLib = new MeshLib(gl);
      assert.isFalse(meshLib.has('unitSquare'));

      return Promise.all([
        new Mesh(UNIT_SQUARE),
        new Mesh(WEIRD_POLY)
      ])
      .then(meshes => {
        meshLib.add('unitSquare', meshes[0]);
        meshLib.add('weirdPoly', meshes[1]);

        assert.isTrue(meshLib.has('unitSquare'));
        assert.isTrue(meshLib.has('weirdPoly'));
        assert.isFalse(meshLib.has('unitCube'));

        assert.equal(meshLib.get('unitSquare'), meshes[0]);
        assert.equal(meshLib.get('weirdPoly'), meshes[1]);

        assert.equal(meshLib.size, 2);
      })
      .then(() => {
        meshLib.clean();
        assert.equal(meshLib.size, 0);
      });
    });

    it('duplicate', () => {
      let canvas = document.createElement('canvas');
      let gl = canvas.getContext('webgl');

      let meshLib = new MeshLib(gl);

      return Promise.all([
        new Mesh(UNIT_SQUARE),
        new Mesh(WEIRD_POLY)
      ])
      .then(meshes => {
        assert.throws(() => {
          meshLib.add('myMesh', meshes[0]);
          meshLib.add('myMesh', meshes[1]);
        }, KraGL.geo.GeometryError);
      })
      .then(() => {
        meshLib.clean();
      });
    });

    it('get DNE', () => {
      let canvas = document.createElement('canvas');
      let gl = canvas.getContext('webgl');

      let meshLib = new MeshLib(gl);

      return Promise.all([
        new Mesh(UNIT_SQUARE),
        new Mesh(WEIRD_POLY)
      ])
      .then(meshes => {
        assert.throws(() => {
          meshLib.add('unitSquare', meshes[0]);
          meshLib.add('weirdPoly', meshes[1]);

          meshLib.get('Hello. I am Error.');
        }, KraGL.geo.GeometryError);
      })
      .then(() => {
        meshLib.clean();
      });
    });
  });

  describe('remove', () => {
    it('unrendered', () => {
      let canvas = document.createElement('canvas');
      let gl = canvas.getContext('webgl');

      let meshLib = new MeshLib(gl);

      return Promise.all([
        new Mesh(UNIT_SQUARE),
        new Mesh(WEIRD_POLY)
      ])
      .then(meshes => {
        meshLib.add('unitSquare', meshes[0]);
        meshLib.add('weirdPoly', meshes[1]);

        assert.equal(meshLib.size, 2);
        assert.isTrue(meshLib.has('unitSquare'));
        assert.isTrue(meshLib.has('weirdPoly'));

        meshLib.remove('unitSquare');

        assert.equal(meshLib.size, 1);
        assert.isFalse(meshLib.has('unitSquare'));
        assert.isTrue(meshLib.has('weirdPoly'));
      })
      .then(() => {
        meshLib.clean();
      });
    });
  });
});
