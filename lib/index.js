const fs = require('fs')
const path = require('path')
const glob = require('glob')

const LERNA_JSON = 'lerna.json'
const DEFAULT_PACKAGES_GLOB = 'packages/*'

const mergeAll = objs => Object.assign({}, ...objs)

const findRoot = directory => {
	const configPath = path.join(directory, LERNA_JSON)

	if (fs.existsSync(configPath)) {
		return directory
	}

	return findRoot(path.join(directory, '..'))
}

// https://github.com/lerna/lerna/blob/4f95be87ff9179a8f370982b963cf3d0be925332/src/PackageUtilities.js#L46
const getPackages = (packageConfigs, rootPath) => {
	const packages = []
	const globOpts = {
		cwd: rootPath,
		strict: true,
		absolute: true,
	}

	const hasNodeModules = packageConfigs.some(cfg => cfg.indexOf('node_modules') > -1)
	const hasGlobStar = packageConfigs.some(cfg => cfg.indexOf('**') > -1)

	if (hasGlobStar) {
		if (hasNodeModules) {
			const message = 'An explicit node_modules package path does not allow globstars (**)'
			throw new Error(message)
		}

		globOpts.ignore = [
			// allow globs like "packages/**",
			// but avoid picking up node_modules/**/package.json
			'**/node_modules/**',
		]
	}

	packageConfigs.forEach(globPath => {
		glob.sync(path.join(globPath, 'package.json'), globOpts).forEach(globResult => {
			// https://github.com/isaacs/node-glob/blob/master/common.js#L104
			// glob always returns "\\" as "/" in windows, so everyone
			// gets normalized because we can't have nice things.
			const packageConfigPath = path.normalize(globResult)
			const packageDir = path.dirname(packageConfigPath)
			const packageJson = JSON.parse(fs.readFileSync(packageConfigPath))
			packages.push({ packageJson, packageDir })
		})
	})

	return packages
}

const getLernaPackages = (directory = process.cwd()) => {
	const rootDirectory = findRoot(directory)
	const lernaConfig = JSON.parse(fs.readFileSync(path.join(rootDirectory, LERNA_JSON)))
	const packages = lernaConfig.packages || DEFAULT_PACKAGES_GLOB
	return getPackages(packages, rootDirectory)
}

module.exports = module.exports.default = directory =>
	mergeAll(
		getLernaPackages(directory).map(({ packageJson, packageDir }) => ({
			[packageJson.name]: path.join(packageDir, 'src/index.js'),
		}))
	)
