'use strict';

import { AbstractError } from '../AbstractError';
import { KraGLError } from '../KraGLError';
import { ShaderLib } from '../shaders';

const NOT_STARTED = 0;
const RUNNING = 1;
const PAUSED = 2;
const LOADING = 3;
const CONTEXT_LOST = 4;
const ENDED = 5;

/**
 * Base class for all KraGL applications. This provides the root context
 * for your app including its ShaderLib, its materials, its geometries, its
 * canvas and WebGL context, and any other data that is part of your app.
 * When the app is started, it will load its initial resources and then begin
 * its update/render animation loop. Optimally, this loop will run at 60Hz.
 * @abstract
 * @memberof KraGL.app
 */
export class Application {

  /**
   * The KraGL application's canvas element.
   * @type {CanvasElement}
   */
  get canvas() {
    return this._canvas;
  }

  /**
   * The div element containing the KraGL application.
   * @type {Element}
   */
  get container() {
    return this._container;
  }

  /**
   * The KraGL application's WebGL context.
   * @type {WebGL}
   */
  get gl() {
    return this._gl;
  }

  /**
   * The height of the application's drawing buffer.
   * @type {uint}
   */
  get height() {
    return this.gl.drawingBufferHeight;
  }

  /**
   * Whether the application is busy loading its resources.
   * @type {boolean}
   */
  get isLoading() {
    return this._state === LOADING;
  }

  /**
   * Whether the application is hard-paused.
   * @type {boolean}
   */
  get isPaused() {
    return this._state === PAUSED;
  }

  /**
   * Whether the application is running.
   * @type {boolean}
   */
  get isRunning() {
    return this._state === RUNNING;
  }

  /**
   * The application's global library of ShaderPrograms.
   * @type {KraGL.shaders.ShaderLib}
   */
  get shaderLib() {
    return this._shaderLib;
  }

  /**
   * The width of the application's drawing buffer.
   * @type {uint}
   */
  get width() {
    return this.gl.drawingBufferWidth;
  }

  /**
   * @param {object} opts
   * @param {(Element|string)} container
   *        The div container for the application. This can be provided either
   *        as the div element itself or as a CSS selector for it.
   *        The canvas for the application will be created inside of this
   *        container.
   * @param {WebGLContextAttributes} [glAttrs]
   *        Any optional attributes for creating the WebGL context.
   *        By default, KraGL will set the alpha property to false, but
   *        otherwise the defaults from the WebGL specification are used.
   * @param {string} [glVersion="1.0"]
   *        The version of WebGL to use.
   * @param {uint} [height]
   *        The height of the application canvas. If not specified, the
   *        container's height will be used.
   * @param {uint} [width]
   *        The width of the application canvas. If not specified, the
   *        container's width will be used.
   */
  constructor(opts) {
    // Get the app's container.
    this._container = opts.container;
    if(_.isString(opts.container))
      this._container = document.querySelector(opts.container);
    if(!this._container)
      throw new KraGLError('Could not find application container ' +
        opts.container);

    // Create the app's canvas.
    this._canvas = document.createElement('canvas');
    this._canvas.width = opts.width ||
      this._container.getBoundingClientRect().width;
    this._canvas.height = opts.height ||
      this._container.getBoundingClientRect().height;
    this._container.appendChild(this._canvas);

    // Create the canvas's WebGL context.
    let glVersion = opts.glVersion || '1.0';
    let contextType = 'webgl';
    if(glVersion === '2.0')
      contextType = 'webgl2';

    let glAttrs = opts.glAttrs || {};
    glAttrs.alpha = glAttrs.alpha || false;
    glAttrs.stencil = true;

    this._gl = this._canvas.getContext(contextType, glAttrs);

    // Create a ShaderLib for this application.
    this._shaderLib = new ShaderLib(this._gl);

    this._state = NOT_STARTED;
  }

  /**
   * Cleans up the application's WebGL resources, non-WebGL resources,
   * and state.
   * Do not call this directly.
   * @abstract
   * @return {Promise}
   */
  clean() {
    throw new AbstractError();
  }

  /**
   * Ends the application after the current frame. Once an application has
   * ended, it cannot be restarted.
   */
  end() {
    cancelAnimationFrame(this._nextFrame);
    this._nextFrame = requestAnimationFrame(() => {
      this._state = ENDED;
    });
  }

  /**
   * Sets up the handlers for the application's webglcontextlost and
   * webglcontextrestored events so that if our context is lost and then
   * later restored, we can automagically restore our app's WebGL resources.
   */
  _initContextLossHandlers() {
    let prevState;

    // Setup the context lost handler.
    this.canvas.addEventListener('webglcontextlost', evt => {
      evt.preventDefault();

      prevState = this._state;
      this._state = CONTEXT_LOST;

      cancelAnimationFrame(this._nextFrame);
      console.warn('The WebGL context has been lost.', evt);
    }, false);

    // Setup the context restored handler.
    this.canvas.addEventListener('webglcontextrestored', evt => {
      this.initWebGLResources()
      .then(() => {
        console.info('The WebGL context has been restored.', evt);
        if(prevState === RUNNING)
          this._run();
        else if(prevState === LOADING)
          this.restart();
      }, false);
    });
  }

  /**
   * Initializes the application's global non-WebGL resources. We won't be
   * in danger of losing these resources if our WebGL context is lost.
   * @abstract
   * @return {Promise}
   */
  initResources() {
    throw new AbstractError();
  }

  /**
   * Initializes the application's global WebGL resources.
   * This is also called anytime that the WebGL context is lost and
   * subsequently restored.
   * @abstract
   * @return {Promise}
   */
  initWebGLResources() {
    throw new AbstractError();
  }

  /**
   * Hard-pauses the application. While the applicataion is hard-paused, it
   * won't perform any update or render frames.
   * The application can be unpaused by calling app.resume().
   */
  pause() {
    cancelAnimationFrame(this._nextFrame);
    this._nextFrame = requestAnimationFrame(() => {
      this._state = PAUSED;
    });

    // TODO: pause music/sound
  }

  /**
   * Performs 1 frame of rendering the app to its canvas.
   * Do not call this directly.
   * @abstract
   */
  render() {
    throw new AbstractError();
  }

  /**
   * Restarts the application after the current frame.
   */
  restart() {
    cancelAnimationFrame(this._nextFrame);
    this._nextFrame = requestAnimationFrame(() => {
      this._state = LOADING;

      // Clean and reload the app's state and resources.
      this.clean()
      .then(() => {
        return Promise.all([
          this.initResources(),
          this.initWebGLResources()
        ]);
      })
      .then(() => {
        this._run();
      });
    });
  }

  /**
   * Resumes the application after it has been paused.
   */
  resume() {
    cancelAnimationFrame(this._nextFrame);
    this._nextFrame = requestAnimationFrame(() => {
      this._run();
    });
  }

  /**
   * The update/render loop.
   */
  _run() {
    this._nextFrame = requestAnimationFrame(() => {
      this._run();
    });
    this._state = RUNNING;

    this.update();
    this.render();
  }

  /**
   * Initializes the application and starts its update/render animation loop.
   * This should only ever be called once in the application's life cycle.
   */
  start() {
    if(this._state === NOT_STARTED) {
      this._initContextLossHandlers();
      this.restart();
    }
    else
      throw new KraGLError('Cannot start the application instance ' +
        'more than once.');
  }

  /**
   * Perform 1 frame of updating the app's state.
   * Do not call this directly.
   * @abstract
   */
  update() {
    throw new AbstractError();
  }
}