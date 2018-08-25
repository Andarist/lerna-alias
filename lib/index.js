'use strict'

const fs = require('fs')
const path = require('path')
const getLernaPackages = require('get-lerna-packages')

const PACKAGE_JSON = 'package.json'

const compose = (...funcs) => funcs.reduce((a, b) => (...args) => a(b(...args)))
const hasOwn = (prop, obj) => obj.hasOwnProperty(prop)
const mergeAll = objs => Object.assign({}, ...objs)
const mapKeys = mapper => obj =>
  Object.keys(obj).reduce((mapped, key) => {
    mapped[mapper(key)] = obj[key]
    return mapped
  }, {})

const readJSONFile = file => JSON.parse(fs.readFileSync(file))

const resolveMainField = (mainFields, packageJson) => {
  const mainField = mainFields.find(field => hasOwn(field, packageJson))
  return mainField ? packageJson[mainField] : ''
}

const createAliases = ({ directory, mainFields, sourceDirectory = 'src' } = {}) =>
  mergeAll(
    getLernaPackages(directory).map(packageDir => {
      const packageJson = readJSONFile(path.join(packageDir, PACKAGE_JSON))
      let entry
      if (Array.isArray(mainFields)) {
        entry = resolveMainField(mainFields, packageJson)
      } else if (sourceDirectory === false) {
        entry = ''
      } else {
        entry = `${sourceDirectory}/index`
      }
      return { [packageJson.name]: path.join(packageDir, entry) }
    })
  )

module.exports.jest = compose(mapKeys(key => `^${key}$`), createAliases)

module.exports.rollup = createAliases

module.exports.webpack = compose(mapKeys(key => `${key}$`), createAliases)
