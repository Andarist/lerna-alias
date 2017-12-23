# lerna-alias

Simple package for getting alias object for packages managed by lerna, so other tools (such as [webpack](https://webpack.js.org/), [rollup](https://rollupjs.org/), [jest](http://facebook.github.io/jest/) and possibly more) can consume your packages directly from the source files, instead of the built and prepared distribution files.

It just eases development and setting up scripts depending on other lerna packages.

## API

```js
lernaAliases({
  // from which directory lerna monorepo should be searched for
  directory: string = process.cwd(),
  // optional array of `mainFields` that should be used to resolv package's entry point
  // similar to the https://webpack.js.org/configuration/resolve/#resolve-mainfields
  // using this takes precedence over default `sourceDirectory` option
  mainFields?: string[],
  // which directory should be considered as containing source files of a package
  sourceDirectory: string = 'src'
}): Aliases
```

## Types

**Aliases**
```js
type Aliases = {
  // value is a local directory path to the package
  // resolved using `sourceDirectory` and `mainFields` options
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

## using `mainFields` option

```js
const lernaAliases = require('lerna-alias')

module.exports = {
  // ...
  moduleNameMapper: lernaAliases({ mainFields: ['main'] }),
}
```


