const Babel = require('broccoli-babel-transpiler');
const moduleResolve = require('amd-name-resolver').moduleResolve;
const enifed = require('./transforms/transform-define');
const injectNodeGlobals = require('./transforms/inject-node-globals');

module.exports = function processModulesOnly(tree, annotation) {
  let options = {
    plugins: [
      // ensures `@glimmer/compiler` requiring `crypto` works properly
      // in both browser and node-land
      injectNodeGlobals,
      ['transform-es2015-modules-amd', { loose: true, noInterop: true }],
      enifed,
    ],
    getModuleId(moduleName) {
      if (moduleName.match(/backburner/)) {
        return 'backburner.js';
      }
    },
    moduleIds: true,
    resolveModuleSource: moduleResolve,
    annotation,
  };

  return new Babel(tree, options);
};
