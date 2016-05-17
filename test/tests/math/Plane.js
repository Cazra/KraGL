'use strict';

var assert = chai.assert;

describe('KraGL.math.Plane', function() {

  describe('constructor', function() {
    it('normal case', function() {
      var plane = new KraGL.math.Plane({
        p: [2,3,4],
        n: [1,1,1]
      });
      assert.deepEqual(plane.p, [2,3,4,1]);
      assert.deepEqual(plane.n, [1,1,1]);
    });
    it('default point', function() {
      var plane = new KraGL.math.Plane({
        n: [1,1,1]
      });
      assert.deepEqual(plane.p, [0,0,0,1]);
      assert.deepEqual(plane.n, [1,1,1]);
    });
    it('default normal', function() {
      var plane = new KraGL.math.Plane({
        p: [2,3,4]
      });
      assert.deepEqual(plane.p, [2,3,4,1]);
      assert.deepEqual(plane.n, [0,0,1]);
    });
    it('default', function() {
      var plane = new KraGL.math.Plane();
      assert.deepEqual(plane.p, [0,0,0,1]);
      assert.deepEqual(plane.n, [0,0,1]);
    });
    it('bad case - normal set to [0,0,0]', function() {
      assert.throws(function() {
        new KraGL.math.Plane({
          n: [0,0,0]
        });
      });
    });
  });

  describe('normal', function() {
    it('get/set - normal', function() {
      var plane = new KraGL.math.Plane();
      assert.deepEqual(plane.normal, [0,0,1]);
      assert.deepEqual(plane.n, [0,0,1]);

      plane.normal = [2,3,4];
      assert.deepEqual(plane.normal, [2,3,4]);
      assert.deepEqual(plane.n, [2,3,4]);

      plane.n = [1,1,1];
      assert.deepEqual(plane.normal, [1,1,1]);
      assert.deepEqual(plane.n, [1,1,1]);
    });
    it('bad case - normal set to [0,0,0]', function() {
      var plane = new KraGL.math.Plane();
      assert.throws(function() {
        plane.normal = [0,0,0];
      });
    });
  });

  describe('point', function() {
    it('get/set', function() {
      var plane = new KraGL.math.Plane();
      assert.deepEqual(plane.point, [0,0,0,1]);
      assert.deepEqual(plane.p, [0,0,0,1]);

      plane.point = [1,1,1];
      assert.deepEqual(plane.point, [1,1,1,1]);
      assert.deepEqual(plane.p, [1,1,1,1]);

      plane.p = [2,3,4];
      assert.deepEqual(plane.point, [2,3,4,1]);
      assert.deepEqual(plane.p, [2,3,4,1]);
    });
  });


  describe('contains', function() {
    it('true', function() {
      var plane = new KraGL.math.Plane({
        p: [1,1,1],
        n: [-1,1,0]
      });
      assert.isTrue(plane.contains([2,2,4,1]));

      plane = new KraGL.math.Plane();
      assert.isTrue(plane.contains([0,0,0,1]));
    });
    it('false', function() {
      var plane = new KraGL.math.Plane({
        p: [1,1,1],
        n: [-1,-1,0]
      });
      assert.isFalse(plane.contains([2,3,4,1]));
    });
  });

  describe('distanceTo', function() {
    it('point', function() {
      var plane = new KraGL.math.Plane({
        p: [1,1,1],
        n: [2,0,0]
      });
      assert.approximately(plane.distanceTo([2,3,4,1]), 1, 0.0001);

      plane.n = [3,3,3];
      assert.approximately(plane.dist([2,2,2,1]), vec3.length([1,1,1]), 0.0001);
      assert.approximately(plane.dist([0,0,0,1]), vec3.length([1,1,1]), 0.0001);

      plane.n = [0,1,0];
      assert.approximately(plane.dist([0,1,0,1]), 0, 0.0001);
    });
  });


  describe('intersection', function() {
    it('Line - point', function() {
      var plane = new KraGL.math.Plane({
        p: [1,1,1],
        n: [0,1,0]
      });
      var line = new KraGL.math.Line({
        p1: [2,0,2],
        p2: [4,2,4]
      });
      var actual = plane.intersection(line);
      var expected = [3,1,3,1];
      assert.vecApproximately(actual, expected, 0.0001);

      line = new KraGL.math.Line({
        p1: [1,1,1],
        p2: [2,2,2]
      });
      actual = plane.intersection(line);
      expected = [1,1,1,1];
      assert.vecApproximately(actual, expected, 0.0001);

      line = new KraGL.math.Line({
        p1: [2,2,2],
        p2: [1,1,1]
      });
      actual = plane.intersection(line);
      expected = [1,1,1,1];
      assert.vecApproximately(actual, expected, 0.0001);

      line = new KraGL.math.Line({
        p1: [3,3,3],
        p2: [2,2,2]
      });
      actual = plane.intersection(line);
      expected = [1,1,1,1];
      assert.vecApproximately(actual, expected, 0.0001);
    });
    it('Line - line', function() {
      var plane = new KraGL.math.Plane({
        p: [1,1,1],
        n: [0,1,0]
      });
      var line = new KraGL.math.Line({
        p1: [2,1,2],
        p2: [3,1,4]
      });
      var actual = plane.intersection(line);
      assert.isTrue(actual instanceof KraGL.math.Line);
      assert.vecApproximately(actual.p1, line.p1, 0.0001);
      assert.vecApproximately(actual.p2, line.p2, 0.0001);
    });
    it('Line - no intersection', function() {
      var plane = new KraGL.math.Plane({
        p: [1,1,1],
        n: [0,1,0]
      });
      var line = new KraGL.math.Line({
        p1: [2,3,2],
        p2: [3,3,4]
      });

      assert.isUndefined(plane.intersection(line));
    });

    it('Ray - point', function() {
      var plane = new KraGL.math.Plane({
        p: [1,1,1],
        n: [0,1,0]
      });
      var ray = new KraGL.math.Ray({
        p1: [2,5,2],
        p2: [2,3,2]
      });
      var actual = plane.intersection(ray);
      var expected = [2,1,2,1];
      assert.vecApproximately(actual, expected, 0.0001);

      ray = new KraGL.math.Ray({
        p1: [1,1,1],
        p2: [2,2,2]
      });
      actual = plane.intersection(ray);
      expected = [1,1,1,1];
      assert.vecApproximately(actual, expected, 0.0001);
    });
    it('Ray - ray', function() {
      var plane = new KraGL.math.Plane({
        p: [1,1,1],
        n: [0,1,0]
      });
      var ray = new KraGL.math.Ray({
        p1: [2,1,2],
        p2: [3,1,4]
      });
      var actual = plane.intersection(ray);
      assert.isTrue(actual instanceof KraGL.math.Ray);
      assert.vecApproximately(actual.p1, ray.p1, 0.0001);
      assert.vecApproximately(actual.p2, ray.p2, 0.0001);
    });
    it('Ray - no intersection', function() {
      var plane = new KraGL.math.Plane({
        p: [1,1,1],
        n: [0,1,0]
      });

      // behind ray
      var ray = new KraGL.math.Ray({
        p1: [2, 1.1, 2],
        p2: [3,4,5]
      });
      assert.isUndefined(plane.intersection(ray));

      // parallel ray not on plane.
      ray = new KraGL.math.Ray({
        p1: [2,2,2],
        p2: [3,2,4]
      });
      assert.isUndefined(plane.intersection(ray));
    });

    it('Segment - point', function() {
      var plane = new KraGL.math.Plane({
        p: [1,1,1],
        n: [0,1,0]
      });
      var seg = new KraGL.math.Segment({
        p1: [2,2,2],
        p2: [2,-2,2]
      });
      var actual = plane.intersection(seg);
      var expected = [2,1,2,1];
      assert.vecApproximately(actual, expected, 0.0001);

      seg = new KraGL.math.Segment({
        p1: [1,1,1],
        p2: [2,2,2]
      });
      actual = plane.intersection(seg);
      expected = [1,1,1,1];
      assert.vecApproximately(actual, expected, 0.0001);

      seg = new KraGL.math.Segment({
        p1: [2,3,4],
        p2: [1,1,1]
      });
      actual = plane.intersection(seg);
      expected = [1,1,1,1];
      assert.vecApproximately(actual, expected, 0.0001);
    });
    it('Segment - segment', function() {
      var plane = new KraGL.math.Plane({
        p: [1,1,1],
        n: [0,1,0]
      });
      var seg = new KraGL.math.Segment({
        p1: [2,1,3],
        p2: [4,1,5]
      });
      var actual = plane.intersection(seg);
      assert.isTrue(actual instanceof KraGL.math.Segment);
      assert.vecApproximately(actual.p1, seg.p1, 0.0001);
      assert.vecApproximately(actual.p2, seg.p2, 0.0001);
    });
    it('Segment - no intersection', function () {
      var plane = new KraGL.math.Plane({
        p: [1,1,1],
        n: [0,1,0]
      });

      // behind segment
      var seg = new KraGL.math.Segment({
        p1: [1,2,1],
        p2: [2,3,4]
      });
      assert.isUndefined(plane.intersection(seg));

      // in front of segment.
      seg = new KraGL.math.Segment({
        p1: [2,3,4],
        p2: [1,2,1]
      });
      assert.isUndefined(plane.intersection(seg));

      // parallel segment not on plane.
      seg = new KraGL.math.Segment({
        p1: [2,2,2],
        p2: [3,2,1]
      });
      assert.isUndefined(plane.intersection(seg));
    });

    it.skip('Plane - true', function() {
      throw new Error('TODO');
    });
    it.skip('Plane - false', function() {
      throw new Error('TODO');
    });
  });


  describe('intersects', function() {
    it('Line - true', function() {
      var plane = new KraGL.math.Plane({
        p: [1,1,1],
        n: [-1,1,0]
      });

      // Intersect through point
      var line = new KraGL.math.Line({
        p1: [0,3,3],
        p2: [2,3,-3]
      });
      assert.isTrue(plane.intersects(line));

      line = new KraGL.math.Line({
        p1: [20, 5, 1],
        p2: [-3, 8, 42]
      });
      assert.isTrue(plane.intersects(line));

      line = new KraGL.math.Line({
        p1: [1,1,1],
        p2: [2,3,4]
      });
      assert.isTrue(plane.intersects(line));

      // Parallel line on plane.
      line = new KraGL.math.Line({
        p1: [2,2,2],
        p2: [3,3,3]
      });
      assert.isTrue(plane.intersects(line));
    });
    it('Line - false', function() {
      var plane = new KraGL.math.Plane({
        p: [1,1,1],
        n: [-1,1,0]
      });

      // Parallel line not on plane.
      var line = new KraGL.math.Line({
        p1: [1,2,0],
        p2: [2,3,0]
      });
      assert.isFalse(plane.intersects(line));
    });

    it('Ray - true', function() {
      var plane = new KraGL.math.Plane({
        p: [1,1,1],
        n: [0,1,0]
      });

      // Intersect through point.
      var ray = new KraGL.math.Ray({
        p1: [0,2,0],
        p2: [4, -4, 3]
      });
      assert.isTrue(plane.intersects(ray));

      ray = new KraGL.math.Ray({
        p1: [5, 100, 0],
        p2: [4, 80, 2]
      });
      assert.isTrue(plane.intersects(ray));

      ray = new KraGL.math.Ray({
        p1: [1,1,1],
        p2: [1,2,3]
      });
      assert.isTrue(plane.intersects(ray));

      // Parallel ray on plane.
      ray = new KraGL.math.Ray({
        p1: [2,1,2],
        p2: [3,1,4]
      });
      assert.isTrue(plane.intersects(ray));
    });
    it('Ray - false', function() {
      var plane = new KraGL.math.Plane({
        p: [1,1,1],
        n: [0,1,0]
      });

      // Facing opposite way.
      var ray = new KraGL.math.Ray({
        p1: [2,2,2],
        p2: [2,4,3]
      });
      assert.isFalse(plane.intersects(ray));

      // Parallel ray not on plane.
      ray = new KraGL.math.Ray({
        p1: [2,2,2],
        p2: [3,2,3]
      });
      assert.isFalse(plane.intersects(ray));
    });

    it('Segment - true', function() {
      var plane = new KraGL.math.Plane({
        p: [1,1,1],
        n: [0,1,0]
      });

      // Intersect through point.
      var seg = new KraGL.math.Segment({
        p1: [2,2,2],
        p2: [3,-2,4]
      });
      assert.isTrue(plane.intersects(seg));

      seg = new KraGL.math.Segment({
        p1: [1,1,1],
        p2: [2,3,4]
      });
      assert.isTrue(plane.intersects(seg));

      seg = new KraGL.math.Segment({
        p1: [2,3,4],
        p2: [1,1,1]
      });
      assert.isTrue(plane.intersects(seg));

      // Parallel segment on plane.
      seg = new KraGL.math.Segment({
        p1: [2,1,3],
        p2: [5,1,42]
      });
      assert.isTrue(plane.intersects(seg));
    });
    it('Segment - false', function() {
      var plane = new KraGL.math.Plane({
        p: [1,1,1],
        n: [0,1,0]
      });

      // Behind segment.
      var seg = new KraGL.math.Segment({
        p1: [1,2,1],
        p2: [4,4,4]
      });
      assert.isFalse(plane.intersects(seg));

      // In front of segment.
      seg = new KraGL.math.Segment({
        p1: [5,3,4],
        p2: [2, 1.1, 0]
      })
      assert.isFalse(plane.intersects(seg));

      // Parallel segment not on plane.
      seg = new KraGL.math.Segment({
        p1: [2,2,2],
        p2: [3,2,5]
      });
      assert.isFalse(plane.intersects(seg));
    });

    it.skip('Plane - true', function() {
      throw new Error('TODO');
    });
    it.skip('Plane - false', function() {
      throw new Error('TODO');
    });
  });

  describe('isParallel', function() {
    it('Line', function() {
      var plane = new KraGL.math.Plane({
        p: [1,1,1],
        n: [0,1,0]
      });
      var line = new KraGL.math.Line({
        p1: [2,2,2],
        p2: [3,2,5]
      });
      assert.isTrue(plane.isParallel(line));

      line = new KraGL.math.Line({
        p1: [1,1,1],
        p2: [2,1,4]
      });
      assert.isTrue(plane.isParallel(line));

      line = new KraGL.math.Line({
        p1: [2,3,4],
        p2: [5,6,7]
      });
      assert.isFalse(plane.isParallel(line));
    });

    it('Ray', function() {
      var plane = new KraGL.math.Plane({
        p: [1,1,1],
        n: [0,1,0]
      });
      var ray = new KraGL.math.Ray({
        p1: [2,2,2],
        p2: [3,2,5]
      });
      assert.isTrue(plane.isParallel(ray));

      ray = new KraGL.math.Ray({
        p1: [1,1,1],
        p2: [2,1,4]
      });
      assert.isTrue(plane.isParallel(ray));

      ray = new KraGL.math.Ray({
        p1: [2,3,4],
        p2: [5,6,7]
      });
      assert.isFalse(plane.isParallel(ray));
    });

    it('Segment', function() {
      var plane = new KraGL.math.Plane({
        p: [1,1,1],
        n: [0,1,0]
      });
      var seg = new KraGL.math.Segment({
        p1: [2,2,2],
        p2: [3,2,5]
      });
      assert.isTrue(plane.isParallel(seg));

      seg = new KraGL.math.Segment({
        p1: [1,1,1],
        p2: [2,1,4]
      });
      assert.isTrue(plane.isParallel(seg));

      seg = new KraGL.math.Segment({
        p1: [2,3,4],
        p2: [5,6,7]
      });
      assert.isFalse(plane.isParallel(seg));
    });

    it('Plane', function() {
      var plane = new KraGL.math.Plane({
        p: [1,1,1],
        n: [0,1,0]
      });
      var other = new KraGL.math.Plane({
        p: [1,2,1],
        n: [0,1,0]
      });
      assert.isTrue(plane.isParallel(other));

      other = new KraGL.math.Plane({
        p: [1,2,1],
        n: [1,1,1]
      });
      assert.isFalse(plane.isParallel(other));
    });
  });

  describe.skip('render', function() {
    it('normal case', function() {
      throw new Error('TODO');
    });
  });

});
