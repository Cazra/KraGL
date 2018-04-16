'use strict';

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

/**
 * A mock application with minimally implemented methods.
 */
class _MockApp extends KraGL.app.Application {
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

class _MockScene extends KraGL.app.Scene {
  constructor(app) {
    super(app);
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
