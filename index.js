#!/usr/bin/env node

const chalk = require('chalk');
const fs = require('fs');
const newLine = console.log;
const print = console.log;
const setUp = require('./commands/setUp');
const sync = require('./commands/sync');

newLine();
print(chalk.magenta.bold.underline('Welcome to Envault!'));
print('No more .env update nightmares from now on, we promise 🤗');

if (!fs.existsSync('.env')) {
	newLine();
	return print(chalk.bgRed.bold('.env file does not exist.'));
}

newLine();
print('Preparing a few things...');

if (process.argv.length >= 5) {
	setUp();
} else {
	sync();
}