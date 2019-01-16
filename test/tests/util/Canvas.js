'use strict';

describe('KraGL.util.Canvas', () => {
  const assert = chai.assert;
  const Canvas = KraGL.util.Canvas;

  describe('getAspectRatio', () => {
    it('normal', () => {
      let container = createContainer();
      let app = new _MockApp({
        container,
        width: 400,
        height: 300
      });

      let aspect = Canvas.getAspectRatio(app.gl);
      assert.equal(aspect, 4/3);

      destroyApp(app);
    });
  });
});
