'use strict';

var assert = chai.assert;

describe('KraGL.math.Quaternions', function() {

  describe('orient', function() {
    it('normal case', function() {
      var startBasis = [
        [1,0,0],
        [0,1,0],
        [0,0,1]
      ];
      var endBasis = [
        [1,-1,0],
        [1, 1,0],
        [0, 0,1]
      ];

      var pt = [1,0,0,1];
      var q = KraGL.math.Quaternions.orient(startBasis, endBasis);
      pt = vec4.transformQuat([], pt, q);

      var expected = [1/Math.sqrt(2), -1/Math.sqrt(2), 0, 1];
      assert.vecApproximately(pt, expected, 0.0001);
    });

    it('default start basis', function() {
      var endBasis = [
        [1,-1,0],
        [1, 1,0],
        [0, 0,1]
      ];

      var pt = [1,0,0,1];
      var q = KraGL.math.Quaternions.orient(endBasis);
      pt = vec4.transformQuat([], pt, q);

      var expected = [1/Math.sqrt(2), -1/Math.sqrt(2), 0, 1];
      assert.vecApproximately(pt, expected, 0.0001);
    });
  });

  describe('rotate', function() {
    it('normal case', function() {
      var u = [1,0,0];
      var v = vec3.normalize([], [-2,3,4]);

      var q = KraGL.math.Quaternions.rotate(u, v);
      var w = vec3.transformQuat([], u, q);

      assert.vecApproximately(w, v, 0.0001);
    });
  });

});
