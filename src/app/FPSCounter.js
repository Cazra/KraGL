'use strict';

/**
 * Keeps track of an application's frame rate.
 */
export class FPSCounter {
  /**
   * The current frame rate (Hz).
   * @type {number}
   */
  get fps() {
    return this._fps;
  }

  constructor() {
    this._fps = 0.0;
    this._frameCount = 0;
    this._lastTime = Date.now();
  }

  /**
   * Increasements the FPS counter by 1 frame. If a second or more has passed,
   * then it will also update the frame rate reading.
   */
  tick() {
    this._frameCount++;
    let now = Date.now();
    if(now - this._lastTime >= 1000) {
      this._fps = this._frameCount / (now - this._lastTime) * 1000;
      this._frameCount = 0;
      this._lastTime = now;
    }
  }
}
