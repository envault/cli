const chalk = require('chalk')
const fs = require('fs')
const newLine = console.log
const parseValue = require('./parseValue')
const print = console.log

module.exports = (variables, environment) => {
	let updates = []

	// Update .env file with new credentials
	variables.forEach((variable) => {
		// Ensure that the variable is present in the .env file
		if (! variable.key in environment) return

		// Ensure that the variable needs updating
		if (environment[variable.key] === parseValue(variable.latest_version.value)) return

		let value = variable.latest_version.value

		// Write updated value to .env
		let contents = fs.readFileSync('.env').toString()

		let expression = new RegExp('^' + variable.key + '=.*', 'gm')

		if (contents.match(expression)) {
			contents = contents.replace(expression, `${variable.key}=${value}`)
			updates.push(variable)
		}

		fs.writeFileSync('.env', contents)
	})

	// Report updates
	newLine()

	print(chalk.green.bold(updates.length ? `We updated ${updates.length} ${updates.length > 1 ? 'variables' : 'variable'}:` : 'Your .env is up to date!'))

	updates.forEach((variable) => {
		print(chalk.green(`- ${variable.key} to v${variable.latest_version.id}`))
	})
}
