const axios = require('axios').default;
const chalk = require('chalk');
const fs = require('fs');
const newLine = console.log;
const print = console.log;
const syncEnv = require('../utils/syncEnv');

module.exports = () => {
	// If the configuration file does not exist, throw error
    if (! fs.existsSync('.envault.json')) {
		return print(chalk.bgRed.bold('Please set Envault up before trying to sync with it.'));
	}

	// Parse configuration from the file
	const config = JSON.parse(fs.readFileSync('.envault.json'));

	// Make a sync call to the Envault Server API
	axios.defaults.headers.common['Authorization'] = `Bearer ${config.authToken}`;
	axios.post(`https://${config.domain}/api/v1/apps/${config.appId}/update`)
		.then((response) => {
			syncEnv(response.data.variables, require('dotenv').config().parsed);

			newLine();
			print(chalk.green.bold('All done! 🎉'));
		})
		.catch((error) => {
			newLine();
			print(chalk.bgRed.bold('Uh oh! There is an error with your Envault configuration, please set it up again!'));
			print(chalk.red(error));
		});
};