'use strict';

describe('KraGL.KraGLError', () => {
  const assert = chai.assert;
  const KraGLError = KraGL.KraGLError;

  describe('throw', () => {
    it('normal', () => {
      return Promise.resolve()
      .then(() => {
        throw new KraGLError('Hello. I am Error.');
      })
      .catch(err => {
        assert.isTrue(err instanceof Error);
        assert.isTrue(err instanceof KraGLError);
        assert.equal(err.message, 'Hello. I am Error.');
      });
    });
  });
});
