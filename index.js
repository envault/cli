const axios = require('axios').default;
const fs = require('fs');

if (!fs.existsSync('.env')) {
	return console.log('.env file does not exist.');
}

const environment = require('dotenv').config().parsed;

const updateEnv = (variables, environment) => {
	let updates = [];

	variables.forEach((variable) => {
		if (variable.key in environment) {
			if (environment[variable.key] != variable.latest_version.value) {
				let value = variable.latest_version.value;

				if ((value.includes(' ') || (value.startsWith('${') && value.endsWith('}'))) && !(value.startsWith('"') && value.endsWith('"'))) {
					value = `"${value}"`;
				};

				let pair = `${variable.key}=${value}`;

				let contents = fs.readFileSync('.env').toString();

				let expression = new RegExp('^' + variable.key + '=.*', 'gm');

				if (contents.match(expression)) {
					contents = contents.replace(expression, pair);

					updates.push(variable);
				};

				fs.writeFileSync('.env', contents);
			};
		};
	});

	if (updates.length) {
		console.log(`Updated ${updates.length} ${updates.length > 1 ? 'variables' : 'variable'}:`);
	} else {
		console.log('Your .env is already in sync!');
	}

	updates.forEach((variable) => {
		console.log(`- Updated ${variable.key} to v${variable.latest_version.id}`);
	});
};

if (process.argv.length >= 5) {
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

				console.log('Created .envault.json configuration file.');

				if (fs.existsSync('.gitignore')) {
					const contents = fs.readFileSync('.gitignore').toString();

					if (!contents.includes('.envault.json')) {
						fs.appendFileSync('.gitignore', '\n.envault.json');

						console.log('.envault.json added to .gitignore');
					}
				};

				updateEnv(response.data.app.variables, environment);
			}
		})
		.catch((error) => {
			console.log('This setup command is invalid. Please generate another.');

			return;
		});
} else {
	if (!fs.existsSync('.envault.json')) {
		return console.log('Config file doesn\'t exist, please set up your app before updating it.');
	}

	const config = JSON.parse(fs.readFileSync('.envault.json'));

	if (!('appId' in config) || !('authToken' in config) || !('domain' in config)) {
		return console.log('Config file is invalid, please set up your app before updating it.');
	}

	axios.defaults.headers.common['Authorization'] = `Bearer ${config.authToken}`;

	axios.post(`https://${config.domain}/api/v1/apps/${config.appId}/update`)
		.then((response) => {
			updateEnv(response.data.variables, environment);
		})
		.catch((error) => {
			console.log('Something went wrong. Please set your app up again.');

			return;
		});
}