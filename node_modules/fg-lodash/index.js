/*
 * lodash
 *
 * Copyright(c) 2014  <>
 * MIT Licensed
 *
 */
'use strict';

// https://github.com/nicholascloud/l33teral ?

// http://lodash.com/docs
var _   = require('lodash');


// https://github.com/epeli/underscore.string
_.mixin(require('underscore.string').exports());

// https://gist.github.com/FGRibreau/4e26e5314496f834d0a6
_.mixin({
  filterObject: function(obj, f, ctx) {
    return Object.keys(obj).reduce(function(m, k) {
      return f.call(ctx, obj[k], k, obj) ? (m[k] = obj[k], m) : m;
    }.bind(obj), {});
  },
  pluckObject: function(obj, prop){
    return _.reduce(obj, function(memo, object, key){
      memo[key] = object[prop];
      return memo;
    }, {});
  }
});

module.exports = _;
