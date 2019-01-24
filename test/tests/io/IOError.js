'use strict';

describe('KraGL.io.IOError', () => {
  const assert = chai.assert;
  const KraGLError = KraGL.KraGLError;
  const IOError = KraGL.io.IOError;

  describe('throw', () => {
    it('normal', () => {
      return Promise.resolve()
      .then(() => {
        throw new IOError('Hello. I am Error.');
      })
      .catch(err => {
        assert.isTrue(err instanceof Error);
        assert.isTrue(err instanceof KraGLError);
        assert.isTrue(err instanceof IOError);
        assert.equal(err.message, 'Hello. I am Error.');
      });
    });
  });
});
