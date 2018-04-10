'use strict';

import { Scene } from './Scene';

/**
 * A scene that does nothing, used as a placeholder for when no actual
 * scene is loaded in a SceneManager.
 * @private
 */
class _EmptyScene extends Scene {
  constructor(app) {
    super(app);
  }
  clean() {}
  initResources() {}
  initWebGLResources() {}
  render() {}
  update() {}
}

/**
 * This class provides a conventient way to safely switch out scenes.
 */
export class SceneManager {

  /**
   * Reference to the parent application.
   * @type {KraGL.app.Application}
   */
  get app() {
    return this._app;
  }

  /**
   * The currently loaded scene.
   * @type {KraGL.app.Scene}
   */
  get curScene() {
    return this._curScene;
  }

  /**
   * @param {KraGL.app.Application} app
   * @param {KraGL.app.Scene} [initialScene]
   *        If specified, the SceneManager will initially be loaded with this
   *        scene.
   */
  constructor(app, initialScene) {
    this._app = app;
    this.load(initialScene);
  }

  /**
   * Switches the current scene. The old scene is unloaded and then the
   * new scene is loaded in its place. Multiple calls to this method will be
   * queued using an internal Promise.
   * @param {(KraGL.app.Scene|undefined)} newScene
   * @return {Promise}
   */
  load(newScene) {
    // If no scene is given, use a placeholder scene with no behavior.
    if(!newScene)
      newScene = new _EmptyScene(this.app);

    // Swap out the scenes.
    let oldScene = this._curScene;
    this._curScene = newScene;

    // Unload the old scene.
    this._loadPromise = (this._loadPromise || Promise.resolve())
    .then(() => {
      if(oldScene && oldScene.isLoaded)
        return oldScene.unload();
    })

    // Load the new scene.
    .then(() => {
      if(newScene && !newScene.isLoaded)
        return newScene.load();
    });
    return this._loadPromise;
  }
}
