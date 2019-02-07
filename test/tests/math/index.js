'use strict';

var assert = chai.assert;

describe('KraGL.math', function() {

  describe('approx', function() {
    it('normal case', function() {
      assert.isTrue(KraGL.math.approx(12.99999999, 13, 0.0001));
      assert.isFalse(KraGL.math.approx(12.95, 12, 0.0001));

      assert.isTrue(KraGL.math.approx(-4.5000001, -4.5, 0.0001));
      assert.isFalse(KraGL.math.approx(-4.54, -4.5, 0.0001));

      assert.isTrue(KraGL.math.approx(1e-10, 0, 0.0001));
      assert.isFalse(KraGL.math.approx(1e-2, 0, 1e-4));

      assert.isTrue(KraGL.math.approx(1, 1.1, 0.11));

      assert.isTrue(KraGL.math.approx(3, 3));
      assert.isFalse(KraGL.math.approx(1, 2));
    });
    it('rounding error case', function() {
      assert.isFalse(KraGL.math.approx(1, 1.1, 0.1));
    });
    it('bad case - NaN', function() {
      assert.isFalse(KraGL.math.approx(undefined, 0, 0.0001));
      assert.isFalse(KraGL.math.approx(undefined, 10, 0.0001));
      assert.isFalse(KraGL.math.approx(0, undefined, 0.0001));
      assert.isFalse(KraGL.math.approx(2, undefined, 0.0001));
    });
    it('bad case - negative tolerance', function() {
      assert.throws(function() {
        KraGL.math.approx(12.00001, 12, -0.0001)
      });
    });
  });

  describe('cartesian', function() {
    it('normal case', function() {
      var cart = KraGL.math.cartesian([0,0,0]);
      var expected = [0,0,0,1];
      assert.vecApproximately(cart, expected, 0.001);

      cart = KraGL.math.cartesian([5, 0, 0]);
      expected = [0,0,5,1];
      assert.vecApproximately(cart, expected, 0.001);

      cart = KraGL.math.cartesian([4, Math.PI/4, Math.PI/2]);
      expected = vec3.scale([], vec3.normalize([], [1,1,0]), 4);
      expected[3] = 1;
      assert.vecApproximately(cart, expected, 0.001);

      cart = KraGL.math.cartesian([4, 0, Math.PI/4]);
      expected = vec3.scale([], vec3.normalize([], [1,0,1]), 4);
      expected[3] = 1;
      assert.vecApproximately(cart, expected, 0.001);
    });
  });

  describe('clamp', function() {
    it('normal case', function() {
      assert.equal(KraGL.math.clamp(10,0,5), 5);
      assert.equal(KraGL.math.clamp(-5,-2,5), -2);
      assert.equal(KraGL.math.clamp(2,-5,5), 2);
    });
    it('bad case - NaN', function() {
      assert.isNaN(KraGL.math.clamp(1, 0, undefined));
      assert.isNaN(KraGL.math.clamp(1, undefined, 10));
      assert.isNaN(KraGL.math.clamp(undefined, 0, 2));
      assert.isNaN(KraGL.math.clamp(42, 'hello', 'world'));
    });
  });

  describe('degrees', function() {
    it('normal case', function() {
      assert.approximately(KraGL.math.degrees(0), 0, 0.001);
      assert.approximately(KraGL.math.degrees(Math.PI/2), 90, 0.001);
      assert.approximately(KraGL.math.degrees(Math.PI), 180, 0.001);
      assert.approximately(KraGL.math.degrees(2*Math.PI), 360, 0.001);
      assert.approximately(KraGL.math.degrees(4*Math.PI), 720, 0.001);
      assert.approximately(KraGL.math.degrees(-Math.PI), -180, 0.001);
    });
    it('bad case - NaN', function() {
      assert.isNaN(KraGL.math.degrees(undefined));
    });
  });

  describe('fract', function() {
    it('normal case', function() {
      assert.approximately(KraGL.math.fract(3.1415), 0.1415, 0.000001);
      assert.approximately(KraGL.math.fract(42), 0, 0.000001);
      assert.approximately(KraGL.math.fract(-8.3), 0.7, 0.000001);
    });
    it('bad case - NaN', function() {
      assert.isNaN(KraGL.math.fract(undefined));
    });
  });

  describe('isPowerOf2', () => {
    it('true', () => {
      let isPowerOf2 = KraGL.math.isPowerOf2;
      assert.isTrue(isPowerOf2(1));
      assert.isTrue(isPowerOf2(2));
      assert.isTrue(isPowerOf2(4));
      assert.isTrue(isPowerOf2(8));
      assert.isTrue(isPowerOf2(16));
      assert.isTrue(isPowerOf2(32));
      assert.isTrue(isPowerOf2(64));
      assert.isTrue(isPowerOf2(128));
      assert.isTrue(isPowerOf2(256));
      assert.isTrue(isPowerOf2(512));
      assert.isTrue(isPowerOf2(1024));
    });

    it('false', () => {
      let isPowerOf2 = KraGL.math.isPowerOf2;
      assert.isFalse(isPowerOf2(0));
      assert.isFalse(isPowerOf2(-2));
      assert.isFalse(isPowerOf2(3));
      assert.isFalse(isPowerOf2(10));
      assert.isFalse(isPowerOf2(12));
      assert.isFalse(isPowerOf2(15));
      assert.isFalse(isPowerOf2(127));
      assert.isFalse(isPowerOf2(257));
    });
  });

  describe('linearMap', function() {
    it('normal case', function() {
      assert.approximately(KraGL.math.linearMap(1, [0,2], [2,12]), 7, 0.0001);
    });
    it('bad case - x=NaN', function() {
      assert.isNaN(KraGL.math.linearMap(undefined, [0,2], [2,12]));
    });
    it('bad case - NaN domain', function() {
      assert.isNaN(KraGL.math.linearMap(1, [undefined,2], [2,12]));
    });
    it('bad case - NaN range', function() {
      assert.isNaN(KraGL.math.linearMap(1, [0,2], [undefined,12]));
    });
  });

  describe('mix', function() {
    it('normal case', function() {
      assert.equal(KraGL.math.mix(0, [1,5]), 1);
      assert.equal(KraGL.math.mix(1, [1,5]), 5);
      assert.equal(KraGL.math.mix(0.5, [0, 12]), 6);
      assert.equal(KraGL.math.mix(0.75, [0, 1]), 0.75);
      assert.equal(KraGL.math.mix(-1, [0,2]), -2);
      assert.equal(KraGL.math.mix(2, [1, 3]), 5);
    });
    it('bad case - alpha NaN', function() {
      assert.isNaN(KraGL.math.mix(undefined, [1,4]));
    });
    it('bad case - NaN range', function() {
      assert.isNaN(KraGL.math.mix(0.5, []));
    });
  });

  describe('point', function() {
    it('vec2', function() {
      assert.deepEqual(KraGL.math.point([1,2]), [1,2,0,1]);
    });
    it('vec3', function() {
      assert.deepEqual(KraGL.math.point([1,2,3]), [1,2,3,1]);
    });
    it('vec4', function() {
      assert.deepEqual(KraGL.math.point([1,2,3,0]), [1,2,3,1]);
    });
    it('bad case - falsey values', function() {
      assert.deepEqual(KraGL.math.point([]), [0,0,0,1]);
    });
  });

  describe('point2D', function() {
    it('vec2', function() {
      assert.deepEqual(KraGL.math.point2D([1,2]), [1,2,1]);
    });
    it('vec3', function() {
      assert.deepEqual(KraGL.math.point2D([1,2,3]), [1,2,1]);
    });
    it('vec4', function() {
      assert.deepEqual(KraGL.math.point2D([1,2,3,4]), [1,2,1]);
    });
    it('bad case - falsey values', function() {
      assert.deepEqual(KraGL.math.point2D([]), [0,0,1]);
    });
  });

  describe('polar', function() {
    it('normal case', function() {
      var polar = KraGL.math.polar([0,0,0,1]);
      var expected = [0,NaN,NaN];
      assert.vecApproximately(polar, expected, 0.0001);

      polar = KraGL.math.polar([2, 2, 0, 1]);
      expected = [Math.sqrt(8), Math.PI/4, Math.PI/2];
      assert.vecApproximately(polar, expected, 0.0001);

      polar = KraGL.math.polar([0,0,4,1]);
      expected = [4, 0, 0];
      assert.vecApproximately(polar, expected, 0.0001);

      polar = KraGL.math.polar([2,0,2,1]);
      expected = [Math.sqrt(8), 0, Math.PI/4];
      assert.vecApproximately(polar, expected, 0.0001);
    });
  });

  describe('radians', function() {
    it('normal case', function() {
      assert.approximately(KraGL.math.radians(0), 0, 0.0001);
      assert.approximately(KraGL.math.radians(90), Math.PI/2, 0.0001);
      assert.approximately(KraGL.math.radians(180), Math.PI, 0.0001);
      assert.approximately(KraGL.math.radians(360), 2*Math.PI, 0.0001);
      assert.approximately(KraGL.math.radians(720), 4*Math.PI, 0.0001);
    });
    it('bad case - NaN', function() {
      assert.isNaN(KraGL.math.radians(undefined));
    });
  });

  describe('sign', function() {
    it('positive', function() {
      assert.equal(KraGL.math.sign(4), 1);
    });
    it('negative', function() {
      assert.equal(KraGL.math.sign(-3), -1);
    });
    it('zero', function() {
      assert.equal(KraGL.math.sign(0), 0);
    });
    it('bad case - NaN', function() {
      assert.isNaN(KraGL.math.sign(NaN));
    });
  });

  describe('step', function() {
    it('normal case', function() {
      assert.equal(KraGL.math.step(42, 50), 1);
      assert.equal(KraGL.math.step(42, 42), 1);
      assert.equal(KraGL.math.step(42, 30), 0);
    });
  });

  describe('unmix', function() {
    it('normal case', function() {
      assert.equal(KraGL.math.unmix(1, [0,4]), 0.25);
      assert.equal(KraGL.math.unmix(1, [1,4]), 0);
      assert.equal(KraGL.math.unmix(4, [0,4]), 1);
      assert.equal(KraGL.math.unmix(-1, [0,4]), -0.25);
      assert.equal(KraGL.math.unmix(5, [0,4]), 1.25);
    });
  });

  describe('wrap', function() {
    it('normal case', function() {
      assert.equal(KraGL.math.wrap(2, [1,6]), 2);
      assert.equal(KraGL.math.wrap(1, [1,6]), 1);
      assert.equal(KraGL.math.wrap(6, [1,6]), 1);
      assert.equal(KraGL.math.wrap(10, [1,6]), 5);
      assert.equal(KraGL.math.wrap(0, [1,6]), 5);
      assert.equal(KraGL.math.wrap(-2, [1,6]), 3);
    });
  });
});
