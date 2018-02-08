'use strict';

import { ShaderError } from './ShaderError';
import { ShaderProgram } from './ShaderProgram';

/**
 * Provides a managed collection of ShaderPrograms identified by name.
 * @memberof KraGL.shaders
 */
export class ShaderLib {

  /**
   * The currently bound ShaderProgram.
   * @type {KraGL.shaders.ShaderProgram}
   */
  get curProgram() {
    return this._curProgram;
  }

  /**
   * The name of the currently bound ShaderProgram.
   * @type {string}
   */
  get curName() {
    return this._curName;
  }

  /**
   * A list of the names of programs in this library, sorted alphanumerically.
   * @type {string[]}
   */
  get names() {
    let names = _.keys(this._programs);
    names.sort();
    return names;
  }

  /**
   * Gets the count of ShaderPrograms in this library.
   * @type {uint}
   */
  get size() {
    return _.size(this._programs);
  }

  /**
   * @param {WebGL} gl
   */
  constructor(gl) {
    this._gl = gl;
    this._programs = {};
    this._curProgram = undefined;
    this._curName = undefined;
    this._programStack = [];
  }

  /**
   * Adds a ShaderProgram to this collection.
   * @param {string} name
   * @param {KraGL.shaders.ShaderProgram} program
   */
  add(name, program) {
    if(this._programs[name])
      throw new ShaderError(`A program named ${name} already exists.`);
    this._programs[name] = program;
  }

  /**
   * Clears out the collection and unloads all the resources for its
   * ShaderPrograms.
   */
  clean() {
    _.each(this._programs, program => {
      program.clean();
      this._programs = {};
      this._curProgram = undefined;
      this._curName = undefined;
      this._programStack = [];
    });
  }

  /**
   * Creates and names a set of ShaderPrograms for this library.
   * @param {WebGL} gl
   * @param {map<string, CreateProgramOpts>} optsMap
   * @return {Promise<ShaderLib>} Returns this for chaining.
   */
  createPrograms(optsMap) {
    let names = _.keys(optsMap);
    return Promise.all(_.map(names, name => {
      let opts = optsMap[name];
      return ShaderProgram.createProgram(this._gl, opts)
      .then(program => {
        this.add(name, program);
      });
    }));
  }

  /**
   * Sets a ShaderProgram in this collection to be used by the WebGL context.
   * Only one ShaderProgram is ever enabled at a time.
   * @param {string} name
   * @return {KraGL.shaders.ShaderProgram}
   */
  enable(name) {
    let program = this._programs[name];
    if(!program)
      throw new ShaderError(`The program ${name} doesn't exist.`);

    if(this._curProgram)
      this._curProgram.disable();
    this._curProgram = program;
    this._curName = name;
    program.enable();

    return program;
  }

  /**
   * Gets the program with the specified name.
   * @param {string} name
   * @return {KraGL.shaders.ShaderProgram}
   */
  get(name) {
    return this._programs[name];
  }

  /**
   * Checks if this library contains a particular program.
   * @param {string} name
   * @return {boolean}
   */
  has(name) {
    return !!this._programs[name];
  }

  /**
   * Pops the ShaderProgram ontop of the stack and binds it.
   */
  pop() {
    let name = this._programStack.pop();
    this.enable(name);
  }

  /**
   * Pushes the current ShaderProgram to the stack.
   */
  push() {
    this._programStack.push(this._curName);
  }

  /**
   * Removes a ShaderProgram from the collection and unloads its resources.
   * @param {string} name
   */
  remove(name) {
    if(!this._programs[name])
      throw new ShaderError(`The program ${name} doesn't exist.`);
    let program = this._programs[name];
    program.clean();

    delete this._programs[name];
  }
}
