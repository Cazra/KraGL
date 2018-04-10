'use strict';

_.extend(chai.assert, {
  /**
   * Passes if a Promise has been rejected.
   * @param {Promise} promise
   * @return {Promise}
   */
  isRejected: function(promise) {
    let bad = new Error('Expected promise to be rejected.');
    return promise
    .then(() => {
      throw bad;
    })
    .catch(err => {
      if(err === bad)
        throw bad;
    });
  },

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

describe('chai.assert.isRejected', () => {
  it('pass', () => {
    let promise = Promise.reject(new Error('Hello. I am Error.'));
    return chai.assert.isRejected(promise);
  });
  it('fail', () => {
    let promise = Promise.resolve();
    let passed = false;

    return chai.assert.isRejected(promise)
    .catch(() => {
      passed = true;
    })
    .then(() => {
      chai.assert.isTrue(passed);
    });
  });
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
