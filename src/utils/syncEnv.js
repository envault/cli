const chalk = require('chalk');
const fs = require('fs');
const newLine = console.log;
const print = console.log;

module.exports = (variables, environment) => {
	let updates = [];

	// Update .env file with new credentials
	variables.forEach((variable) => {
		if (variable.key in environment) {
			// This variable is present in the .env file
			if (environment[variable.key] != variable.latest_version.value) {
				// This variable needs updating
				let value = variable.latest_version.value;

				// Wrap value in "" if it meets criteria
				if ((value.includes(' ') || (value.startsWith('${') && value.endsWith('}'))) && ! (value.startsWith('"') && value.endsWith('"'))) {
					value = `"${value}"`;
				};

				// Write updated value to .env
				let contents = fs.readFileSync('.env').toString();

				let expression = new RegExp('^' + variable.key + '=.*', 'gm');

				if (contents.match(expression)) {
					contents = contents.replace(expression, `${variable.key}=${value}`);
					updates.push(variable);
				};

				fs.writeFileSync('.env', contents);
			};
		};
	});

	// Report updates
	newLine();

	if (updates.length) {
		print(chalk.green.bold(`We updated ${updates.length} ${updates.length > 1 ? 'variables' : 'variable'}:`));
	} else {
		print(chalk.green.bold('Your .env is up to date!'));
	}

	updates.forEach((variable) => {
		print(chalk.green(`- ${variable.key} to v${variable.latest_version.id}`));
	});
};