define('KraGL.math.Segment', ['KraGL.math.AbstractLine'], function() {
  'use strict';

  /**
   * @class Segment
   * @memberof KraGL.math
   * @extends KraGL.math.AbstractLine
   * @classdesc A finite line bounded between two points.
   * @param {vec4} p1
   *        The first endpoint.
   * @param {vec4} p2
   *        The second endpoint.
   */
  KraGL.math.Segment = class extends KraGL.math.AbstractLine {
    constructor(p1, p2) {
      super(p1, p2);
    }

    /**
     * @inheritdoc
     */
    clone() {
      return new KraGL.math.Segment(this._p1, this._p2);
    }

    /**
     * @inheritdoc
     */
    distanceTo(shape) {
      if(shape instanceof KraGL.math.AbstractLine) {
        return this._distanceToAbstractLine(shape);
      }
      else if(shape instanceof KraGL.math.Shape) {
        throw new Error('Not implemented yet.');
      }

      return this._distanceToPoint(shape);
    }

    /**
     * Gets the distance between this Segment and some AbstractLine.
     * @param  {KraGL.math.AbstractLine} line
     * @return {number}
     */
    _distanceToAbstractLine(line) {
      if(shape instanceof KraGL.math.Line ||
          shape instanceof KraGL.math.Ray) {
        return line.distanceTo(this);
      }
      else if(shape instanceof KraGL.math.Segment) {
        var u = this.getVector();
        var uHat = vec3.normalize([], u);
        var v = other.getVector();
        var vHat = vec3.normalize([], v);
        var z = vec3.sub([], other._p1, this._p1);

        var dotUV = vec3.dot(uHat, vHat);
        var dotUZ = vec3.dot(uHat, z);
        var dotVZ = vec3.dot(vHat, z);

        var alpha = (dotUZ-dotUV*dotVZ) / (1-dotUV*dotUV) / vec3.len(u);
        var beta = (dotUV*dotUZ-dotVZ) / (1-dotUV*dotUV) / vec3.len(v);

        // If the projected closest points lie on the segments, get the distance
        // between those points.
        if(alpha >= 0 && alpha <= 1 && beta >= 0 && beta <= 1) {
          var a = vec3.add([], this._p1, vec3.scale([], alpha, u));
          var b = vec3.add([], other._p1, vec3.scale([], beta, v));

          return vec3.len(vec3.sub([], b, a));
        }

        // Otherwise, get the distance between the closest endpoints.
        else {
          var dist1 = vec3.len(z);
          var dist2 = vec3.len(vec3.sub([], other._p2, this._p1));
          var dist3 = vec3.len(vec3.sub([], other._p1, this._p2));
          var dist4 = vec3.len(vec3.sub([], other._p2, this._p2));

          return Math.min(dist1, dist2, dist3, dist4);
        }
      }
    }

    /**
     * Returns the distance of a point to this segment.
     * @param  {vec4} p
     * @return {number}
     */
    _distanceToPoint(p) {
      var u = this.getVector();
      var uHat = vec3.normalize([], u);
      var v = vec3.sub([], p, this._p1);
      var vHat = vec3.normalize([], v);
      var w = vec3.sub([], p, this._p2);

      var dotUV = vec3.dot(u,v);
      var dotUW = vec3.dot(u,w);

      // Is p past p1?
      if(dotUV < 0) {
        return vec3.len(v);
      }

      // Is p past p2?
      else if(dotUW > 0) {
        return vec3.len(w);
      }

      // We're "above" the segment.
      else {
        var sin = vec3.len(vec3.cross([], uHat, vHat));
        return vec3.len(v)*sin;
      }
    }

    /**
     * @inheritdoc
     */
    intersection(shape) {
      if(shape instanceof KraGL.math.AbstractLine) {
        return this._intersectionAbstractLine(shape);
      }

      throw new Error('Not implemented yet.');
    }

    /**
     * See http://geomalgorithms.com/a05-_intersect-1.html.
     * @private
     * @param  {[type]} line
     * @return {[type]}
     */
    _intersectionAbstractLine(line) {
      var u = this.getVector();
      var v = line.getVector();

      if(this.isParallel(line) {

      }
      else {
        var w = vec3.sub([], line.p1(), this.p1());

        var m;
        if(w[0] !== w[1]) {
          m = [
            u[0], u[1],
            -v[0], -v[1]
          ];
          w = [w[0], w[1]];
        }
        else {
          m = [
            u[0], u[2],
            v[0], v[2]
          ];
          w = [w[0], w[2]];
        }

        var invM = mat2.invert([], m);
        var coeffs = vec2.transformFromMat2([], w, invM);
        var s = coeffs[0];
        var t = coeffs[1];

        if(s >= 0 && s <= 1) {
          if(line instanceof KraGL.math.Line ||
            (line instanceof KraGL.math.Ray && t >= 0) ||
            (line instanceof KraGL.math.Segment && t >= 0 && t <= 1)) {
            return KraGL.Math.translate(vec3.scale([], u, s));
          }
        }
      }
    }
  };

});
