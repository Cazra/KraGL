'use strict';

var assert = chai.assert;

describe('KraGL.math.Transforms', function() {

  describe('changeOfBasis', function() {
    it('normal case', function() {
      var v = [0.5, 0.5, 0.5];

      var xAxis = [0, -1, 0];
      var yAxis = [0, 0, 1];
      var zAxis = [-1, 0, 0];
      var m = KraGL.math.Transforms.changeOfBasis(xAxis, yAxis, zAxis);
      v = vec3.transformMat3([], v, m);

      assert.vecApproximately(v, [-0.5, -0.5, 0.5], 0.0001);
    });
  });

  describe('rotatePt', function() {
    it('normal case', function() {
      var pt = [2, 2, 1, 1];
      var axis = [0, 0, 1];
      var rotated = KraGL.math.Transforms.rotatePt(pt, axis, 0);
      var expected = [2, 2, 1, 1];
      assert.vecApproximately(rotated, expected, 0.0001);

      var pt = [2, 2, 1, 1];
      var axis = [0, 0, 1];
      var rotated = KraGL.math.Transforms.rotatePt(pt, axis, Math.PI/4);
      var expected = [0, Math.sqrt(8), 1, 1];
      assert.vecApproximately(rotated, expected, 0.0001);

      pt = [0, 4, 0, 1];
      axis = vec3.normalize([], [1,0,1]);
      rotated = KraGL.math.Transforms.rotatePt(pt, axis, Math.PI/2);

      expected = [-Math.sqrt(8), 0, Math.sqrt(8), 1];
      assert.vecApproximately(rotated, expected, 0.0001);
    });

    it('bad case - 0 vector', function() {
      var pt = [2, 2, 1, 1];
      var axis = [0, 0, 0];
      var rotated = KraGL.math.Transforms.rotatePt(pt, axis, Math.PI/4);
      var expected = [NaN, NaN, NaN, 1];
      assert.vecApproximately(rotated, expected, 0.0001);
    });
  });

  describe('rotatePt2D', function() {
    it('normal case', function() {
      var pt = [2, 2, 1];
      var rotated = KraGL.math.Transforms.rotatePt2D(pt, Math.PI/4);
      var expected = [0, Math.sqrt(8), 1];
      assert.vecApproximately(rotated, expected, 0.0001);
    });
  });

  describe('scalePt', function() {
    it('normal case', function() {
      var pt = [2,3,4,1];
      var scaled = KraGL.math.Transforms.scalePt(pt, [1,2,3]);
      assert.vecApproximately(scaled, [2,6,12,1], 0.0001);
    });
    it('uniform scale', function() {
      var pt = [2,3,4,1];
      var scaled = KraGL.math.Transforms.scalePt(pt, 2);
      assert.vecApproximately(scaled, [4,6,8,1], 0.0001);
    });
  });

  describe('scalePt2D', function() {
    it('normal case', function() {
      var pt = [2,3,1];
      var scaled = KraGL.math.Transforms.scalePt2D(pt, [1,2]);
      assert.vecApproximately(scaled, [2,6,1], 0.0001);
    });
    it('uniform scale', function() {
      var pt = [2,3,1];
      var scaled = KraGL.math.Transforms.scalePt2D(pt, 3);
      assert.vecApproximately(scaled, [6,9,1], 0.0001);
    });
  });

  describe('translatePt', function() {
    it('normal case', function() {
      var pt = KraGL.math.Transforms.translatePt([1,1,1,1], [1,2,3]);
      var expected = [2,3,4,1];
      assert.vecApproximately(pt, expected, 0.0001);
    });
  });

  describe('translatePt2D', function() {
    it('normal case', function() {
      var pt = KraGL.math.Transforms.translatePt2D([1,1,1], [2,3]);
      var expected = [3,4,1];
      assert.vecApproximately(pt, expected, 0.0001);
    });
  });

});
