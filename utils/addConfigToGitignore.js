const chalk = require('chalk');
const fs = require('fs');
const print = console.log;

module.exports = () => {
    if (fs.existsSync('.gitignore')) {
        const contents = fs.readFileSync('.gitignore').toString();

        if (!contents.includes('.envault.json')) {
            fs.appendFileSync('.gitignore', '\n.envault.json');

            newLine();
            print(chalk.green.bold('.gitignore updated.'));
        }
    };
}