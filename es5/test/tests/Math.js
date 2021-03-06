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

      assert.isTrue(KraGL.Math.approx(1, 1.1, 0.11));

      assert.isTrue(KraGL.Math.approx(3, 3));
      assert.isFalse(KraGL.Math.approx(1, 2));
    });
    it('rounding error case', function() {
      assert.isFalse(KraGL.Math.approx(1, 1.1, 0.1));
    });
    it('bad case - NaN', function() {
      assert.isFalse(KraGL.Math.approx(undefined, 0, 0.0001));
      assert.isFalse(KraGL.Math.approx(undefined, 10, 0.0001));
      assert.isFalse(KraGL.Math.approx(0, undefined, 0.0001));
      assert.isFalse(KraGL.Math.approx(2, undefined, 0.0001));
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

  describe('step', function() {
    it('normal case', function() {
      assert.equal(KraGL.Math.step(42, 50), 1);
      assert.equal(KraGL.Math.step(42, 42), 1);
      assert.equal(KraGL.Math.step(42, 30), 0);
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
