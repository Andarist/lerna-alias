# lerna-alias

Simple package for getting alias object for packages managed by lerna, so other tools (such as [webpack](https://webpack.js.org/), [rollup](https://rollupjs.org/), [jest](http://facebook.github.io/jest/) and possibly more) can consume your packages directly from the source files, instead of the built and prepared distribution files.

It just eases development and setting up scripts depending on other lerna packages.

## API

```js
lernaAliases(directory: string = process.cwd()): Aliases
```

## Types

**Aliases**
```js
type Aliases = {
  // value is a local directory path to the package
  // it assumes entry point of the package is src/index.js
  [packageName: string]: string
}
```

## Usage

## with webpack

```js
const lernaAliases = require('lerna-alias')

module.exports = {
  // ...
  resolve: {
    // ...
    alias: lernaAliases(),
  },
}
```

## with Rollup

```js
const alias = require('rollup-plugin-alias')
const lernaAliases = require('lerna-alias')

module.exports = {
  // ...
  plugins: [
    // ...
    alias(lernaAliases()),
  ],
}
```

## with Jest

```js
const lernaAliases = require('lerna-alias')

module.exports = {
  // ...
  moduleNameMapper: lernaAliases(),
}
```

