'use strict';

describe('KraGL.math.Matrices', () => {
  const assert = chai.assert;
  const Matrices = KraGL.math.Matrices;

  describe('adjoint', () => {
    it('normal', () => {
      // Example taken from http://www.mathwords.com/a/adjoint.htm
    let a = [[1,0,1], [2,4,0], [3,5,6]];

    let actual = Matrices.adjoint(a);
    let expected = [[24, 5, -4], [-12,3,2], [-2,-5,4]];
    assert.isTrue(Matrices.equal(actual, expected));
    });
  });

  describe('clone', () => {
    it('normal', () => {
      let a = [[1,2,3], [4,5,6], [7,8,9]];
      let clone = Matrices.clone(a);

      assert.isTrue(Matrices.equal(a, clone));
      assert.isTrue(a !== clone);
    });
  });

  describe('cofactor', () => {
    it('normal', () => {
      // Example taken from http://www.mathwords.com/c/cofactor_matrix.htm.
    let a = [[1,0,1], [2,4,0], [3,5,6]];
    let actual, expected;

    actual = Matrices.cofactor(a,0,0);
    expected = 24;
    assert.isTrue(actual === expected, 'Got ' + actual + '\nExpected ' + expected);

    actual = Matrices.cofactor(a,1,0);
    expected = 5;
    assert.isTrue(actual === expected, 'Got ' + actual + '\nExpected ' + expected);

    actual = Matrices.cofactor(a,2,0);
    expected = -4;
    assert.isTrue(actual === expected, 'Got ' + actual + '\nExpected ' + expected);

    actual = Matrices.cofactor(a,0,1);
    expected = -12;
    assert.isTrue(actual === expected, 'Got ' + actual + '\nExpected ' + expected);

    actual = Matrices.cofactor(a,1,1);
    expected = 3;
    assert.isTrue(actual === expected, 'Got ' + actual + '\nExpected ' + expected);

    actual = Matrices.cofactor(a,2,1);
    expected = 2;
    assert.isTrue(actual === expected, 'Got ' + actual + '\nExpected ' + expected);

    actual = Matrices.cofactor(a,0,2);
    expected = -2;
    assert.isTrue(actual === expected, 'Got ' + actual + '\nExpected ' + expected);

    actual = Matrices.cofactor(a,1,2);
    expected = -5;
    assert.isTrue(actual === expected, 'Got ' + actual + '\nExpected ' + expected);

    actual = Matrices.cofactor(a,2,2);
    expected = 4;
    assert.isTrue(actual === expected, 'Got ' + actual + '\nExpected ' + expected);
    });
  });

  describe('cofactorMatrix', () => {
    it('normal', () => {
      // Example taken from http://www.mathwords.com/c/cofactor_matrix.htm.
      let a = [[1,0,1], [2,4,0], [3,5,6]];
      let actual = Matrices.cofactorMatrix(a);
      let expected = [[24, -12, -2], [5, 3, -5], [-4, 2, 4]];
      assert.isTrue(Matrices.equal(actual, expected));
    });
  });

  describe('determinant', () => {
    it('normal', () => {
      let a, actual, expected;

      a = [[1,2], [3,4]];
      actual = Matrices.determinant(a);
      expected = -2;
      assert.isTrue(actual === expected, 'Got ' + actual + '\nExpected ' + expected);

      a = [[1,5,0,2], [3,1,1,-1], [-2,0,0,0], [1,-1,-2,3]];
      actual = Matrices.determinant(a);
      expected = -6;
      assert.isTrue(actual === expected, 'Got ' + actual + '\nExpected ' + expected);
    });
  });

  describe('equal', () => {
    it('true', () => {
      let a = [[1,2,3], [4,5,6], [7,8,9]];
      let b = [[1,2,3], [4,5,6], [7,8,9]];

      assert.isTrue(Matrices.equal(a, b));
      assert.isTrue(Matrices.equal(b, a));
    });

    it('false - different contents', () => {
      let a = [[1,2,3], [4,5,6], [7,8,9]];
      let c = [[0,0,0], [1,1,1], [2,2,2]];

      assert.isFalse(Matrices.equal(a, c));
      assert.isFalse(Matrices.equal(c, a));
    });

    it('false - different size', () => {
      let a = [[1,0,0], [0,1,0], [0,0,1]];
      let b = [[1,0], [0,1]];

      assert.isFalse(Matrices.equal(a, b));
      assert.isFalse(Matrices.equal(b, a));
    });
  });

  describe('fromGLMatrix', () => {
    it('normal', () => {
      let a = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      let actual = Matrices.fromGLMatrix(a, 3);
      let expected = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ];
      assert.isTrue(Matrices.equal(actual, expected));
    });
  });

  describe('identity', () => {
    it('normal', () => {
      let actual, expected;

      actual = Matrices.identity(3);
      expected = [[1,0,0], [0,1,0], [0,0,1]];
      assert.isTrue(Matrices.equal(actual, expected));

      actual = Matrices.identity(2);
      expected = [[1,0], [0,1]];
      assert.isTrue(Matrices.equal(actual, expected));
    });
  });

  describe('inverse', () => {
    it('normal', () => {
      let a, actual, expected;

      // Example taken from http://www.mathwords.com/i/inverse_of_a_matrix.htm
      a = [[1,0,1], [2,4,0], [3,5,6]];
      actual = Matrices.inverse(a);
      expected = [[12/11, 5/22, -2/11],
                      [-6/11, 3/22, 1/11],
                      [-1/11, -5/22, 2/11]];
      assert.isTrue(Matrices.equal(actual, expected));

      // Should get identity matrix when multiplying a matrix by its inverse.
      actual = Matrices.multiply(a, actual);
      expected = Matrices.identity(3);
      assert.isTrue(Matrices.equal(actual, expected, 0.001));
    });

    it('determinant is 0', () => {
      assert.throws(() => {
        Matrices.inverse([[1,1,1], [1,1,1], [1,1,1]]);
      }, KraGL.math.MathError);
    });
  });

  describe('isSquare', () => {
    it('true', () => {
      assert.isTrue(Matrices.isSquare([[1,1,1], [1,1,1], [1,1,1]]));
    });

    it('false', () => {
      assert.isFalse(Matrices.isSquare([[1,1,1], [1,1,1]]));
    });
  });

  describe('minor', () => {
    it('normal', () => {
      let a = [[1,2,3], [4,5,6], [7,8,9]];
      let actual = Matrices.minor(a, 1, 1);
      let expected = -12;
      assert.isTrue(actual === expected, 'Got ' + actual + '\nExpected ' + expected);
    });
  });

  describe('multiply', () => {
    it('square matrices', () => {
      let a = [[1,2,3], [4,5,6], [7,8,9]];
      let b = [[9,8,7], [6,5,4], [3,2,1]];
      let actual = Matrices.multiply(a,b);
      let expected = [[90, 114, 138], [54,69,84], [18,24,30]];
      assert.isTrue(Matrices.equal(actual, expected));
    });

    it('non-square matrices', () => {
      let a = [
        [1,2,3],
        [2,3,4]
      ];
      let b = [
        [1,2],
        [2,3],
        [3,4]
      ];
      let actual = Matrices.multiply(a, b);
      let expected = [
        [5, 8, 11],
        [8, 13, 18],
        [11, 18, 25]
      ];
      assert.isTrue(Matrices.equal(actual, expected));
    });

    it('incompatible sizes', () => {
      assert.throws(() => {
        let a = [
          [1,2,3],
          [2,3,4]
        ];
        let b = [
          [1, 2, 3, 4]
        ];

        Matrices.multiply(a, b);
      }, KraGL.math.MathError);
    });
  });

  describe('omit', () => {
    it('normal', () => {
      let a = [[1,2,3], [4,5,6], [7,8,9]];
      let actual = Matrices.omit(a, 1, 2);
      var expected = [[1,2], [7,8]];
      assert.isTrue(Matrices.equal(actual, expected));
    });
  });

  describe('size', () => {
    it('normal', () => {
      let a = [
        [1,2,3],
        [2,3,4]
      ];
      let [numRows, numCols] = Matrices.size(a);
      assert.equal(numRows, 3);
      assert.equal(numCols, 2);
    });
  });

  describe('toGLMatrix', () => {
    it('normal', () => {
      let a = [
        [1, 2, 3],
        [4, 5, 6],
        [7, 8, 9]
      ];
      let actual = Matrices.toGLMatrix(a);
      let expected = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      assert.deepEqual(actual, expected);
    });
  });

  describe('transpose', () => {
    it('normal', () => {
      let a = [[1,2,3], [4,5,6], [7,8,9]];
      let expected = [[1,4,7], [2,5,8], [3,6,9]];
      let transpose = Matrices.transpose(a);
      assert.isTrue(Matrices.equal(transpose, expected));
    });
  });
});
