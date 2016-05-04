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
      assert.equal(KraGL.Math.fract(3.1415), 0.1415);
      assert.equal(KraGL.Math.fract(42), 0);
      assert.equal(KraGL.Math.fract(-8.3), 0.7);
    });
    it('bad case - NaN', function() {
      assert.isNaN(KraGL.Math.fract(undefined));
    });
  });


});
