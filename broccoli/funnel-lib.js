'use strict';

const Funnel = require('broccoli-funnel');
const findLib = require('./find-lib');
const Debug = require('broccoli-debug');

module.exports = function funnelLib(name) {
  let libPath, options;
  if (arguments.length > 2) {
    libPath = arguments[1];
    options = arguments[2];
  } else {
    options = arguments[1];
  }

  return new Debug(new Funnel(findLib(name, libPath), options), `funnel-lib:${name}`);
};
