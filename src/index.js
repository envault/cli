#!/usr/bin/env node

const chalk = require('chalk');
const newLine = console.log;
const print = console.log;
const setUp = require('./commands/setUp');
const sync = require('./commands/sync');

newLine();

// Welcome
print(chalk.magenta.bold.underline('Welcome to Envault!'));
print('No more .env update nightmares from now on, we promise 🤗');

newLine();
print('Preparing a few things...');

// Setup details have been supplied, so trigger a setup
if (process.argv.length >= 5) return setUp();

sync();