'use strict';

describe('KraGL.geo.Mesh', () => {
  const assert = chai.assert;
  const Mesh = KraGL.geo.Mesh;
  const Vertex = KraGL.geo.Vertex;

  describe('constructor', () => {
    it('fully specified', () => {
      let mesh = new Mesh({
        vertices: [
          new Vertex({ xyz: [1,1,0] }),
          new Vertex({ xyz: [1,-1,0] }),
          new Vertex({ xyz: [-1,-1,0] }),
          new Vertex({ xyz: [-1,-2,0] })
        ],
        indices: [0,1,2,3,0],
        cullMode: GL_FRONT,
        drawMode: GL_TRIANGLE_STRIP,
        frontFace: GL_CW
      });
      assert.vecApproximately(mesh.vertices[0].xyz, [1,1,0,1], 0.00001);
      assert.vecApproximately(mesh.vertices[1].xyz, [1,-1,0,1], 0.00001);
      assert.vecApproximately(mesh.vertices[2].xyz, [-1,-1,0,1], 0.00001);
      assert.vecApproximately(mesh.vertices[3].xyz, [-1,-2,0,1], 0.00001);

      assert.deepEqual(mesh.indices, [0,1,2,3,0]);
      assert.equal(mesh.cullMode, GL_FRONT);
      assert.equal(mesh.drawMode, GL_TRIANGLE_STRIP);
      assert.equal(mesh.frontFace, GL_CW);
    });

    it('minimally specified', () => {
      let mesh = new Mesh({
        vertices: [
          new Vertex({ xyz: [0,0,0] }),
          new Vertex({ xyz: [1,0,0] }),
          new Vertex({ xyz: [1,1,0] }),
          new Vertex({ xyz: [0,1,0] })
        ],
        indices: [0,1,2, 2,3,0]
      });
      assert.vecApproximately(mesh.vertices[0].xyz, [0,0,0,1], 0.00001);
      assert.vecApproximately(mesh.vertices[1].xyz, [1,0,0,1], 0.00001);
      assert.vecApproximately(mesh.vertices[2].xyz, [1,1,0,1], 0.00001);
      assert.vecApproximately(mesh.vertices[3].xyz, [0,1,0,1], 0.00001);

      assert.deepEqual(mesh.indices, [0,1,2, 2,3,0]);
      assert.equal(mesh.cullMode, GL_FRONT_AND_BACK);
      assert.equal(mesh.drawMode, GL_TRIANGLES);
      assert.equal(mesh.frontFace, GL_CCW);
    });
  });

  describe('centroid', () => {
    it('normal', () => {
      let mesh = new Mesh({
        vertices: [
          new Vertex({ xyz: [0,0,0] }),
          new Vertex({ xyz: [1,0,0] }),
          new Vertex({ xyz: [1,1,0] }),
          new Vertex({ xyz: [0,1,0] })
        ],
        indices: [0,1,2, 2,3,0]
      });
      assert.vecApproximately(mesh.centroid, [0.5, 0.5, 0, 1], 0.00001);
    });
  });

  describe('clone', () => {
    it('normal', () => {
      let mesh = new Mesh({
        vertices: [
          new Vertex({ xyz: [0,0,0] }),
          new Vertex({ xyz: [1,0,0] }),
          new Vertex({ xyz: [1,1,0] }),
          new Vertex({ xyz: [0,1,0] })
        ],
        indices: [0,1,2, 2,3,0]
      });
      let clone = mesh.clone();
      assert.vecApproximately(clone.vertices[0].xyz, [0,0,0,1], 0.00001);
      assert.vecApproximately(clone.vertices[1].xyz, [1,0,0,1], 0.00001);
      assert.vecApproximately(clone.vertices[2].xyz, [1,1,0,1], 0.00001);
      assert.vecApproximately(clone.vertices[3].xyz, [0,1,0,1], 0.00001);

      assert.deepEqual(clone.indices, [0,1,2, 2,3,0]);
      assert.equal(clone.cullMode, GL_FRONT_AND_BACK);
      assert.equal(clone.drawMode, GL_TRIANGLES);
      assert.equal(clone.frontFace, GL_CCW);
    });
  });

  describe('transform', () => {
    it('normal', () => {
      let mesh1 = new Mesh({
        vertices: [
          new Vertex({ xyz: [0,0,0] }),
          new Vertex({ xyz: [1,0,0] }),
          new Vertex({ xyz: [1,1,0] }),
          new Vertex({ xyz: [0,1,0] })
        ],
        indices: [0,1,2, 2,3,0]
      });
      let m = mat4.create();
      m = mat4.mul([], m, mat4.fromScaling([], [0.5,0.5,0.5]));
      m = mat4.mul([], m, mat4.fromRotation([], KraGL.math.TAU/4, [1,0,0]));
      let mesh2 = mesh1.transform(m);
      assert.vecApproximately(mesh2.vertices[0].xyz, [0,0,0,1], 0.00001);
      assert.vecApproximately(mesh2.vertices[1].xyz, [0.5,0,0,1], 0.00001);
      assert.vecApproximately(mesh2.vertices[2].xyz, [0.5,0,0.5,1], 0.00001);
      assert.vecApproximately(mesh2.vertices[3].xyz, [0,0,0.5,1], 0.00001);

      assert.vecApproximately(mesh2.vertices[0].n, [0,-0.5,0], 0.00001);
      assert.vecApproximately(mesh2.vertices[0].t, [0.5,0,0], 0.00001);
    });
  });
});
