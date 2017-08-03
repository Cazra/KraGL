'use strict';

var assert = chai.assert;

describe('KraGL.math.Triangle', function() {
  describe('constructor', function() {
    it('normal case', function() {
      var tri = new KraGL.math.Triangle({
        p1: [1,1,1],
        p2: [-2,4,8],
        p3: [3,9,-5]
      });

      assert.deepEqual(tri.p1, [1,1,1,1]);
      assert.deepEqual(tri.p2, [-2,4,8,1]);
      assert.deepEqual(tri.p3, [3,9,-5,1]);
    });
    it('vector case', function() {
      var tri = new KraGL.math.Triangle({
        p: [1,1,1],
        u: [0,1,2],
        v: [3,4,5]
      });

      assert.deepEqual(tri.p1, [1,1,1,1]);
      assert.deepEqual(tri.p2, [1,2,3,1]);
      assert.deepEqual(tri.p3, [4,5,6,1]);
    });
  });

  describe('normal', function() {
    it('get/set - normal', function() {
      var tri = new KraGL.math.Triangle({
        p1: [1,0,1],
        p2: [2,0,4],
        p3: [3,0,2]
      });
      var expected = [0,1,0];
      var sin = vec3.length(vec3.cross([], tri.n, expected));
      assert.approximately(sin, 0, 0.00001);
    });
  });

  describe('approx', function() {
    it('normal case', function() {
      var a = new KraGL.math.Triangle({
        p1: [1,2,3],
        p2: [4,5,6],
        p3: [7,8,9]
      });
      var b = new KraGL.math.Triangle({
        p1: [1,2,3],
        p2: [4,5,6],
        p3: [7,8,9]
      });
      assert.isTrue(a.approx(b));

      b = new KraGL.math.Triangle({
        p1: [2,2,3],
        p2: [3,5,6],
        p3: [6,8,9]
      });
      assert.isFalse(a.approx(b));

      b = new KraGL.math.Triangle({
        p3: [1,2,3],
        p1: [4,5,6],
        p2: [7,8,9]
      });
      assert.isTrue(a.approx(b));

      b = new KraGL.math.Triangle({
        p2: [1,2,3],
        p3: [4,5,6],
        p1: [7,8,9]
      });
      assert.isTrue(a.approx(b));
    });
  });

  describe('clone', function() {
    it('normal case', function() {
      var a = new KraGL.math.Triangle({
        p1: [1,1,1],
        p2: [-2,4,8],
        p3: [3,9,-5]
      });
      var b = a.clone();

      assert.isTrue(a !== b);
      assert.deepEqual(b.p1, [1,1,1,1]);
      assert.deepEqual(b.p2, [-2,4,8,1]);
      assert.deepEqual(b.p3, [3,9,-5,1]);
    });
  });

  describe('distanceTo', function() {
    it('point', function() {
      var tri = new KraGL.math.Triangle({
        p1: [1,0,0],
        p2: [-1,0,1],
        p3: [-1,0,-1]
      });

      var p = [0, 3, 0, 1];
      var expected = 3;
      var actual = tri.dist(p);
      assert.approximately(actual, expected, 0.0001);

      p = [0, -3, 0, 1];
      expected = 3;
      actual = tri.dist(p);
      assert.approximately(actual, expected, 0.0001);

      p = [5, 0, 0, 1];
      expected = 4;
      actual = tri.dist(p);
      assert.approximately(actual, expected, 0.0001);
    });
  });
});
