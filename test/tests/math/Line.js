'use strict';

var assert = chai.assert;

describe('KraGL.math.Line', function() {

  describe('constructor', function() {
    it('normal case', function() {
      var line = new KraGL.math.Line({
        p1: [1,2,3],
        p2: [5,6,7]
      });
      assert.vecApproximately(line.p1, [1,2,3,1], 0.0001);
      assert.vecApproximately(line.p2, [5,6,7,1], 0.0001);
    });
    it('bad case - same endpoints', function() {
      assert.throws(function() {
        new KraGL.math.Line({
          p1: [1,2,3],
          p2: [1,2,3]
        });
      });
    });
  });

  describe('point1', function() {
    it('normal case', function() {
      var line = new KraGL.math.Line({
        p1: [1,2,3],
        p2: [5,6,7]
      });

      assert.vecApproximately(line.p1, [1,2,3,1], 0.0001);
      assert.vecApproximately(line.point1, [1,2,3,1], 0.0001);

      line.point1 = [2,3,4];
      assert.vecApproximately(line.p1, [2,3,4,1], 0.0001);
      assert.vecApproximately(line.point1, [2,3,4,1], 0.0001);

      line.p1 = [3,4,5];
      assert.vecApproximately(line.p1, [3,4,5,1], 0.0001);
      assert.vecApproximately(line.point1, [3,4,5,1], 0.0001);
    });
    it('bad case - same endpoints', function() {
      assert.throws(function() {
        var line = new KraGL.math.Line({
          p1: [1,2,3],
          p2: [5,6,7]
        });

        line.p1 = [5,6,7];
      });
    });
  });

  describe('point2', function() {
    it('normal case', function() {
      var line = new KraGL.math.Line({
        p1: [1,2,3],
        p2: [5,6,7]
      });

      assert.vecApproximately(line.p2, [5,6,7,1], 0.0001);
      assert.vecApproximately(line.point2, [5,6,7,1], 0.0001);

      line.point2 = [2,3,4];
      assert.vecApproximately(line.p2, [2,3,4,1], 0.0001);
      assert.vecApproximately(line.point2, [2,3,4,1], 0.0001);

      line.p2 = [3,4,5];
      assert.vecApproximately(line.p2, [3,4,5,1], 0.0001);
      assert.vecApproximately(line.point2, [3,4,5,1], 0.0001);
    });
    it('bad case - same endpoints', function() {
      assert.throws(function() {
        var line = new KraGL.math.Line({
          p1: [1,2,3],
          p2: [5,6,7]
        });

        line.p2 = [1,2,3];
      });
    });
  });

  describe('quaternion', function() {
    it('normal case', function() {
      var line = new KraGL.math.Line({
        p1: [1,1,1],
        p2: [2,3,4]
      });

      var q = line.quaternion;
      var pt = [1,0,0,1];
      pt = vec4.transformQuat([], pt, q);
      var expected = vec3.normalize([], [1,2,3]);
      expected[3] = 1;
      assert.vecApproximately(pt, expected, 0.0001);

      // Alias test
      var q = line.quat;
      var pt = [1,0,0,1];
      pt = vec4.transformQuat([], pt, q);
      var expected = vec3.normalize([], [1,2,3]);
      expected[3] = 1;
      assert.vecApproximately(pt, expected, 0.0001);
    });
  });

  describe('vector', function() {
    it('normal case', function() {
      var line = new KraGL.math.Line({
        p1: [1,1,1],
        p2: [2,3,4]
      });

      assert.vecApproximately(line.vector, [1,2,3], 0.0001);
      assert.vecApproximately(line.vec, [1,2,3], 0.0001);

      line.vector = [2,0,0];
      assert.vecApproximately(line.vec, [2,0,0], 0.0001);
      assert.vecApproximately(line.p2, [3,1,1,1], 0.0001);

      line.vec = [1,1,1];
      assert.vecApproximately(line.p2, [2,2,2,1], 0.0001);
    });
  });

});
