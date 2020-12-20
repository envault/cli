const chalk = require('chalk');
const fs = require('fs');
const newLine = console.log;
const print = console.log;

module.exports = () => {
    // If .gitignore exists, make sure that the configuration file is listed in it
    if (! fs.existsSync('.gitignore')) return;

    const contents = fs.readFileSync('.gitignore').toString();

    if (contents.includes('.envault.json')) return;

    fs.appendFileSync('.gitignore', '\n.envault.json');

    newLine();
    print(chalk.green.bold('.gitignore updated.'));
}