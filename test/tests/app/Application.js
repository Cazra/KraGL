'use strict';

describe('KraGL.app.Application', () => {
  const assert = chai.assert;
  const Application = KraGL.app.Application;

  /**
   * A mock application with minimally implemented methods.
   */
  class _MockApp extends Application {
    constructor(opts) {
      super(opts);
    }

    clean() {
      return Promise.resolve();
    }

    initResources() {
      return Promise.resolve();
    }

    initWebGLResources() {
      return Promise.resolve();
    }

    render() {
      return Promise.resolve();
    }

    update() {
      return Promise.resolve();
    }
  }

  /**
   * Creates a test div container for containing a KraGL application and
   * attaches it to the DOM.
   * @return {Element}
   */
  function createContainer() {
    let container = document.createElement('div');
    container.style.width = '800px';
    container.style.height = '600px';

    // Need to attach the element to the DOM for its dimensions to take effect.
    document.querySelector('body').appendChild(container);
    return container;
  }

  /**
   * Detaches a container from the DOM.
   * @param {Element} container
   */
  function destroyContainer(container) {
    container.parentElement.removeChild(container);
  }

  describe('constructor', () => {
    it('defaults', () => {
      let container = createContainer();

      let app = new _MockApp({ container });
      assert.isDefined(app);
      assert.isFalse(app.isRunning);
      assert.instanceOf(app.gl, WebGLRenderingContext);
      assert.isFalse(app.gl.getContextAttributes().alpha);
      assert.isTrue(app.gl.getContextAttributes().stencil);
      assert.equal(app.width, 800);
      assert.equal(app.height, 600);

      destroyContainer(container);
    });

    it('webgl2', () => {
      let container = createContainer();

      let app = new _MockApp({
        container,
        glVersion: '2.0'
      });
      assert.instanceOf(app.gl, WebGL2RenderingContext);

      destroyContainer(container);
    });

    it('width & height', () => {
      let container = createContainer();

      let app = new _MockApp({
        container,
        width: 320,
        height: 240
      });
      assert.equal(app.width, 320);
      assert.equal(app.height, 240);

      destroyContainer(container);
    });

    it('glAttrs', () => {
      let container = createContainer();

      let app = new _MockApp({
        container,
        glAttrs: {
          // Opposite of KraGL defaults
          alpha: true,
          stencil: false
        }
      });
      assert.isTrue(app.gl.getContextAttributes().alpha);
      assert.isFalse(app.gl.getContextAttributes().stencil);

      destroyContainer(container);
    });
  });

  describe('start', () => {
    it('normal', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      return app.start()
      .then(() => {
        assert.isTrue(app.isRunning);
        return app.end();
      })
      .then(() => {
        assert.isFalse(app.isRunning);
      })
      .finally(() => {
        destroyContainer(container);
      });
    });

    it('wrong state', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      let promise = app.start()
      .then(() => {
        assert.isTrue(app.isRunning);
        return app.start();
      })
      .then(() => {
        throw new Error('fail');
      })
      .catch(() => {
        assert.isFalse(app.isRunning);
      })
      .finally(() => {
        destroyContainer(container);
      });

      return assert.isRejected(promise);
    });

  });
});
