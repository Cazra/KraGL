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
      var uHat = [0, -1, 0];
      var nHat = [0, 1, 0];
      var eta = 1.333; // water
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
      var uHat = vec3.normalize([], [-1, -1, -1]);
      var nHat = [0,1,0];
      var eta = 1.333;
      var refracted = KraGL.Math.refract(uHat, nHat, eta);
      console.log(refracted);

      // TODO: Use Snell's law to come up with a test problem.
      throw new Error('TODO');
    });
  });
});
