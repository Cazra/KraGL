'use strict';

var assert = chai.assert;

describe('KraGL.Math', function() {

  describe('approx', function() {
    it('normal case', function() {
      assert.isTrue(KraGL.Math.approx(12.99999999, 13, 0.0001));
      assert.isFalse(KraGL.Math.approx(12.95, 12, 0.0001));

      assert.isTrue(KraGL.Math.approx(-4.5000001, -4.5, 0.0001));
      assert.isFalse(KraGL.Math.approx(-4.54, -4.5, 0.0001));

      assert.isTrue(KraGL.Math.approx(1e-10, 0, 0.0001));
      assert.isFalse(KraGL.Math.approx(1e-2, 0, 1e-4));

      assert.isTrue(KraGL.Math.approx(3, 3));
      assert.isFalse(KraGL.Math.approx(1, 2));
    });
    it('bad case - NaN', function() {
      assert.isFalse(KraGL.Math.approx(undefined, 0, 0.0001));
      assert.isFalse(KraGL.Math.approx(undefined, 10, 0.0001));
      assert.isFalse(KraGL.Math.approx(0, undefined, 0.0001));
      assert.isFalse(KraGL.Math.approx(2, undefined, 0.0001));
      assert.isFalse(KraGL.Math.approx(2.00001, 2, undefined));
    });
    it('bad case - negative tolerance', function() {
      assert.throws(function() {
        KraGL.Math.approx(12.00001, 12, -0.0001)
      });
    });
  });

  describe('cartesian', function() {
    it('normal case', function() {
      var cart = KraGL.Math.cartesian([0,0,0]);
      var expected = [0,0,0,1];
      assert.vecApproximately(cart, expected, 0.001);

      cart = KraGL.Math.cartesian([5, 0, 0]);
      expected = [0,0,5,1];
      assert.vecApproximately(cart, expected, 0.001);

      cart = KraGL.Math.cartesian([4, Math.PI/4, Math.PI/2]);
      expected = vec3.scale([], vec3.normalize([], [1,1,0]), 4);
      expected[3] = 1;
      assert.vecApproximately(cart, expected, 0.001);

      cart = KraGL.Math.cartesian([4, 0, Math.PI/4]);
      expected = vec3.scale([], vec3.normalize([], [1,0,1]), 4);
      expected[3] = 1;
      assert.vecApproximately(cart, expected, 0.001);
    });
  });

  describe('clamp', function() {
    it('normal case', function() {
      assert.equal(KraGL.Math.clamp(10,0,5), 5);
      assert.equal(KraGL.Math.clamp(-5,-2,5), -2);
      assert.equal(KraGL.Math.clamp(2,-5,5), 2);
    });
    it('bad case - NaN', function() {
      assert.isNaN(KraGL.Math.clamp(1, 0, undefined));
      assert.isNaN(KraGL.Math.clamp(1, undefined, 10));
      assert.isNaN(KraGL.Math.clamp(undefined, 0, 2));
      assert.isNaN(KraGL.Math.clamp(42, 'hello', 'world'));
    });
  });

  describe('degrees', function() {
    it('normal case', function() {
      assert.approximately(KraGL.Math.degrees(0), 0, 0.001);
      assert.approximately(KraGL.Math.degrees(Math.PI/2), 90, 0.001);
      assert.approximately(KraGL.Math.degrees(Math.PI), 180, 0.001);
      assert.approximately(KraGL.Math.degrees(2*Math.PI), 360, 0.001);
      assert.approximately(KraGL.Math.degrees(4*Math.PI), 720, 0.001);
      assert.approximately(KraGL.Math.degrees(-Math.PI), -180, 0.001);
    });
    it('bad case - NaN', function() {
      assert.isNaN(KraGL.Math.degrees(undefined));
    });
  });


  describe('fract', function() {
    it('normal case', function() {
      assert.approximately(KraGL.Math.fract(3.1415), 0.1415, 0.000001);
      assert.approximately(KraGL.Math.fract(42), 0, 0.000001);
      assert.approximately(KraGL.Math.fract(-8.3), 0.7, 0.000001);
    });
    it('bad case - NaN', function() {
      assert.isNaN(KraGL.Math.fract(undefined));
    });
  });

  describe('linearMap', function() {
    it('normal case', function() {
      assert.approximately(KraGL.Math.linearMap(1, [0,2], [2,12]), 7, 0.0001);
    });
    it('bad case - x=NaN', function() {
      assert.isNaN(KraGL.Math.linearMap(undefined, [0,2], [2,12]));
    });
    it('bad case - NaN domain', function() {
      assert.isNaN(KraGL.Math.linearMap(1, [undefined,2], [2,12]));
    });
    it('bad case - NaN range', function() {
      assert.isNaN(KraGL.Math.linearMap(1, [0,2], [undefined,12]));
    });
  });

  describe('matChangeBasis', function() {
    it('normal case', function() {
      var v = [0.5, 0.5, 0.5];

      var xAxis = [0, -1, 0];
      var yAxis = [0, 0, 1];
      var zAxis = [-1, 0, 0];
      var m = KraGL.Math.matChangeBasis(xAxis, yAxis, zAxis);
      v = vec3.transformMat3([], v, m);

      assert.vecApproximately(v, [-0.5, -0.5, 0.5], 0.0001);
    });
  });

  describe('mix', function() {
    it('normal case', function() {
      assert.equal(KraGL.Math.mix(0, [1,5]), 1);
      assert.equal(KraGL.Math.mix(1, [1,5]), 5);
      assert.equal(KraGL.Math.mix(0.5, [0, 12]), 6);
      assert.equal(KraGL.Math.mix(0.75, [0, 1]), 0.75);
      assert.equal(KraGL.Math.mix(-1, [0,2]), -2);
      assert.equal(KraGL.Math.mix(2, [1, 3]), 5);
    });
    it('bad case - alpha NaN', function() {
      assert.isNaN(KraGL.Math.mix(undefined, [1,4]));
    });
    it('bad case - NaN range', function() {
      assert.isNaN(KraGL.Math.mix(0.5, []));
    });
  });

  describe('point', function() {
    it('vec2', function() {
      assert.deepEqual(KraGL.Math.point([1,2]), [1,2,0,1]);
    });
    it('vec3', function() {
      assert.deepEqual(KraGL.Math.point([1,2,3]), [1,2,3,1]);
    });
    it('vec4', function() {
      assert.deepEqual(KraGL.Math.point([1,2,3,0]), [1,2,3,1]);
    });
    it('bad case - falsey values', function() {
      assert.deepEqual(KraGL.Math.point([]), [0,0,0,1]);
    });
  });

  describe('point2D', function() {
    it('vec2', function() {
      assert.deepEqual(KraGL.Math.point2D([1,2]), [1,2,1]);
    });
    it('vec3', function() {
      assert.deepEqual(KraGL.Math.point2D([1,2,3]), [1,2,1]);
    });
    it('vec4', function() {
      assert.deepEqual(KraGL.Math.point2D([1,2,3,4]), [1,2,1]);
    });
    it('bad case - falsey values', function() {
      assert.deepEqual(KraGL.Math.point2D([]), [0,0,1]);
    });
  });

  describe('polar', function() {
    it('normal case', function() {
      var polar = KraGL.Math.polar([0,0,0,1]);
      var expected = [0,NaN,NaN];
      assert.vecApproximately(polar, expected, 0.0001);

      polar = KraGL.Math.polar([2, 2, 0, 1]);
      expected = [Math.sqrt(8), Math.PI/4, Math.PI/2];
      assert.vecApproximately(polar, expected, 0.0001);

      polar = KraGL.Math.polar([0,0,4,1]);
      expected = [4, 0, 0];
      assert.vecApproximately(polar, expected, 0.0001);

      polar = KraGL.Math.polar([2,0,2,1]);
      expected = [Math.sqrt(8), 0, Math.PI/4];
      assert.vecApproximately(polar, expected, 0.0001);
    });
  });

  describe('radians', function() {
    it('normal case', function() {
      assert.approximately(KraGL.Math.radians(0), 0, 0.0001);
      assert.approximately(KraGL.Math.radians(90), Math.PI/2, 0.0001);
      assert.approximately(KraGL.Math.radians(180), Math.PI, 0.0001);
      assert.approximately(KraGL.Math.radians(360), 2*Math.PI, 0.0001);
      assert.approximately(KraGL.Math.radians(720), 4*Math.PI, 0.0001);
    });
    it('bad case - NaN', function() {
      assert.isNaN(KraGL.Math.radians(undefined));
    });
  });

  describe('reflect', function() {
    it('normal case', function() {
      var uHat = vec3.normalize([], [-1, -1, -1]);
      var nHat = [0,1,0];

      var reflected = KraGL.Math.reflect(uHat, nHat);
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
      var refracted = KraGL.Math.refract(uHat, nHat, eta);
      assert.vecApproximately(refracted, uHat, 0.0001);
    });
    it('air/vacuum', function() {
      var uHat = vec3.normalize([], [-1, -1, -1]);
      var nHat = [0,1,0];
      var eta = 1;
      var refracted = KraGL.Math.refract(uHat, nHat, eta);
      assert.vecApproximately(refracted, uHat, 0.0001);
    });
    it('water', function() {
      var nAir = 1.0;
      var nWater = 1.333;

      var uHat = vec3.normalize([], [-1, -1, 0]);
      var nHat = [0,1,0];
      var eta = nAir/nWater;

      var refracted = KraGL.Math.refract(uHat, nHat, eta);

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


  describe('rotate', function() {
    it('normal case', function() {
      var pt = [2, 2, 1, 1];
      var axis = [0, 0, 1];
      var rotated = KraGL.Math.rotate(pt, axis, 0);
      var expected = [2, 2, 1, 1];
      assert.vecApproximately(rotated, expected, 0.0001);

      var pt = [2, 2, 1, 1];
      var axis = [0, 0, 1];
      var rotated = KraGL.Math.rotate(pt, axis, Math.PI/4);
      var expected = [0, Math.sqrt(8), 1, 1];
      assert.vecApproximately(rotated, expected, 0.0001);

      pt = [0, 4, 0, 1];
      axis = vec3.normalize([], [1,0,1]);
      rotated = KraGL.Math.rotate(pt, axis, Math.PI/2);

      expected = [-Math.sqrt(8), 0, Math.sqrt(8), 1];
      assert.vecApproximately(rotated, expected, 0.0001);
    });

    it('default axis', function() {
      var pt = [2, 2, 1, 1];
      var rotated = KraGL.Math.rotate(pt, Math.PI/4);
      var expected = [0, Math.sqrt(8), 1, 1];
      assert.vecApproximately(rotated, expected, 0.0001);
    });

    it('bad case - 0 vector', function() {
      var pt = [2, 2, 1, 1];
      var axis = [0, 0, 0];
      var rotated = KraGL.Math.rotate(pt, axis, Math.PI/4);
      var expected = [NaN, NaN, NaN, 1];
      assert.vecApproximately(rotated, expected, 0.0001);
    });
  });

  describe('rotate2D', function() {
    it('normal case', function() {
      var pt = [2, 2, 1];
      var rotated = KraGL.Math.rotate2D(pt, Math.PI/4);
      var expected = [0, Math.sqrt(8), 1];
      assert.vecApproximately(rotated, expected, 0.0001);
    });
  });

  describe('scalarProjection', function() {
    it('normal case', function() {
      var u = [5, 0];
      var v = [2, 2];
      var sProj = KraGL.Math.scalarProjection(u, v);
      assert.approximately(sProj, 2, 0.001);

      var u = [5, 0, 0];
      var v = [2, 2, 2];
      var sProj = KraGL.Math.scalarProjection(u, v);
      assert.approximately(sProj, 2, 0.001);

      var u = [5, 0, 0, 0];
      var v = [2, 2, 2, 2];
      var sProj = KraGL.Math.scalarProjection(u, v);
      assert.approximately(sProj, 2, 0.001);
    });
  });

  describe('scale', function() {
    it('normal case', function() {
      var pt = [2,3,4,1];
      var scaled = KraGL.Math.scale(pt, [1,2,3]);
      assert.vecApproximately(scaled, [2,6,12,1], 0.0001);
    });
    it('uniform scale', function() {
      var pt = [2,3,4,1];
      var scaled = KraGL.Math.scale(pt, 2);
      assert.vecApproximately(scaled, [4,6,8,1], 0.0001);
    });
  });

  describe('scale2D', function() {
    it('normal case', function() {
      var pt = [2,3,1];
      var scaled = KraGL.Math.scale2D(pt, [1,2]);
      assert.vecApproximately(scaled, [2,6,1], 0.0001);
    });
    it('uniform scale', function() {
      var pt = [2,3,1];
      var scaled = KraGL.Math.scale2D(pt, 3);
      assert.vecApproximately(scaled, [6,9,1], 0.0001);
    });
  });

  describe('sign', function() {
    it('positive', function() {
      assert.equal(KraGL.Math.sign(4), 1);
    });
    it('negative', function() {
      assert.equal(KraGL.Math.sign(-3), -1);
    });
    it('zero', function() {
      assert.equal(KraGL.Math.sign(0), 0);
    });
    it('bad case - NaN', function() {
      assert.isNaN(KraGL.Math.sign(NaN));
    });
  });

  describe('slerp', function() {
    it('normal case', function() {
      var u = [4,0,0];
      var v = [0,6,0];
      var slerped = KraGL.Math.slerp(u, v, 0.5);
      var expected = vec3.scale([], vec3.normalize([], [1,1,0]), 5);
      assert.vecApproximately(slerped, expected, 0.0001);
    });
    it('parallel vectors', function() {
      var u = [2, 0, 0];
      var v = [4, 0, 0];
      var slerped = KraGL.Math.slerp(u, v, 0.5);
      var expected = [3, 0, 0];
      assert.vecApproximately(slerped, expected, 0.0001);
    });
  });

  describe('step', function() {
    it('normal case', function() {
      assert.equal(KraGL.Math.step(42, 50), 1);
      assert.equal(KraGL.Math.step(42, 42), 1);
      assert.equal(KraGL.Math.step(42, 30), 0);
    });
  });

  describe('translate', function() {
    it('normal case', function() {
      var pt = KraGL.Math.translate([1,1,1,1], [1,2,3]);
      var expected = [2,3,4,1];
      assert.vecApproximately(pt, expected, 0.0001);
    });
  });

  describe('unmix', function() {
    it('normal case', function() {
      assert.equal(KraGL.Math.unmix(1, [0,4]), 0.25);
      assert.equal(KraGL.Math.unmix(1, [1,4]), 0);
      assert.equal(KraGL.Math.unmix(4, [0,4]), 1);
      assert.equal(KraGL.Math.unmix(-1, [0,4]), -0.25);
      assert.equal(KraGL.Math.unmix(5, [0,4]), 1.25);
    });
  });

  describe('vecParallel', function() {
    it('normal case', function() {
      assert(KraGL.Math.vecParallel([1,1,1], [2,2,2]));
      assert(KraGL.Math.vecParallel([1,2,1], [1,2,1]));
      assert(KraGL.Math.vecParallel([1,1,1], [-2,-2,-2]));
      assert(KraGL.Math.vecParallel([1,1,1], [-2,-2,-2]));

      assert(!KraGL.Math.vecParallel([1,1,1], [-1,1,1]));
      assert(!KraGL.Math.vecParallel([1,2,3], [3,2,1]));
    });
  });

  describe('wrap', function() {
    it('normal case', function() {
      assert.equal(KraGL.Math.wrap(2, [1,6]), 2);
      assert.equal(KraGL.Math.wrap(1, [1,6]), 1);
      assert.equal(KraGL.Math.wrap(6, [1,6]), 1);
      assert.equal(KraGL.Math.wrap(10, [1,6]), 5);
      assert.equal(KraGL.Math.wrap(0, [1,6]), 5);
      assert.equal(KraGL.Math.wrap(-2, [1,6]), 3);
    });
  });
});
