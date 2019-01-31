'use strict';

import { MathError } from './MathError';
import { Vectors } from './Vectors';

/**
 * The size of a matrix expressed as a 2-element array containing its number
 * of rows and number of columns, in that order.
 * @typedef {uint[]} MatrixSize
 */

/**
 * A matrix whose values are given as a 2D list in column-major order.
 * That is, if a matrix would be written by hand as
 *    1 2 3
 *    4 5 6
 *    7 8 9,
 * it would be written in memory as
 *    [[1 4 7], [2 5 8], [3 6 9]].
 * @typedef {number[][]} Matrix
 */

/**
 * A square matrix. That is, any matrix with an equal number of rows and
 * columns.
 * @typedef {Matrix} SquareMatrix
 */

/**
 * A collection of common matrix math functions not covered by the glmatrix
 * library. Particularly, this class provides functions that allow operations
 * with non-square matrices. Keep in mind that these functions are not nearly
 * as optimized as those in the glMatrix library and are best suited for
 * preprocessing than for use during the animation loop.
 *
 * Most of this class is stolen from the MatrixMath script I wrote for the
 * Roll20 API, which itself has received a lot of testing and production use. :)
 * @memberof KraGL.math
 */
export class Matrices {

  /**
   * Gets the adjugate of a matrix, the tranpose of its cofactor matrix.
   * @param  {SquareMatrix} mat
   * @return {SquareMatrix}
   */
  static adjoint(mat) {
    let cofactorMat = Matrices.cofactorMatrix(mat);
    return Matrices.transpose(cofactorMat);
  }

  /**
    * Produces a deep clone of a matrix.
    * @param  {Matrix} mat
    * @return {Matrix}
    */
  static clone(mat) {
    return _.map(mat, column => {
      return _.clone(column);
    });
  }

  /**
   * Gets the cofactor of a matrix at a specified column and row.
   * @param  {SquareMatrix} mat
   * @param  {uint} col
   * @param  {uint} row
   * @return {number}
   */
  static cofactor(mat, col, row) {
    return Math.pow(-1, col+row)*Matrices.minor(mat, col, row);
  }

  /**
   * Gets the cofactor matrix of a matrix.
   * @param  {Matrix} mat
   * @return {Matrix}
   */
  static cofactorMatrix(mat) {
    let size = Matrices.size(mat)[0];

    return _.map(_.range(size), column => {
      return _.map(_.range(size), row => {
        return Matrices.cofactor(mat, column, row);
      });
    });
  }

  /**
   * Gets the determinant of a matrix.
   * @param  {SquareMatrix} mat
   * @return {number}
   */
  static determinant(mat) {
    let size = Matrices.size(mat)[0];

    if(size === 2)
      return mat[0][0]*mat[1][1] - mat[1][0]*mat[0][1];
    else {
      return _.reduce(_.range(size), (memo, column) => {
        return memo + mat[column][0] * Matrices.cofactor(mat, column, 0);
      }, 0);
    }
  }

  /**
   * Tests if two matrices are equal.
   * @param  {Matrix} a
   * @param  {Matrix} b
   * @param {number} [tolerance=0]
   *        If specified, this specifies the amount of tolerance to use for
   *        each value of the matrices when testing for equality.
   * @return {boolean}
   */
  static equal(a, b, tolerance) {
    let sizeA = Matrices.size(a);
    let sizeB = Matrices.size(b);

    if(sizeA[0] !== sizeB[0] || sizeA[1] !== sizeB[1])
      return false;
    else {
      let result = true;
      _.each(_.range(sizeA[1]), i => {
        if(!result)
          return;

        let columnA = a[i];
        let columnB = b[i];
        result = Vectors.approx(columnA, columnB, tolerance);
      });
      return result;
    }
  }

  /**
   * Converts a GL matrix to 2D-array format.
   * @param {(mat2|mat3|mat4)} mat
   * @param {uint} size
   * @return {SquareMatrix}
   */
  static fromGLMatrix(mat, size) {
    return _.map(_.range(size), column => {
      return _.map(_.range(size), row => {
        return mat[column*size + row];
      });
    });
  }

