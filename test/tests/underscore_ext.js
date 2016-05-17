'use strict';

var assert = chai.assert;

describe('underscore_ext', function() {

  describe('alias', function() {
    it('normal case', function() {
      class Test {
        constructor() {
          this._x = 42;
        }

        doTheThing(arg) {
          return arg+this._x;
        }
      };

      _.extend(Test.prototype, {
        test: _.alias('doTheThing')
      });

      var test = new Test();
      assert.equal(test.doTheThing(1), 43);
      assert.equal(test.test(1), 43);
    });
  });

  describe('aliasMethods', function() {
    it('normal case', function() {
      class Test {
        constructor() {
          this._x = 42;
        }

        doTheThing(arg) {
          return arg+this._x;
        }

        getTheAnswer() {
          return 42;
        }
      };

      _.aliasMethods(Test, {
        thing: 'doTheThing',
        answer: 'getTheAnswer'
      });

      var test = new Test();
      assert.equal(test.doTheThing(1), 43);
      assert.equal(test.thing(1), 43);
      assert.equal(test.getTheAnswer(), 42);
      assert.equal(test.answer(), 42);
    });
  });

  describe('aliasProperties', function() {
    it('normal case', function() {
      class Test {
        constructor() {
          this._x = 42;
        }

        get testProp() {
          return this._x;
        }
        set testProp(x) {
          this._x = x;
        }

        get theAnswer() {
          return 42;
        }
        set theAnswer(x) {
          this._x = 42;
        }
      };

      _.aliasProperties(Test, {
        prop: 'testProp',
        answer: 'theAnswer'
      });

      var test = new Test();
      assert.equal(test.testProp, 42);
      assert.equal(test.prop, 42);
      test.testProp = 11;
      assert.equal(test.testProp, 11);
      assert.equal(test.prop, 11);
      test.prop = 64;
      assert.equal(test.testProp, 64);
      assert.equal(test.prop, 64);

      assert.equal(test.theAnswer, 42);
      assert.equal(test.answer, 42);
      test.theAnswer = 'test';
      assert.equal(test.prop, 42);
      test.prop = 64;
      assert.equal(test.prop, 64);
      test.answer = 'test';
      assert.equal(test.prop, 42);
    });
  });
});
