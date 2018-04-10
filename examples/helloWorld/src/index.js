'use strict';

/**
 * TODO: This "Hello World" program implements a KraGL application that does
 * just one thing: render a white triangle on a black background. This is
 * the Hello World of any OpenGL system, really.
 *
 * Do also notice that this application uses the ES-Next module system.
 * Grunt takes care of all the work of putting together the app.cat.js file
 * for the whole application from the src code.
 */
class ExampleApp extends KraGL.app.Application {
  /**
   * @inheritdoc
   */
  constructor(opts) {
    super(opts);

    // TODO
  }

  /**
   * @inheritdoc
   */
  clean() {
    // TODO
    return Promise.resolve();
  }

  /**
   * @inheritdoc
   */
  initResources() {
    // TODO
    return Promise.resolve();
  }

  /**
   * @inheritdoc
   */
  initWebGLResources() {
    // TODO
    return Promise.resolve();
  }

  /**
   * @inheritdoc
   */
  render() {
    // TODO
  }

  /**
   * @inheritdoc
   */
  update() {
    // TODO
    console.log(this.fps.toFixed(1));
  }
}

/**
 * Create and start the application in its container.
 */
window.addEventListener('load', () => {
  let container = document.querySelector('#appContainer');
  let app = new ExampleApp({
    container
  });
  app.start();
  console.log('App has started.');
});