  /**
   * Produces a square identity matrix.
   * @param {uint} size
   * @return {SquareMatrix}
   */
  static identity(size) {
    return _.map(_.range(size), column => {
      return _.map(_.range(size), row => {
        if(row === column)
          return 1;
        else
          return 0;
      });
    });
  }

  /**
   * Gets the inverse of a matrix.
   * @param {SquareMatrix} mat
   * @return {SquareMatrix}
   */
  static inverse(mat) {
    let determinant = Matrices.determinant(mat);
    if(determinant === 0)
      throw new MathError(`Cannot invert matrix ${mat} with 0 determinant.`);

    let size = Matrices.size(mat)[0];
    let adjoint = Matrices.adjoint(mat);
    return _.map(_.range(size), column => {
      return _.map(_.range(size), row => {
        return adjoint[column][row]/determinant;
      });
    });
  }

  /**
   * Checks if a matrix is square.
   * @param {Matrix} mat
   * @return {boolean}
   */
  static isSquare(mat) {
    let [numRows, numCols] = Matrices.size(mat);
    return numRows === numCols;
  }

  /**
   * Gets the determinant of a matrix omitting some column and row.
   * @param  {SquareMatrix} mat
   * @param  {uint} col
   * @param  {uint} row
   * @return {number}
   */
  static minor(mat, col, row) {
    let reducedMat = Matrices.omit(mat, col, row);
    return Matrices.determinant(reducedMat);
  }

  /**
   * Returns the matrix multiplication of a*b.
   * For matrix multiplication to work, the # of columns in A must be equal
   * to the # of rows in B.
   * The resulting matrix will have the same number of rows as A and the
   * same number of columns as B.
   * @param  {Matrix} a
   * @param  {Matrix} b
   * @return {Matrix}
   */
  static multiply(a, b) {
    let [rowsA, colsA] = Matrices.size(a);
    let [rowsB, colsB] = Matrices.size(b);

    if(colsA !== rowsB)
      throw new MathError(`Cannot multiply matrix ${a} of size ` +
        `${[rowsA, colsA]} with matrix ${b} of size ${[rowsB, colsB]}.`);

    return _.map(_.range(colsB), column => {
      return _.map(_.range(rowsA), row => {
        return _.reduce(_.range(colsA), (memo, i) => {
          return memo + a[i][row] * b[column][i];
        }, 0);
      });
    });
  }

  /**
   * Returns a matrix with a column and row omitted.
   * @param  {Matrix} mat
   * @param  {uint} col
   * @param  {uint} row
   * @return {Matrix}
   */
  static omit(mat, col, row) {
    let result = [];
    let [numRows, numCols] = Matrices.size(mat);

    _.each(_.range(numCols), i => {
      if(i === col)
        return;
      else {
        let column = [];
        result.push(column);
        _.each(_.range(numRows), j => {
          if(j !== row)
            column.push(mat[i][j]);
        });
      }
    });
    return result;
  }

  /**
   * Returns the size of a matrix.
   * @param {Matrix} mat
   * @return {MatrixSize}
   */
  static size(mat) {
    let numRows = mat[0].length;
    let numCols = mat.length;
    return [ numRows, numCols ];
  }

  /**
   * Converts a matrix to a GL-compatible array.
   * @param {SquareMatrix} mat
   * @return {number[]}
   */
  static toGLMatrix(mat) {
    let [numRows, numCols] = Matrices.size(mat);
    if(numRows !== numCols || numRows < 2 || numRows > 4)
      throw new MathError('Matrix must be convertible to either a mat2, ' +
        'mat3, or mat4.');

    let result = [];
    _.each(mat, column => {
      _.each(column, value => {
        result.push(value);
      });
    });
    return result;
  }

  /**
   * Returns the transpose of a matrix.
   * @param {Matrix} mat
   * @return {Matrix}
   */
  static transpose(mat) {
    let [numRows, numCols] = Matrices.size(mat);

    return _.map(_.range(numRows), column => {
      return _.map(_.range(numCols), row => {
        return mat[row][column];
      });
    });
  }
}
