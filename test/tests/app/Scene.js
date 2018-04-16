'use strict';

describe('KraGL.app.Scene', () => {
  const assert = chai.assert;
  const Scene = KraGL.app.Scene;
  const Application = KraGL.app.Application;

  describe('constructor', () => {
    it('normal', () => {
      let container = createContainer();
      let app = new _MockApp({ container });
      let scene = new Scene(app);
      assert.isDefined(scene);
      destroyApp(app);
    });
  });

  // Properties

  describe('app', () => {
    it('normal', () => {
      let container = createContainer();
      let app = new _MockApp({ container });
      let scene = new Scene(app);

      assert.equal(scene.app, app);

      destroyApp(app);
    });
  });

  describe('isLoaded', () => {
    it('from UNLOADED', () => {
      let container = createContainer();
      let app = new _MockApp({ container });
      let scene = new _MockScene(app);

      assert.isFalse(scene.isLoaded);

      destroyApp(app);
    });

    it('from LOADING', () => {
      let container = createContainer();
      let app = new _MockApp({ container });
      let scene = new _MockScene(app);

      scene.initResources = function() {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 100);
        });
      };

      let result;
      let promise = scene.load();
      setTimeout(() => {
        result = scene.isLoaded;
      }, 0);

      return promise
      .then(() => {
        assert.isFalse(result);
      })
      .finally(() => {
        destroyApp(app);
      });
    });

    it('from LOADED', () => {
      let container = createContainer();
      let app = new _MockApp({ container });
      let scene = new _MockScene(app);

      return scene.load()
      .then(() => {
        assert.isTrue(scene.isLoaded);
      })
      .finally(() => {
        destroyApp(app);
      });
    });

    it('from CONTEXT_LOST', () => {
      let container = createContainer();
      let app = new _MockApp({ container });
      let scene = new _MockScene(app);

      return scene.load()
      .then(() => {
        assert.isTrue(scene.isLoaded);

        return new Promise(resolve => {
          scene.app.canvas.dispatchEvent(
            new WebGLContextEvent('webglcontextlost'));
          setTimeout(() => {
            resolve();
          }, 100);
        });
      })
      .then(() => {
        assert.isFalse(scene.isLoaded);

        return new Promise(resolve => {
          scene.app.canvas.dispatchEvent(
            new WebGLContextEvent('webglcontextrestored'));
          setTimeout(() => {
            resolve();
          }, 100);
        });
      })
      .then(() => {
        assert.isTrue(scene.isLoaded);
      })
      .finally(() => {
        destroyApp(app);
      });
    });
  });

  describe('isLoading', () => {
    it('from UNLOADED', () => {
      let container = createContainer();
      let app = new _MockApp({ container });
      let scene = new _MockScene(app);

      assert.isFalse(scene.isLoading);

      destroyApp(app);
    });

    it('from LOADING', () => {
      let container = createContainer();
      let app = new _MockApp({ container });
      let scene = new _MockScene(app);

      scene.initResources = function() {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 100);
        });
      };

      let promise = scene.load();

      let result;
      setTimeout(() => {
        result = scene.isLoading;
      }, 0);

      return promise
      .then(() => {
        assert.isTrue(result);
      })
      .finally(() => {
        destroyApp(app);
      });
    });
  });

  // Methods

  describe('clean', () => {
    it('called during unload', () => {
      let container = createContainer();
      let app = new _MockApp({ container });
      let scene = new _MockScene(app);

      let result;
      scene.clean = function() {
        result = true;
        return Promise.resolve();
      };

      return scene.load()
      .then(() => {
        return scene.unload();
      })
      .then(() => {
        assert.isTrue(result);
      })
      .finally(() => {
        destroyApp(app);
      });
    });

    it('called during restart', () => {
      let container = createContainer();
      let app = new _MockApp({ container });
      let scene = new _MockScene(app);

      let result;
      scene.clean = function() {
        result = true;
        return Promise.resolve();
      };

      return scene.load()
      .then(() => {
        return scene.restart();
      })
      .then(() => {
        assert.isTrue(result);
      })
      .finally(() => {
        destroyApp(app);
      });
    });
  });

  describe('initResources', () => {
    it('called during load.', () => {
      let container = createContainer();
      let app = new _MockApp({ container });
      let scene = new _MockScene(app);

      let result;
      scene.initResources = function() {
        result = true;
        return Promise.resolve();
      };

      return scene.load()
      .then(() => {
        assert.isTrue(result);
      })
      .finally(() => {
        destroyApp(app);
      });
    });

    it('called during restart.', () => {
      let container = createContainer();
      let app = new _MockApp({ container });
      let scene = new _MockScene(app);

      let result = 0;
      scene.initResources = function() {
        result++;
        return Promise.resolve();
      };

      return scene.load()
      .then(() => {
        assert.equal(result, 1);
        return scene.restart();
      })
      .then(() => {
        assert.equal(result, 2);
      })
      .finally(() => {
        destroyApp(app);
      });
    });
  });

  describe('initWebGLResources', () => {
    it('called during load.', () => {
      let container = createContainer();
      let app = new _MockApp({ container });
      let scene = new _MockScene(app);

      let result;
      scene.initWebGLResources = function() {
        result = true;
        return Promise.resolve();
      };

      return scene.load()
      .then(() => {
        assert.isTrue(result);
      })
      .finally(() => {
        destroyApp(app);
      });
    });

    it('called during restart.', () => {
      let container = createContainer();
      let app = new _MockApp({ container });
      let scene = new _MockScene(app);

      let result = 0;
      scene.initWebGLResources = function() {
        result++;
        return Promise.resolve();
      };

      return scene.load()
      .then(() => {
        assert.equal(result, 1);
        return scene.restart();
      })
      .then(() => {
        assert.equal(result, 2);
      })
      .finally(() => {
        destroyApp(app);
      });
    });

    it('called when WebGL context is restored.', () => {
      let container = createContainer();
      let app = new _MockApp({ container });
      let scene = new _MockScene(app);

      let result = 0;
      scene.initWebGLResources = function() {
        result++;
        return Promise.resolve();
      };

      return scene.load()
      .then(() => {
        scene.app.canvas.dispatchEvent(
          new WebGLContextEvent('webglcontextlost'));
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 100);
        });
      })
      .then(() => {
        scene.app.canvas.dispatchEvent(
          new WebGLContextEvent('webglcontextrestored'));
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 100);
        });
      })
      .then(() => {
        assert.equal(result, 2);
      })
      .finally(() => {
        destroyApp(app);
      });
    });
  });

  describe('render', () => {
    it('example - invoked by Application.render', () => {
      let container = createContainer();
      let app = new _MockApp({ container });
      let scene = new _MockScene(app);

      app.render = function() {
        if(scene.isLoaded)
          scene.render();
      };

      let result = 0;
      scene.render = function() {
        result++;
      };

      return app.start()
      .then(() => {
        assert.equal(result, 0);
        return scene.load();
      })
      .then(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
      })
      .then(() => {
        assert.isAtLeast(result, 40);
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
      let scene = new _MockScene(app);

      let cleaned = false;
      scene.clean = function() {
        cleaned = true;
        return Promise.resolve();
      };

      let inited = false;
      scene.initResources = function() {
        inited = true;
        return Promise.resolve();
      };

      let initedWebGL = false;
      scene.initWebGLResources = function() {
        initedWebGL = true;
        return Promise.resolve();
      }

      return scene.load()
      .then(() => {
        assert.isTrue(scene.isLoaded);
        assert.isTrue(cleaned && inited && initedWebGL);
        cleaned = inited = initedWebGL = false;
        return scene.restart();
      })
      .then(() => {
        assert.isTrue(scene.isLoaded);
        assert.isTrue(cleaned && inited && initedWebGL);
        cleaned = inited = initedWebGL = false;
        return scene.unload();
      })
      .then(() => {
        assert.isFalse(scene.isLoaded);
        return scene.restart();
      })
      .then(() => {
        assert.isTrue(cleaned && inited && initedWebGL);
        cleaned = inited = initedWebGL = false;
        assert.isTrue(scene.isLoaded);
      })
      .finally(() => {
        destroyApp(app);
      });
    });
  });

  describe('unload', () => {
    it('normal', () => {
      let container = createContainer();
      let app = new _MockApp({ container });
      let scene = new _MockScene(app);

      let cleaned = 0;
      scene.clean = function() {
        cleaned++;
        return Promise.resolve();
      };

      return scene.load()
      .then(() => {
        assert.equal(cleaned, 1);
        return scene.unload();
      })
      .then(() => {
        assert.equal(cleaned, 2);
      })
      .finally(() => {
        destroyApp(app);
      });
    });
  });

  describe('update', () => {
    it('example - called by Application.update', () => {
      let container = createContainer();
      let app = new _MockApp({ container });
      let scene = new _MockScene(app);

      app.update = function() {
        if(scene.isLoaded)
          scene.update();
      };

      let result = 0;
      scene.update = function() {
        result++;
      };

      return app.start()
      .then(() => {
        assert.equal(result, 0);
        return scene.load();
      })
      .then(() => {
        return new Promise(resolve => {
          setTimeout(() => {
            resolve();
          }, 1000);
        });
      })
      .then(() => {
        assert.isAtLeast(result, 40);
      })
      .finally(() => {
        destroyApp(app);
      });
    });
  });
});
