'use strict';

import { KraGLError } from './KraGLError';

/**
 * An error dealing with abstract classes and their methods.
 * This is thrown by abstract methods that haven't been implemented by
 * a subclass.
 */
class AbstractError extends KraGLError {
  constructor(msg) {
    super(msg);
  }
}
export { AbstractError };
