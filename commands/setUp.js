const axios = require('axios').default;
const chalk = require('chalk');
const fs = require('fs');
const newLine = console.log;
const print = console.log;
const syncEnv = require('../utils/syncEnv');

module.exports = () => {
    const domain = process.argv[2];
	const appId = process.argv[3];
	const token = process.argv[4];

	axios.post(`https://${domain}/api/v1/apps/${appId}/setup/${token}`)
		.then((response) => {
			if (response.data.authToken) {
				fs.writeFileSync('.envault.json', JSON.stringify({
					appId: appId,
					authToken: response.data.authToken,
					domain: domain,
				}));

				newLine();
				print(chalk.green.bold('Configuration file set up.'));

				addConfigToGitignore();

				syncEnv(response.data.app.variables, require('dotenv').config().parsed);

				newLine();
				print(chalk.bgGreen.bold('All done! 🎉'));
			}
		})
		.catch((error) => {
			newLine();
			print(chalk.bgRed.bold('Uh oh! Looks like your setup token is invalid, please get another!'));
		});
};