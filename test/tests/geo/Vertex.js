'use strict';

describe('KraGL.geo.Vertex', () => {
  const assert = chai.assert;
  const Vertex = KraGL.geo.Vertex;
  const Color = KraGL.materials.Color;

  describe('constructor', () => {
    it('fully specified', () => {
      let vert = new Vertex({
        xyz: [1,2,3],
        n: [0,0,1],
        t: [1,0,0],
        texST: [0.3, 0.2],
        color: new Color({ hex: 0xFFFFAAAA })
      });
      assert.vecApproximately(vert.xyz, [1,2,3,1], 0.00001);
      assert.vecApproximately(vert.n, [0,0,1], 0.000001);
      assert.vecApproximately(vert.t, [1,0,0], 0.000001);
      assert.vecApproximately(vert.texST, [0.3, 0.2], 0.000001);
      assert.equal(vert.color.hex, 0xFFFFAAAA);
    });

    it('minimally specified', () => {
      let vert = new Vertex({
        xyz: [1,2,3]
      });
      assert.vecApproximately(vert.xyz, [1,2,3,1], 0.00001);
      assert.vecApproximately(vert.n, [0,0,1], 0.000001);
      assert.vecApproximately(vert.t, [1,0,0], 0.000001);
      assert.vecApproximately(vert.texST, [0, 0], 0.000001);
      assert.equal(vert.color.hex, 0xFFFFFFFF);
    });
  });

  describe('clone', () => {
    it('normal', () => {
      let vert = new Vertex({
        xyz: [1,2,3],
        n: [0,0,1],
        t: [1,0,0],
        texST: [0.3, 0.2],
        color: new Color({ hex: 0xFFFFAAAA })
      });
      let clone = vert.clone();

      assert.vecApproximately(clone.xyz, [1,2,3,1], 0.00001);
      assert.vecApproximately(clone.n, [0,0,1], 0.000001);
      assert.vecApproximately(clone.t, [1,0,0], 0.000001);
      assert.vecApproximately(clone.texST, [0.3, 0.2], 0.000001);
      assert.equal(clone.color.hex, 0xFFFFAAAA);
    });
  });

  describe('transform', () => {
    it('normal', () => {
      let m = mat4.create();
      m = mat4.mul([], m, mat4.fromTranslation([], [1,2,3]));
      m = mat4.mul([], m, mat4.fromRotation([], KraGL.math.TAU/4, [0,0,1]));

      let vert1 = new Vertex({
        xyz: [50, 20, 5],
        n: [1,0,1],
        t: [1,0,-1],
        color: new Color({ hex: 0xFFAABBCC }),
        texST: [0.1, 0.2]
      });
      let vert2 = vert1.transform(m);
      assert.vecApproximately(vert2.xyz, [-19, 52, 8, 1], 0.00001);
      assert.vecApproximately(vert2.n, [0,1,1], 0.000001);
      assert.vecApproximately(vert2.t, [0,1,-1], 0.000001);
      assert.equal(vert2.color.hex, 0xFFAABBCC);
      assert.vecApproximately(vert2.texST, [0.1, 0.2], 0.000001);
    });
  });
});
