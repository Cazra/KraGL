'use strict';

const Mesh = KraGL.geo.Mesh;
const Canvas = KraGL.util.Canvas;

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
    return Promise.resolve()
    .then(() => {
      this.shaderLib.clean();
    });
  }

  /**
   * @inheritdoc
   */
  initResources() {
    return Promise.resolve();
  }

  /**
   * @inheritdoc
   */
  initWebGLResources() {
    return Promise.resolve()
    .then(() => {
      return this.shaderLib.createPrograms({
        'simple': {
          shaders: {
            frag: {
              urls: ['./shaders/frag.glsl']
            },
            vert: {
              urls: ['./shaders/vert.glsl']
            }
          },
          attributeGetters: {
            position: 'xyz'
          }
        }
      })
      .then(() => {
        this.shaderLib.enable('simple');
      });
    })
    .then(() => {
      this.meshLib.add('tri1', new Mesh({
        vertices: [
          { xyz: [0, 0, 0] },
          { xyz: [1, 0, 0] },
          { xyz: [0, 1, 0] }
        ],
        indices: [0, 1, 2]
      }));
    });
  }

  /**
   * @inheritdoc
   */
  render() {
    // Clear black by default.
    Canvas.clear(this.gl);
    this.shaderLib.enable('simple');

    // Draw a white triangle.
    this.meshLib.get('tri1').render(this);
  }

  /**
   * @inheritdoc
   */
  update() {
    // Nothing too interesting here. Just write the current framerate to the
    // console.
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
