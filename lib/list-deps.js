'use strict';

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;

const entryPointPath = process.argv[2];
const seen = new Set();
const dependencies = new Set();

gatherDependencies(resolveFile(`${process.cwd()}/index`, entryPointPath));

console.log(Array.from(dependencies).join('\n')); // eslint-disable-line

function gatherDependencies(entryPoint) {
  if (seen.has(entryPoint)) {
    return;
  }

  seen.add(entryPoint);

  const source = fs.readFileSync(entryPoint).toString();
  const ast = parser.parse(source, {
    sourceType: 'module',
    sourceFilename: entryPoint,
    plugins: ['typescript', 'classProperties'],
  });

  traverse(ast, {
    ImportDeclaration(path) {
      handleDependency(path.node.source.value);
    },

    ExportNamedDeclaration(path) {
      path.node.source && handleDependency(path.node.source.value);
    },
  });

  function handleDependency(filePath) {
    if (isLocal(filePath)) {
      gatherDependencies(resolveFile(entryPoint, filePath));
    } else {
      dependencies.add(filePath);
    }
  }

  function isLocal(filePath) {
    return filePath.charAt(0) === '.';
  }
}

function resolveFile(from, filePath) {
  const resolvedPath = path.resolve(path.dirname(from), filePath);

  for (let suffix of ['', '.js', '.ts']) {
    const fullPath = `${resolvedPath}${suffix}`;
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }

  throw new Error(`Could not resolve file at path ${resolvedPath}`);
}
