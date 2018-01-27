'use strict';

import { ShaderError } from './ShaderError';

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
  get curProgramName() {
    return this._curName;
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
   * Sets a ShaderProgram in this collection to be used by the WebGL context.
   * @param {string} name
   * @return {KraGL.shaders.ShaderProgram}
   */
  bind(name) {
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
   * Pops the ShaderProgram ontop of the stack and binds it.
   */
  pop() {
    let name = this._programStack.pop();
    this.bind(name);
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
