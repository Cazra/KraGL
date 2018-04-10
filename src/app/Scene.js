'use strict';

import { AbstractError } from '../AbstractError';
import { KraGLError } from '../KraGLError';

const UNLOADED = 0;
const LOADING = 1;
const LOADED = 2;
const CONTEXT_LOST = 3;

/**
 * Base class for scenes, distinct parts of the application with their own
 * resources, logic, and rendering. Scenes can be loaded, unloaded, and
 * resused as needed.
 * @abstract
 * @memberof KraGL.app
 */
export class Scene {

  /**
   * The application this scene belongs to. Use this to access the
   * application's global resources from within the scene.
   * @type {KraGL.app.Application}
   */
  get app() {
    return this._app;
  }

  /**
   * Whether this scene is loaded.
   * @type {boolean}
   */
  get isLoaded() {
    return this._state === LOADED;
  }

  /**
   * Whether the scene is loading.
   * @type {boolean}
   */
  get isLoading() {
    return this._state === LOADING;
  }

  /**
   * @param {KraGL.app.Application} app
   *        The application containing this scene.
   */
  constructor(app) {
    this._app = app;
    this._state = UNLOADED;
  }

  /**
   * Cleans up the scene's WebGL resources, non-WebGL resources, and state.
   * @abstract
   * @return {Promise}
   */
  clean() {
    throw new AbstractError();
  }

  /**
   * Sets up the handlers for the webglcontextlost and
   * webglcontextrestored events so that if our context is lost and then
   * later restored, we can automagically restore the scene's WebGL resources.
   */
  _initContextLossHandlers() {
    // Setup the context lost handler.
    this._contextLostHandler = evt => {
      evt.preventDefault();
      this._state = CONTEXT_LOST;
    };
    this.app.canvas.addEventListener('webglcontextlost',
      this._contextLostHandler);

    // Setup the context restored handler.
    this._contextRestoredHandler = () => {
      this.initWebGLResources()
      .then(() => {
        this._state = LOADED;
      });
    };
    this.app.canvas.addEventListener('webglcontextrestored',
      this._contextRestoredHandler );
  }

  /**
   * Initializes the non-WebGL resources for the scene.
   * @abstract
   * @return {Promise}
   */
  initResources() {
    throw new AbstractError();
  }

  /**
   * Initializes the scene's WebGL resources. This includes shaders, textures,
   * and any other resources that must be loaded onto the GPU.
   * @abstract
   * @return {Promise}
   */
  initWebGLResources() {
    throw new AbstractError();
  }

  /**
   * Loads the scene by setting up its context loss handlers, loading its
   * resources, and setting its initial state.
   * @return {Promise}
   */
  load() {
    if(this._state === UNLOADED) {
      this._initContextLossHandlers();
      return this.restart();
    }
    else
      throw new KraGLError('The scene is already loaded.');
  }

  /**
   * Removes the handlers for webglcontextlost and webglcontextrestored events
   * for the scene.
   */
  _removeContextLossHandlers() {
    this.app.canvas.removeEventListener('webglcontextlost',
      this._contextLostHandler);
    this.app.canvas.removeEventListener('webglcontextrestored',
      this._contextRestoredHandler);
  }

  /**
   * Renders the scene.
   * @abstract
   */
  render() {
    throw new AbstractError();
  }

  /**
   * Restarts the scene.
   * @return {Promise}
   */
  restart() {
    // Load the scene's resources asynchronously in the background.
    this._state = LOADING;
    return this.clean()
    .then(() => {
      return Promise.all([
        this.initResources(),
        this.initWebGLResources()
      ]);
    })
    .then(() => {
      this._state = LOADED;
    });
  }

  /**
   * Unloads the scene by removing its context loss handlers and unloading its
   * resources.
   * @return {Promise}
   */
  unload() {
    if(this._state === LOADED) {
      this._state = UNLOADED;
      this._removeContextLossHandlers();
      return this.clean();
    }
    else
      throw new KraGLError('The scene isn\'t loaded.');
  }

  /**
   * Updates the scene by 1 frame.
   * @abstract
   */
  update() {
    throw new AbstractError();
  }
}
