'use strict';

import { GeometryError } from './GeometryError';

/**
 * A library for registering meshes used by an application.
 */
export class MeshLib {

  /**
   * A list of the names of meshes in this library, sorted alphanumerically.
   * @type {string[]}
   */
  get names() {
    let names = _.keys(this._meshes);
    names.sort();
    return names;
  }

  /**
   * The count of meshes registered in this library.
   * @type {uint}
   */
  get size() {
    return _.size(this._meshes);
  }

  /**
   * @param {WebGLRenderingContext} gl
   */
  constructor(gl) {
    this._gl = gl;
    this._meshes = {};
  }

  /**
   * Adds a mesh to this library.
   * @param {string} name
   * @param {KraGL.geo.Mesh} mesh
   */
  add(name, mesh) {
    if(this._meshes[name])
      throw new GeometryError(`A mesh named ${name} already exists.`);
    this._meshes[name] = mesh;
  }

  /**
   * Clears out the collection and unloads all the resources for its Meshes.
   */
  clean() {
    _.each(this._meshes, mesh => {
      mesh.clean(this._gl);
    });
    this._meshes = {};
  }

  /**
   * Gets the mesh with the specified name.
   * @param {string} name
   * @return {KraGL.geo.Mesh}
   */
  get(name) {
    let mesh = this._meshes[name];
    if(mesh)
      return mesh;
    else
      throw new GeometryError(`The mesh ${name} doesn't exist.`);
  }

  /**
   * Checks if this library contains a particular mesh.
   * @param {string} name
   * @return {boolean}
   */
  has(name) {
    return !!this._meshes[name];
  }

  /**
   * Removes a Mesh from the library and unloads its resources.
   * @param {string} name
   */
  remove(name) {
    if(!this._meshes[name])
      throw new GeometryError(`The mesh ${name} doesn't exist.`);
    let mesh = this._meshes[name];
    mesh.clean(this._gl);

    delete this._meshes[name];
  }

}
