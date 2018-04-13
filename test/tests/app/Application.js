'use strict';

describe('KraGL.app.Application', () => {
  const assert = chai.assert;
  const Application = KraGL.app.Application;
  const KraGLError = KraGL.KraGLError;

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
   * Properly destroys a test application and its container.
   * @param {KraGL.app.Application}
   */
  function destroyApp(app) {
    destroyContainer(app.container);
    cancelAnimationFrame(app._nextFrame);
  }

  /**
   * Detaches a container from the DOM. Please invoke this after any tests
   * that create a container so that we don't pollute the DOM.
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

      destroyApp(app);
    });

    it('webgl2', () => {
      let container = createContainer();

      let app = new _MockApp({
        container,
        glVersion: '2.0'
      });
      assert.instanceOf(app.gl, WebGL2RenderingContext);

      destroyApp(app);
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

      destroyApp(app);
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

      destroyApp(app);
    });
  });

  // Property tests

  describe('canvas', () => {
    it('normal', () => {
      let container = createContainer();

      let app = new _MockApp({ container });
      assert.instanceOf(app.canvas, HTMLCanvasElement);

      destroyApp(app);
    });
  });

  describe('container', () => {
    it('normal', () => {
      let container = createContainer();

      let app = new _MockApp({ container });
      assert.equal(app.container, container);

      destroyApp(app);
    });

    it('no container', () => {
      assert.throws(() => {
        let app = new _MockApp({});
      }, KraGLError);
    });
  });

  describe('fps', () => {
    it('not started', () => {
      let container = createContainer();

      let app = new _MockApp({ container });
      assert.equal(app.fps, 0);

      destroyApp(app);
    });

    it('running', () => {
      let container = createContainer();

      let app = new _MockApp({ container });
      return app.start()
      .then(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 1100);
        });
      })
      .then(() => {
        assert.approximately(app.fps, 60.0, 3.0);
        return app.end();
      })
      .finally(() => {
        destroyApp(app);
      });
    });
  });

  describe('gl', () => {
    it('normal', () => {
      let container = createContainer();

      let app = new _MockApp({ container });
      assert.instanceOf(app.gl, WebGLRenderingContext);

      destroyApp(app);
    });

    it('webgl2', () => {
      let container = createContainer();

      let app = new _MockApp({
        container,
        glVersion: '2.0'
      });
      assert.instanceOf(app.gl, WebGL2RenderingContext);

      destroyApp(app);
    });
  });

  describe('height', () => {
    it('normal', () => {
      let container = createContainer();

      let app = new _MockApp({ container });
      assert.equal(app.height, 600);

      destroyApp(app);
    });

    it('custom', () => {
      let container = createContainer();

      let app = new _MockApp({
        container,
        height: 240
      });
      assert.equal(app.height, 240);

      destroyApp(app);
    });
  });

  describe('isContextLost', () => {
    it('not lost', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      return app.start()
      .then(() => {
        assert.isFalse(app.isContextLost);
        return app.end();
      })
      .finally(() => {
        destroyApp(app);
      });
    });

    it('context lost', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      return app.start()
      .then(() => {
        app.gl.getExtension('WEBGL_lose_context').loseContext();
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 10);
        });
      })
      .then(() => {
        assert.isTrue(app.isContextLost);
        return app.end();
      })
      .finally(() => {
        destroyApp(app);
      });
    });

    it('after context restored', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      return app.start()
      .then(() => {
        app.canvas.dispatchEvent(new WebGLContextEvent('webglcontextlost'));
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 10);
        });
      })
      .then(() => {
        app.canvas.dispatchEvent(new WebGLContextEvent('webglcontextrestored'));
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 10);
        });
      })
      .then(() => {
        assert.isFalse(app.isContextLost);
        return app.end();
      })
      .finally(() => {
        destroyApp(app);
      });
    });
  });

  describe('isLoading', () => {
    it('from NOT_STARTED', () => {
      let container = createContainer();

      let app = new _MockApp({ container });
      assert.isFalse(app.isLoading);

      destroyApp(app);
    });

    it('from LOADING', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      // Implement initResources so that it takes 200 millis to load.
      app.initResources = function() {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 200);
        });
      }

      let result = false;
      let promise = app.start();

      // Wait for an animation frame between when start is invoked and when
      // initResources finished. Capture the isLoading value at that time.
      setTimeout(() => {
        result = app.isLoading;
      }, 100);

      return promise
      .then(() => {
        assert.isTrue(result);
        return app.end();
      })
      .finally(() => {
        destroyApp(app);
      });
    });

    it('from RUNNING', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      return app.start()
      .then(() => {
        assert.isFalse(app.isLoading);
        return app.end();
      })
      .finally(() => {
        destroyApp(app);
      });
    });

    it('from ENDED', () => {
      let container = createContainer();
      let app = new _MockApp({ container });
      app.initResources = function() {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 100);
        });
      }

      return app.start()
      .then(() => {
        return app.end();
      })
      .then(() => {
        assert.isFalse(app.isLoading);
      })
      .finally(() => {
        destroyApp(app);
      });
    });
  });

  describe('isPaused', () => {
    it('from NOT_STARTED', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      assert.isFalse(app.isPaused);

      destroyApp(app);
    });

    it('from LOADING', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      app.initResources = function() {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 100);
        });
      };

      let result;
      let promise = app.start();
      setTimeout(() => {
        result = app.isPaused;
      }, 10);

      return promise
      .then(() => {
        return app.end();
      })
      .then(() => {
        assert.isFalse(result);
      })
      .finally(() => {
        destroyApp(app);
      });
    });

    it('from RUNNING', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      return app.start()
      .then(() => {
        assert.isFalse(app.isPaused);
        return app.end();
      })
      .finally(() => {
        destroyApp(app);
      });
    });

    it('from PAUSED', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      return app.start()
      .then(() => {
        return app.pause();
      })
      .then(() => {
        assert.isTrue(app.isPaused);
        return app.end();
      })
      .finally(() => {
        destroyApp(app);
      });
    });

    it('from ENDED', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      return app.start()
      .then(() => {
        return app.end();
      })
      .then(() => {
        assert.isFalse(app.isPaused);
      })
      .finally(() => {
        destroyApp(app);
      });
    });
  });

  describe('isRunning', () => {
    it('from NOT_STARTED', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      assert.isFalse(app.isRunning);
      destroyApp(app);
    });

    it('from LOADING', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      app.initResources = function() {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 100);
        });
      };

      let promise = app.start();
      let result;
      setTimeout(() => {
        result = app.isRunning;
      }, 10);

      return promise
      .then(() => {
        assert.isFalse(result);
        return app.end();
      })
      .finally(() => {
        destroyApp(app);
      });
    });

    it('from RUNNING', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      return app.start()
      .then(() => {
        assert.isTrue(app.isRunning);
        return app.end();
      })
      .finally(() => {
        destroyApp(app);
      });
    });

    it('from CONTEXT_LOST', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      return app.start()
      .then(() => {
        app.gl.getExtension('WEBGL_lose_context').loseContext();
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 10);
        });
      })
      .then(() => {
        assert.isFalse(app.isRunning);
      })
      .finally(() => {
        destroyApp(app);
      });
    });

    it('from ENDED', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      return app.start()
      .then(() => {
        return app.end();
      })
      .then(() => {
        assert.isFalse(app.isRunning);
      })
      .finally(() => {
        destroyApp(app);
      });
    });
  });

  describe('shaderLib', () => {
    it('normal', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      assert.instanceOf(app.shaderLib, KraGL.shaders.ShaderLib);
      destroyApp(app);
    });
  });

  describe('width', () => {
    it('default', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      assert.equal(app.width, 800);
      destroyApp(app);
    });

    it('custom', () => {
      let container = createContainer();
      let app = new _MockApp({
        container,
        width: 320
      });

      assert.equal(app.width, 320);
      destroyApp(app);
    });
  });

  // Method tests

  describe('clean', () => {
    it('called by restart', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      let result;
      app.clean = function() {
        result = true;
        return Promise.resolve();
      }

      return app.start()
      .then(() => {
        return app.restart();
      })
      .then(() => {
        assert.isTrue(result);
        return app.end();
      })
      .finally(() => {
        destroyApp(app);
      });
    });
  });

  describe('end', () => {
    it('can be restarted', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      return app.start()
      .then(() => {
        return app.end();
      })
      .then(() => {
        assert.isFalse(app.isRunning);
        return app.restart();
      })
      .then(() => {
        assert.isTrue(app.isRunning);
        return app.end();
      })
      .finally(() => {
        destroyApp(app);
      });
    });

    it('cannot be started', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      let promise = app.start()
      .then(() => {
        return app.end();
      })
      .then(() => {
        assert.isFalse(app.isRunning);
        return app.start();
      })
      .finally(() => {
        destroyApp(app);
      });
      assert.isRejected(promise);
    });
  });

  describe('initResources', () => {
    it('called during startup', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      let result;
      app.initResources = function() {
        result = true;
        return Promise.resolve();
      };

      return app.start()
      .then(() => {
        assert.isTrue(result);
        return app.end();
      })
      .finally(() => {
        destroyApp(app);
      });
    });
  });

  describe('initWebGLResources', () => {
    it('called during startup', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      let result;
      app.initWebGLResources = function() {
        result = true;
        return Promise.resolve();
      };

      return app.start()
      .then(() => {
        assert.isTrue(result);
        return app.end();
      })
      .finally(() => {
        destroyApp(app);
      });;
    });
  });

  describe('pause', () => {
    it('normal', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      return app.start()
      .then(() => {
        return app.pause();
      })
      .then(() => {
        assert.isTrue(app.isPaused);
        return app.end();
      })
      .finally(() => {
        destroyApp(app);
      });
    });

    it('wrong state', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      assert.throws(() => {
        app.pause();
      }, KraGL.K);
    });
  });

  describe('render', () => {
    it('called while running', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      let result;
      app.render = function() {
        result = true;
      }

      return app.start()
      .then(() => {
        assert.isTrue(result);
        return app.end();
      })
      .finally(() => {
        destroyApp(app);
      });
    });
  });

  describe('restart', () => {
    it('normal', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      let startCount = 0;
      app.initResources = function() {
        startCount++;
        return Promise.resolve();
      };

      return app.start()
      .then(() => {
        return app.restart();
      })
      .then(() => {
        assert.equal(startCount, 2);
        return app.end();
      })
      .finally(() => {
        destroyApp(app);
      });
    });
  });

  describe('resume', () => {
    it('from PAUSED', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      return app.start()
      .then(() => {
        return app.pause();
      })
      .then(() => {
        assert.isFalse(app.isRunning);
        return app.resume();
      })
      .then(() => {
        assert.isTrue(app.isRunning);
        return app.end();
      })
      .finally(() => {
        destroyApp(app);
      });
    });

    it('from NOT_STARTED', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      assert.throws(() => {
        app.resume();
      }, KraGL.KraGLError);
      destroyApp(app);
    });

    it('from RUNNING', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      let promise = app.start()
      .then(() => {
        return app.resume();
      })
      .finally(() => {
        destroyApp(app);
      });
      return assert.isRejected(promise);
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
        destroyApp(app);
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
        destroyApp(app);
      });

      return assert.isRejected(promise);
    });
  });

  describe('update', () => {
    it('normal', () => {
      let container = createContainer();
      let app = new _MockApp({ container });

      let updateCount = 0;
      app.update = function() {
        updateCount++;
      };

      return app.start()
      .then(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
      })
      .then(() => {
        assert.isAtLeast(updateCount, 60);
      });
    });
  });
});
