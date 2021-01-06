const axios = require('axios').default
import cli from "cli-ux";
import {Command, flags} from '@oclif/command'
const fs = require('fs')
import {addConfigToGitignore, getConfig, parseValue, writeConfig} from './utils';

class Envault extends Command {
    static description = 'Sync your .env file with Envault.'

    static flags = {
        // force: flags.boolean({char: 'f'}),
        help: flags.help({char: 'h'}),
        // path: flags.string({
        //     char: 'p',
        //     default: '.env',
        //     description: 'path to .env file'
        // }),
        // update: flags.boolean({
        //     char: 'u',
        //     description: 'update Envault from the local .env'
        // }),
        version: flags.version({char: 'v'}),
    }

    static args = [
        {
            name: 'server',
            hidden: true,
        },
        {
            name: 'environment',
            hidden: true,
        },
        {
            name: 'token',
            hidden: true,
        },
    ]

    async run() {
        const {args, flags} = this.parse(Envault)

        this.log('Welcome to Envault! No more .env update nightmares from now on, we promise 🤗')

        if (args.server && args.environment && args.token) {
            cli.action.start('Contacting your Envault server')

            let response;

            try {
                // Make a setup call to the Envault Server API
                response = await axios.post(`https://${domain}/api/v1/apps/${appId}/setup/${token}`);
            } catch (error) {
                this.error('Uh oh! Looks like your setup token is invalid, please get another!')
                this.error(error)

                return
            }

            cli.action.stop()

            if (! response.data.authToken) return

            writeConfig({
                authToken: response.data.authToken,
                environment: args.environment,
                server: args.server,
            })

            this.log('Configuration file set up.')

            if (addConfigToGitignore()) this.log('.gitignore updated.')

            // If the .env file does not exist, create one and populate
            if (! fs.existsSync('.env')) {
                let template = ''

                response.data.app.variables.forEach((variable: object) => {
                    template += `${variable.key}=\n`
                })

                fs.writeFileSync('.env', template)
            }

            // syncEnv(response.data.app.variables, require('dotenv').config().parsed)

            this.log('All done! 🎉')
        }

        // pull
    }
}

export = Envault
