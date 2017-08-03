define('underscore_ext', [], function() {
  'use strict';

  _.extend(_, {

    /**
     * Creates an alias for invoking a function.
     * @param  {string} funcName
     * @return {function}
     */
    alias: function(funcName) {
      return function() {
        var func = this[funcName];
        return func.apply(this, arguments);
      };
    },

    /**
     * Creates aliases for a bunch of methods.
     * @param  {class} clazz
     * @param  {map<string, string>} methods
     *         A mapping of aliases to their original method names.
     */
    aliasMethods: function(clazz, methods) {
      _.each(methods, function(original, alias) {
        clazz.prototype[alias] = _.alias(original);
      });
    },

    /**
     * Creates aliases for a bunch of properties.
     * @param  {class} clazz
     * @param  {map<string, string>} properties
     *         A mapping of aliases to their original property names.
     */
    aliasProperties: function(clazz, properties) {
      _.each(properties, function(original, alias) {
        var proto = clazz.prototype;
        var descriptor = Object.getOwnPropertyDescriptor(proto, original);
        Object.defineProperty(clazz.prototype, alias, descriptor);
      });
    },

    /**
     * Checks if a class implements the specified abstract methods of a
     * parent class.
     * Any that aren't implemented have a warning printed to the console.
     * @param  {class} clazz
     * @param  {class} parentClazz
     * @param  {string[]} methods
     * @return {string[]}
     *         The list of unimplemented abstract methods.
     */
    checkAbstractImpl: function(clazz, parentClazz, methods) {
      return _.filter(methods, function(method) {
        if(clazz.prototype[method] === parentClazz.prototype[method]) {
          console.warn(clazz.name + ' does not implement ' + parentClazz.name +
            '.'  + method + '.');
          return true;
        }
      });
    }
  });
});
