#!/usr/bin/env node

const chalk = require('chalk');
const fs = require('fs');
const newLine = console.log;
const print = console.log;
const setUp = require('./commands/setUp');
const sync = require('./commands/sync');

newLine();

// Welcome
print(chalk.magenta.bold.underline('Welcome to Envault!'));
print('No more .env update nightmares from now on, we promise 🤗');

// If the .env file does not exist, throw error
if (! fs.existsSync('.env')) {
	newLine();
	return print(chalk.bgRed.bold('.env file does not exist.'));
};

newLine();
print('Preparing a few things...');

if (process.argv.length >= 5) {
	// Setup details have been supplied, so trigger a setup
	setUp();
} else {
	// Setup details have not been supplied, so trigger a sync
	sync();
}