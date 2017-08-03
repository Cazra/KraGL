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
     * Checks if another PlanarShape is coplanar with this one.
     * @param  {KraGL.math.PlanarShape}  other
     * @return {Boolean}
     */
    isCoplanar(other, tolerance) {
      var tPlane = this.getPlane();
      var oPlane = other.getPlane();
      return tPlane.approx(oPlane, tolerance);
    }

    /**
     * Checks if another PlanarShape or an AbstractLine is parallel to this.
     * @param {(KraGL.math.PlanarShape|KraGL.math.AbstractLine)}  other
     * @param {number} [tolerance=KraGL.Math.EPSILON]
     * @return {Boolean}
     */
    isParallel(other, tolerance) {
      var tPlane = this.getPlane();
      if(other instanceof KraGL.math.AbstractLine) {
        var dotNV = vec3.dot(tPlane.n, other.vec);
        return KraGL.Math.approx(dotNV, 0, tolerance);
      }
      else if(other instanceof KraGL.math.Plane) {
        var sinNormals = vec3.length(vec3.cross([], tPlane.n, other.n));
        return KraGL.Math.approx(sinNormals, 0, tolerance);
      }
      else
        throw new Error('Shape not supported: ' + other);
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
        'getPlane'
      ]);
      return superUnimpl.concat(subUnimpl);
    }
  };
});
