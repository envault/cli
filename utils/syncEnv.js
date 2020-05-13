const chalk = require('chalk');
const fs = require('fs');
const newLine = console.log;
const print = console.log;

module.exports = (variables, environment) => {
	let updates = [];

	variables.forEach((variable) => {
		if (variable.key in environment) {
			if (environment[variable.key] != variable.latest_version.value) {
				let value = variable.latest_version.value;

				if ((value.includes(' ') || (value.startsWith('${') && value.endsWith('}'))) && !(value.startsWith('"') && value.endsWith('"'))) {
					value = `"${value}"`;
				};

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