'use strict';

var assert = chai.assert;

describe('KraGL.math.Vectors', function() {

  describe('parallel', function() {
    it('normal case', function() {
      assert(KraGL.math.Vectors.parallel([1,1,1], [2,2,2]));
      assert(KraGL.math.Vectors.parallel([1,2,1], [1,2,1]));
      assert(KraGL.math.Vectors.parallel([1,1,1], [-2,-2,-2]));
      assert(KraGL.math.Vectors.parallel([1,1,1], [-2,-2,-2]));

      assert(!KraGL.math.Vectors.parallel([1,1,1], [-1,1,1]));
      assert(!KraGL.math.Vectors.parallel([1,2,3], [3,2,1]));
    });
  });

  describe('reflect', function() {
    it('normal case', function() {
      var uHat = vec3.normalize([], [-1, -1, -1]);
      var nHat = [0,1,0];

      var reflected = KraGL.math.Vectors.reflect(uHat, nHat);
      var expected = vec3.normalize([], [-1,1,-1]);
      assert.vecApproximately(reflected, expected, 0.0001);
    });
  });

  describe('refract', function() {
    it('orthogonal incident angle', function() {
      var nAir = 1.0;
      var nWater = 1.333;

      var uHat = [0, -1, 0];
      var nHat = [0, 1, 0];
      var eta = nAir/nWater; // air to water
      var refracted = KraGL.math.Vectors.refract(uHat, nHat, eta);
      assert.vecApproximately(refracted, uHat, 0.0001);
    });
    it('air/vacuum', function() {
      var uHat = vec3.normalize([], [-1, -1, -1]);
      var nHat = [0,1,0];
      var eta = 1;
      var refracted = KraGL.math.Vectors.refract(uHat, nHat, eta);
      assert.vecApproximately(refracted, uHat, 0.0001);
    });
    it('water', function() {
      var nAir = 1.0;
      var nWater = 1.333;

      var uHat = vec3.normalize([], [-1, -1, 0]);
      var nHat = [0,1,0];
      var eta = nAir/nWater;

      var refracted = KraGL.math.Vectors.refract(uHat, nHat, eta);

      // Using Snell's Law to find the expected angle of refraction.
      // From that, we can find the expected vector.
      var refractedAngle = -Math.PI/2 - Math.asin(eta*Math.sin(Math.atan2(1,1)));
      var expected = [
        Math.cos(refractedAngle),
        Math.sin(refractedAngle),
        0
      ];

      assert.vecApproximately(refracted, expected, 0.0001);
    });
  });

  describe('scalarProjection', function() {
    it('normal case', function() {
      var u = [5, 0];
      var v = [2, 2];
      var sProj = KraGL.math.Vectors.scalarProjection(u, v);
      assert.approximately(sProj, 2, 0.001);

      var u = [5, 0, 0];
      var v = [2, 2, 2];
      var sProj = KraGL.math.Vectors.scalarProjection(u, v);
      assert.approximately(sProj, 2, 0.001);

      var u = [5, 0, 0, 0];
      var v = [2, 2, 2, 2];
      var sProj = KraGL.math.Vectors.scalarProjection(u, v);
      assert.approximately(sProj, 2, 0.001);
    });
  });

  describe('slerp', function() {
    it('normal case', function() {
      var u = [4,0,0];
      var v = [0,6,0];
      var slerped = KraGL.math.Vectors.slerp(u, v, 0.5);
      var expected = vec3.scale([], vec3.normalize([], [1,1,0]), 5);
      assert.vecApproximately(slerped, expected, 0.0001);
    });
    it('parallel vectors', function() {
      var u = [2, 0, 0];
      var v = [4, 0, 0];
      var slerped = KraGL.math.Vectors.slerp(u, v, 0.5);
      var expected = [3, 0, 0];
      assert.vecApproximately(slerped, expected, 0.0001);
    });
  });
});
