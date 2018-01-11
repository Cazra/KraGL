'use strict';

var assert = chai.assert;

describe('KraGL.math.Line', function() {

  describe('constructor', function() {
    it('normal case', function() {
      var line = new KraGL.math.Line({
        p1: [1,2,3],
        p2: [5,6,7]
      });
      assert.vecApproximately(line.p1, [1,2,3,1], 0.0001);
      assert.vecApproximately(line.p2, [5,6,7,1], 0.0001);
    });
    it('bad case - same endpoints', function() {
      assert.throws(function() {
        new KraGL.math.Line({
          p1: [1,2,3],
          p2: [1,2,3]
        });
      });
    });
  });

  describe('p1', function() {
    it('normal case', function() {
      var line = new KraGL.math.Line({
        p1: [1,2,3],
        p2: [5,6,7]
      });

      assert.vecApproximately(line.p1, [1,2,3,1], 0.0001);

      line.p1 = [2,3,4];
      assert.vecApproximately(line.p1, [2,3,4,1], 0.0001);

      line.p1 = [3,4,5];
      assert.vecApproximately(line.p1, [3,4,5,1], 0.0001);
    });
    it('bad case - same endpoints', function() {
      assert.throws(function() {
        var line = new KraGL.math.Line({
          p1: [1,2,3],
          p2: [5,6,7]
        });

        line.p1 = [5,6,7];
      });
    });
  });

  describe('p2', function() {
    it('normal case', function() {
      var line = new KraGL.math.Line({
        p1: [1,2,3],
        p2: [5,6,7]
      });

      assert.vecApproximately(line.p2, [5,6,7,1], 0.0001);

      line.p2 = [2,3,4];
      assert.vecApproximately(line.p2, [2,3,4,1], 0.0001);

      line.p2 = [3,4,5];
      assert.vecApproximately(line.p2, [3,4,5,1], 0.0001);
    });
    it('bad case - same endpoints', function() {
      assert.throws(function() {
        var line = new KraGL.math.Line({
          p1: [1,2,3],
          p2: [5,6,7]
        });

        line.p2 = [1,2,3];
      });
    });
  });

  describe('quat', function() {
    it('normal case', function() {
      var line = new KraGL.math.Line({
        p1: [1,1,1],
        p2: [2,3,4]
      });

      var q = line.quat;
      var pt = [1,0,0,1];
      pt = vec4.transformQuat([], pt, q);
      var expected = vec3.normalize([], [1,2,3]);
      expected[3] = 1;
      assert.vecApproximately(pt, expected, 0.0001);
    });
  });

  describe('vec', function() {
    it('normal case', function() {
      var line = new KraGL.math.Line({
        p1: [1,1,1],
        p2: [2,3,4]
      });
      assert.vecApproximately(line.vec, [1,2,3], 0.0001);

      line.vec = [2,0,0];
      assert.vecApproximately(line.vec, [2,0,0], 0.0001);
      assert.vecApproximately(line.p2, [3,1,1,1], 0.0001);

      line.vec = [1,1,1];
      assert.vecApproximately(line.p2, [2,2,2,1], 0.0001);
    });
  });


  describe('contains', function() {
    it('normal case', function() {
      var line = new KraGL.math.Line({
        p1: [1,1,1],
        p2: [5,1,1]
      });

      assert.isTrue(line.contains([1,1,1,1]));
      assert.isTrue(line.contains([5,1,1,1]));
      assert.isTrue(line.contains([42,1,1,1]));
      assert.isFalse(line.contains([1,3,1,1]));
    });
  });


  describe('containsProjection', function() {
    it('normal case', function() {
      var line = new KraGL.math.Line({
        p1: [1,1,1],
        p2: [5,1,1]
      });

      assert.isTrue(line.containsProjection(0));
      assert.isTrue(line.containsProjection(1));
      assert.isTrue(line.containsProjection(0.5));
      assert.isTrue(line.containsProjection(-1));
      assert.isTrue(line.containsProjection(2));
    });
  });


  describe('dist', function() {
    it('normal case', function() {
      var line = new KraGL.math.Line({
        p1: [1,1,1],
        p2: [5,1,1]
      });

      assert.approximately(line.dist([1,3,1,1]), 2, 0.0001);
      assert.approximately(line.dist([5,1,10,1]), 9, 0.0001);
      assert.approximately(line.dist([1,1,1,1]), 0, 0.0001);
      assert.approximately(line.dist([5,1,1,1]), 0, 0.0001);
      assert.approximately(line.dist([100,1,1,1]), 0, 0.0001);
      assert.approximately(line.dist([42,3,1,1]), 2, 0.0001);
    });
  });

  describe.skip('getPlane', function() {
    it('normal case', function() {
      var line = new KraGL.math.Line({
        p1: [0,0,0],
        p2: [1,0,0]
      });
      var plane = line.getPlane();
      assert.isTrue(plane.contains(line));

      var line = new KraGL.math.Line({
        p1: [0,4,0],
        p2: [0,0,0]
      });
      var plane = line.getPlane();
      assert.isTrue(plane.contains(line));

      var line = new KraGL.math.Line({
        p1: [1,1,0],
        p2: [3,-1,5]
      });
      var plane = line.getPlane();
      assert.isTrue(plane.contains(line));
    });
  });

  describe('intersection', function() {
    describe('Line', function() {
      it('point', function() {
        var line1 = new KraGL.math.Line({
          p1: [0,0,0],
          p2: [1,0,0]
        });
        var line2 = new KraGL.math.Line({
          p1: [1,1,0],
          p2: [3,-1,0]
        });

        var intr = line1.intersection(line2);
        assert.vecApproximately(intr, [2,0,0,1], 0.0001);

        line2 = new KraGL.math.Line({
          p1: [0,0,0],
          p2: [1,1,1]
        });
        intr = line1.intersection(line2);
        assert.vecApproximately(intr, [0,0,0,1], 0.0001);
      });
      it('line', function() {
        var line1 = new KraGL.math.Line({
          p1: [0,0,0],
          p2: [1,0,0]
        });
        var line2 = new KraGL.math.Line({
          p1: [5,0,0],
          p2: [42,0,0]
        });

        var intr = line1.intersection(line2);
        assert.isTrue(intr.approx(line1) && intr.approx(line2));

        var line3 = new KraGL.math.Line({
          p1: [42,0,0],
          p2: [-1, 0, 0]
        });
        intr = line1.intersection(line3);
        assert.isTrue(intr.approx(line1) && intr.approx(line3));
      });
      it('no intersection', function() {
        var line1 = new KraGL.math.Line({
          p1: [0,0,0],
          p2: [1,0,0]
        });
        var line2 = new KraGL.math.Line({
          p1: [0,1,0],
          p2: [1,1,0]
        });
        assert.isUndefined(line1.intersection(line2));

        var line3 = new KraGL.math.Line({
          p1: [1,1,1],
          p2: [2,3,4]
        });
        assert.isUndefined(line1.intersection(line3));
      });
    });

    describe.skip('PlanarShape', function() {
      it('point', function() {
        var line = new KraGL.math.Line({
          p1: [0,2,0],
          p2: [4,-2,0]
        });
        var plane = new KraGL.math.Plane({
          p: [0,0,0],
          n: [0,1,0]
        });
        var intr = line.intersection(plane);
        assert.vecApproximately(intr, [2,0,0,1], 0.0001);
      });
      it('AbstractLine', function() {
        var line = new KraGL.math.Line({
          p1: [0,0,0],
          p2: [1,0,1]
        });
        var plane = new KraGL.math.Plane({
          p: [0,0,0],
          n: [0,1,0]
        });
        var intr = line.intersection(plane);
        assert.isTrue(intr.approx(line));
      });
      it('no intersection', function() {
        var line = new KraGL.math.Line({
          p1: [0,1,0],
          p2: [1,1,1]
        });
        var plane = new KraGL.math.Plane({
          p: [0,0,0],
          n: [0,1,0]
        });
        var intr = line.intersection(plane);
        assert.isUndefined(intr);
      });
    });

    describe('Ray', function() {
      it('point', function() {
        var line = new KraGL.math.Line({
          p1: [0,0,0],
          p2: [1,0,0]
        });
        var ray = new KraGL.math.Ray({
          p1: [2,2,0],
          p2: [2,1,0]
        });

        var intr = line.intersection(ray);
        assert.vecApproximately(intr, [2,0,0,1], 0.0001);
      });
      it('ray', function() {
        var line = new KraGL.math.Line({
          p1: [1,1,1],
          p2: [3,1,1]
        });
        var ray = new KraGL.math.Ray({
          p1: [-5,1,1],
          p2: [10,1,1]
        });

        var intr = line.intersection(ray);
        assert.isTrue(intr.approx(ray));
      });
      it('no intersection', function() {
        var line = new KraGL.math.Line({
          p1: [1,1,1],
          p2: [3,1,1]
        });
        var ray = new KraGL.math.Ray({
          p1: [0,0,0],
          p2: [0,1,2]
        });
        assert.isUndefined(line.intersection(ray));

        ray = new KraGL.math.Ray({
          p1: [1,2,0],
          p2: [1,4,0]
        });
        assert.isUndefined(line.intersection(ray));
      });
    });

    describe('Segment', function() {
      it('point', function() {
        var line = new KraGL.math.Line({
          p1: [1,1,1],
          p2: [3,1,1]
        });
        var seg = new KraGL.math.Segment({
          p1: [6,2,2],
          p2: [6,0,0]
        });

        var intr = line.intersection(seg);
        assert.vecApproximately(intr, [6,1,1,1], 0.0001);
      });
      it('segment', function() {
        var line = new KraGL.math.Line({
          p1: [1,1,1],
          p2: [3,1,1]
        });
        var seg = new KraGL.math.Segment({
          p1: [10,1,1],
          p2: [7,1,1]
        });

        var intr = line.intersection(seg);
        assert.isTrue(intr.approx(seg));
      });
      it('no intersection', function() {
        var line = new KraGL.math.Line({
          p1: [1,1,1],
          p2: [3,1,1]
        });
        var seg = new KraGL.math.Segment({
          p1: [1,2,1],
          p2: [2,2,2]
        });

        assert.isUndefined(line.intersection(seg));
      });
    });
  });

  describe('intersects', function() {
    it('intersection', function() {
      var line1 = new KraGL.math.Line({
        p1: [0,0,0],
        p2: [1,0,0]
      });
      var line2 = new KraGL.math.Line({
        p1: [1,1,0],
        p2: [3,-1,0]
      });
      assert.isTrue(line1.intersects(line2));
    });
    it('no intersection', function() {
      var line1 = new KraGL.math.Line({
        p1: [0,0,0],
        p2: [1,0,0]
      });
      var line2 = new KraGL.math.Line({
        p1: [0,1,0],
        p2: [1,1,0]
      });
      assert.isFalse(line1.intersects(line2));
    });
  });


  describe('isCollinear', function() {
    it('Line', function() {
      var line1 = new KraGL.math.Line({
        p1: [0,0,0],
        p2: [1,0,0]
      });
      var line2 = new KraGL.math.Line({
        p1: [1,1,0],
        p2: [3,-1,0]
      });
      assert.isFalse(line1.isCollinear(line2));

      line2 = new KraGL.math.Line({
        p1: [5,0,0],
        p2: [-1,0,0]
      });
      assert.isTrue(line1.isCollinear(line2));

      line2 = new KraGL.math.Line({
        p1: [0,0,0],
        p2: [5,0,0]
      });
      assert.isTrue(line1.isCollinear(line2));

      line2 = new KraGL.math.Line({
        p1: [0,0,0],
        p2: [5,5,0]
      });
      assert.isFalse(line1.isCollinear(line2));
    });
    it('Ray', function() {
      var line = new KraGL.math.Line({
        p1: [0,0,0],
        p2: [1,0,0]
      });
      var ray = new KraGL.math.Ray({
        p1: [1,1,1],
        p2: [2,3,4]
      });
      assert.isFalse(line.isCollinear(ray));

      ray = new KraGL.math.Ray({
        p1: [0,0,0],
        p2: [0,5,0]
      });
      assert.isFalse(line.isCollinear(ray));

      ray = new KraGL.math.Ray({
        p1: [0,0,0],
        p2: [5,0,0]
      });
      assert.isTrue(line.isCollinear(ray));

      ray = new KraGL.math.Ray({
        p1: [5,0,0],
        p2: [42,0,0]
      });
      assert.isTrue(line.isCollinear(ray));
    });
    it('Segment', function() {
      var line = new KraGL.math.Line({
        p1: [0,0,0],
        p2: [1,0,0]
      });
      var seg = new KraGL.math.Segment({
        p1: [1,1,1],
        p2: [2,3,4]
      });
      assert.isFalse(line.isCollinear(seg));

      seg = new KraGL.math.Segment({
        p1: [0,0,0],
        p2: [0,5,0]
      });
      assert.isFalse(line.isCollinear(seg));

      seg = new KraGL.math.Segment({
        p1: [0,0,0],
        p2: [5,0,0]
      });
      assert.isTrue(line.isCollinear(seg));

      seg = new KraGL.math.Segment({
        p1: [5,0,0],
        p2: [42,0,0]
      });
      assert.isTrue(line.isCollinear(seg));
    });
  });

  describe('isParallel', function() {
    it('AbstractLine', function() {
      var line = new KraGL.math.Line({
        p1: [1,1,1],
        p2: [4,1,1]
      });
      var seg = new KraGL.math.Segment({
        p1: [0,2,0],
        p2: [5,2,0]
      });
      assert.isTrue(line.isParallel(seg));

      seg = new KraGL.math.Segment({
        p1: [1,1,1],
        p2: [2,3,4]
      });
      assert.isFalse(line.isParallel(seg));
    });
    it.skip('PlanarShape', function() {
      var line = new KraGL.math.Line({
        p1: [0,1,0],
        p2: [1,1,1]
      });
      var plane = new KraGL.math.Plane({
        p: [0,0,0],
        n: [0,1,0]
      });
      assert.isTrue(line.isParallel(plane));

      line = new KraGL.math.Line({
        p1: [0,0,0],
        p2: [1,1,1]
      });
      assert.isFalse(line.isParallel(plane));
    });
  });

  describe('projection', function() {
    it('normal case', function() {
      var line = new KraGL.math.Line({
        p1: [1,1,1],
        p2: [2,3,4]
      });

      assert.vecApproximately(line.projection(0.5), [1.5, 2, 2.5, 1], 0.0001);
      assert.vecApproximately(line.projection(1), [2, 3, 4, 1], 0.0001);
      assert.vecApproximately(line.projection(0), [1, 1, 1, 1], 0.0001);
      assert.vecApproximately(line.projection(2), [3, 5, 7, 1], 0.0001);
      assert.vecApproximately(line.projection(-1), [0, -1, -2, 1], 0.0001);
    });
  });

  describe('toLine', function() {
    it('normal case', function() {
      var line = new KraGL.math.Line({
        p1: [1,1,1],
        p2: [4,1,1]
      });

      var other = line.toLine();
      assert.isTrue(line.approx(other));
    });
  });

  describe('toRay', function() {
    it('normal case', function() {
      var line = new KraGL.math.Line({
        p1: [1,1,1],
        p2: [4,1,1]
      });
      var ray = new KraGL.math.Ray({
        p1: [1,1,1],
        p2: [4,1,1]
      });

      assert.isTrue(ray.approx(line.toRay()));
    });
  });

  describe('toSegment', function() {
    it('normal case', function() {
      var line = new KraGL.math.Line({
        p1: [1,1,1],
        p2: [4,1,1]
      });
      var seg = new KraGL.math.Segment({
        p1: [1,1,1],
        p2: [4,1,1]
      });

      assert.isTrue(seg.approx(line.toSegment()));
    });
  });
});
