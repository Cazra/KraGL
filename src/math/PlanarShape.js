define('KraGL.math.PlanarShape', ['KraGL.math.Shape'], function() {
  'use strict';

  /**
   * @abstract
   * @class PlanarShape
   * @memberof KraGL.math
   * @extends KraGL.math.Shape
   * @classdesc A 3D shape that can be contained entirely within a plane.
   */
  KraGL.math.PlanarShape = class PlanarShape extends KraGL.math.Shape {
    constructor() {
      super();
    }

    /**
     * Returns a Plane that contains this PlanarShape.
     * @return {KraGL.math.Plane}
     */
    getPlane() {
      throw new Error('Must be implemented by subclass.');
    }

    /**
     * Checks if another PlanarShape is parallel to this one.
     * @param  {KraGL.math.PlanarShape}  other
     * @return {Boolean}
     */
    isParallel(other) {
      _.noop(other);
      throw new Error('Must be implemented by subclass.');
    }

    /**
     * Checks if a subclass of this class implements all of its abstract
     * methods.
     * A warning is printed to the console for any abstract methods that are
     * not implemented.
     */
    static checkImpl(clazz) {
      var superUnimpl = KraGL.math.Shape.checkImpl(clazz);
      var subUnimpl = _.checkAbstractImpl(clazz, this, [
        'getPlane',
        'isParallel'
      ]);
      return superUnimpl.concat(subUnimpl);
    }
  };
});
