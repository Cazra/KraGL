/**
 * This module defines a function for declaring named modules asynchronously,
 * even if they are dependent upon other named modules. Simply name the
 * module, provide the list of names for modules it depends on, and
 * define a callback function that actually declares the module's contents.
 * @param  {string} name
 *         The name of the module.
 * @param  {string[]} dependsOn
 *         The list names of modules that must be loaded before this module is
 *         actually declared.
 * @param  {function} func
 *         The function that defines this module.
 */
var define = (function() {
  'use strict';

  var modules = {};

  function _declare(name) {
    if(!modules[name].isDeclared) {
      modules[name].declare();
      modules[name].isDeclared = true;

      // If any modules require this one, remove this one from their waitingOn
      // set. If their waitingOn list becomes empty, declare them.
      _.each(modules[name].requiredBy, function($, reqName) {
        delete modules[reqName].waitingOn[name];

        if(_.size(modules[reqName].waitingOn) === 0) {
          _declare(reqName);
        }
      });
    }
  }


  function _mention(name) {
    if(!modules[name]) {
      modules[name] = {
        waitingOn: {},
        requiredBy: {}
      };
    }
  }

  /**
   * Defines a named module that may depend on some other named modules.
   * @param  {string} name
   *         The name of the module.
   * @param  {string[]} dependsOn
   *         The list of modules that must be loaded before this module is
   *         defined.
   * @param  {function} func
   *         The function that defines this module.
   */
  return function(name, dependsOn, func) {
    _mention(name);
    modules[name].declare = func;

    // Figure out which modules this one is still waiting on to be declared.
    dependsOn.forEach(function(depName) {
      _mention(depName);
      modules[depName].requiredBy[name] = true;

      if(!modules[depName].isDeclared) {
        modules[name].waitingOn[depName] = true;
      }
    });

    if(_.size(modules[name].waitingOn) === 0) {
      _declare(name);
    }
  };
})();
