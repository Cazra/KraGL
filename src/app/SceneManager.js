'use strict';

import { Scene } from './Scene';

/**
 * A scene that does nothing, used as a placeholder for when no actual
 * scene is loaded in a SceneManager.
 * @private
 */
class _EmptyScene extends Scene {
  constructor() {
    super(undefined);
  }
  clean() {
    return Promise.resolve();
  }
  _initContextLossHandlers() {}
  initResources() {
    return Promise.resolve();
  }
  initWebGLResources() {
    return Promise.resolve();
  }
  _removeContextLossHandlers() {}
  render() {}
  update() {}
}

/**
 * This class provides a conventient way to safely switch out scenes.
 */
export class SceneManager {

  /**
   * The currently loaded scene.
   * @type {KraGL.app.Scene}
   */
  get curScene() {
    return this._curScene;
  }

  /**
   * Whether a scene is not currently loaded.
   * @type {boolean}
   */
  get isEmpty() {
    return (this.curScene instanceof _EmptyScene);
  }

  /**
   * Constructor for an initially empty SceneManager.
   */
  constructor() {
    this._curScene = new _EmptyScene();
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
      newScene = new _EmptyScene();

    // Swap out the scenes.
    let oldScene = this._curScene;
    this._curScene = newScene;

    // Unload the old scene.
    return Promise.resolve()
    .then(() => {
      if(oldScene && oldScene.isLoaded)
        return oldScene.unload();
    })

    // Load the new scene.
    .then(() => {
      if(newScene && !newScene.isLoaded)
        return newScene.load();
    });
  }

  /**
   * Unloads the current scene.
   * @return {Promise}
   */
  unload() {
    return this.load(undefined);
  }
}
