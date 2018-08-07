'use strict';

const path = require('path');
const Filter = require('broccoli-persistent-filter');

const PACKAGE_JSON_FIELDS = {
  main: 'dist/index.js',
  module: 'dist/module.js',
  typings: 'dist/index.d.ts',
  license: 'MIT',
};

module.exports = class PackageJSONWriter extends Filter {
  canProcessFile(relativePath) {
    return path.basename(relativePath) === 'package.json';
  }

  processString(string) {
    let pkg = JSON.parse(string);
    Object.assign(pkg, PACKAGE_JSON_FIELDS);
    return JSON.stringify(pkg, null, 2);
  }
};
