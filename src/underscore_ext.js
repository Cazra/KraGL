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
    }
  });
});
