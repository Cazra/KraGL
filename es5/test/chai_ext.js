'use strict';

_.extend(chai.assert, {
  /**
   * Checks if the corresponding components of two vectors are approximately
   * equal to each other.
   * @param  {(vec2|vec3|vec4)} u
   * @param  {(vec2|vec3|vec4)} v
   * @param  {number} delta
   * @return {boolean}
   */
  vecApproximately: function(u, v, delta) {
    if(u.length !== v.length)
      throw new Error('Vectors not same length.');

    _.each(_.range(u.length), function(i) {
      var x = u[i];
      var y = v[i];

      if(!isNaN(x) || !isNaN(y)) {
        try {
          chai.assert.approximately(x, y, delta);
        }
        catch(err) {
          throw new Error('expected ' + u + ' to be close to ' + v);
        }
      }
    });
  }
});


// Unit test:
describe('chai.assert.vecApproximately', function() {
  it('pass', function() {
    chai.assert.vecApproximately([1,1,1], [1.00001, 1.00001, 0.99999], 0.001);
    chai.assert.vecApproximately([NaN, NaN, NaN, 1], [NaN, NaN, NaN, 1], 0.001);
  });
  it('fail', function() {
    chai.assert.throw(function() {
      chai.assert.vecApproximately([2,2,2], [1,1,1], 0.1);
    });
    chai.assert.throw(function() {
      chai.assert.vecApproximately([1.11,1,1], [1,1,1], 0.1);
    });
    chai.assert.throw(function() {
      chai.assert.vecApproximately([NaN, 1, 1], [0, 1, 1], 0.1);
    });
  });
  it('bad case - unequal lengths', function() {
    chai.assert.throw(function() {
      chai.assert.vecApproximately([1,1,1,0], [1.00001, 1.00001, 0.99999], 0.001);
    });
  });
});
