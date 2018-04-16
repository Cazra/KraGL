'use strict';

describe('KraGL.app.SceneManager', () => {
  const assert = chai.assert;
  const SceneManager = KraGL.app.SceneManager;

  describe('constructor', () => {
    it('normal', () => {
      let container = createContainer();
      let app = new _MockApp({ container });
      let sceneManager = new SceneManager();
      assert.isDefined(sceneManager);
      assert.isTrue(sceneManager.isEmpty);

      destroyApp(app);
    });
  });

  // Properties

  describe('curScene', () => {
    it('empty', () => {
      let container = createContainer();
      let app = new _MockApp({ container });
      let sceneManager = new SceneManager();

      assert.equal(sceneManager.curScene.app, undefined);

      destroyApp(app);
    });

    it('scene is loaded', () => {
      let container = createContainer();
      let app = new _MockApp({ container });
      let scene = new _MockScene(app);
      let sceneManager = new SceneManager();

      return sceneManager.load(scene)
      .then(() => {
        assert.equal(sceneManager.curScene, scene);
      })
      .finally(() => {
        destroyApp(app);
      });
    });
  });

  describe('isEmpty', () => {
    it('init', () => {
      let container = createContainer();
      let app = new _MockApp({ container });
      let sceneManager = new SceneManager();
      assert.isTrue(sceneManager.isEmpty);
      destroyApp(app);
    });

    it('loaded', () => {
      let container = createContainer();
      let app = new _MockApp({ container });
      let scene = new _MockScene(app);
      let sceneManager = new SceneManager();

      return sceneManager.load(scene)
      .then(() => {
        assert.isFalse(sceneManager.isEmpty);
      })
      .finally(() => {
        destroyApp(app);
      });
    });

    it('unloaded', () => {
      let container = createContainer();
      let app = new _MockApp({ container });
      let scene = new _MockScene(app);
      let sceneManager = new SceneManager();

      return sceneManager.load(scene)
      .then(() => {
        return sceneManager.unload();
      })
      .then(() => {
        assert.isTrue(sceneManager.isEmpty);
      })
      .finally(() => {
        destroyApp(app);
      });
    });
  });

  // Methods

  describe('load', () => {
    it('newScene defined', () => {
      let container = createContainer();
      let app = new _MockApp({ container });
      let sceneManager = new SceneManager();

      let scene1 = new _MockScene(app);
      let scene2 = new _MockScene(app);
      return sceneManager.load(scene1)
      .then(() => {
        assert.equal(sceneManager.curScene, scene1);
        return sceneManager.load(scene2);
      })
      .then(() => {
        assert.equal(sceneManager.curScene, scene2);
      })
      .finally(() => {
        destroyApp(app);
      });
    });

    it('newScene undefined', () => {
      let container = createContainer();
      let app = new _MockApp({ container });
      let sceneManager = new SceneManager();

      let scene1 = new _MockScene(app);
      return sceneManager.load(scene1)
      .then(() => {
        assert.equal(sceneManager.curScene, scene1);
        return sceneManager.load(undefined);
      })
      .then(() => {
        assert.isTrue(sceneManager.isEmpty);
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
      let sceneManager = new SceneManager();

      let scene1 = new _MockScene(app);
      return sceneManager.load(scene1)
      .then(() => {
        assert.equal(sceneManager.curScene, scene1);
        return sceneManager.unload();
      })
      .then(() => {
        assert.isTrue(sceneManager.isEmpty);
      })
      .finally(() => {
        destroyApp(app);
      });
    });
  });
});
