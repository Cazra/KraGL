'use strict';

var assert = chai.assert;

describe('KraGL.math.AbstractLine', function() {

  describe('Line - constructor', function() {
    it('normal case', function() {
      var line = new KraGL.math.Line({
        p1: [1,2],
        p2: [3,4]
      });

      assert(line instanceof KraGL.math.Line);
    });
    it('bad case - same point', function() {
      assert.throws(function() {
        new KraGL.math.Line({
          p1: [1,2],
          p2: [1,2]
        });
      });
    });
  });

});
