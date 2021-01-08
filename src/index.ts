import {Command, flags} from '@oclif/command'
const axios = require('axios').default
import cli from 'cli-ux'
const fs = require('fs').promises
const path = require('path')
const process = require('process')
import {addConfigToGitignore, getConfig, parseValue, writeConfig} from './utils'

interface Variable {
    key: string
    latest_version: {
        id: bigint
        value: string
    }
}

class Envault extends Command {
    static description = 'Sync your .env file with Envault.'

    static flags = {
        constructive: flags.boolean({
            char: 'c',
            description: 'enable prompts to create missing variables',
        }),
        filename: flags.string({description: 'name of .env file'}),
        force: flags.boolean({description: 'accept all prompts'}),
        help: flags.help({char: 'h'}),
        // update: flags.boolean({
        //     char: 'u',
        //     description: 'update Envault from the local .env',
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
            let environment = args.environment
            let filename = flags.filename ?? '.env'
            let server = args.server
            let token = args.token

            cli.action.start('Connecting to your Envault server')

            let response

            try {
                response = await axios.post(`https://${server}/api/v1/apps/${environment}/setup/${token}`)
            } catch (error) {
                this.error('Looks like your setup token is invalid, please get another!')

                return
            }

            cli.action.stop()

            if (! response.data.authToken) return

            const variables: Array<Variable> = response.data.app.variables

            let contents = ''

            try {
                contents = (await fs.readFile(filename)).toString()
            } catch (error) {
                if (! flags.force && ! await cli.confirm(`A ${filename} file was not found. Would you like to create a new one? Y/n`)) return this.error(`Initialization aborted as a ${filename} file was not found.`)

                for (const variable of variables) {
                    contents += `${variable.key}=\n`
                }

                await fs.writeFile(filename, contents)
            }

            await writeConfig({
                authToken: response.data.authToken,
                environment: environment,
                filename: filename,
                server: server,
            })

            this.log('Configuration file set up.')

            if (await addConfigToGitignore()) this.log('.gitignore updated.')

            const localVariables = require('dotenv').config({ path: path.resolve(process.cwd(), filename) }).parsed

            let updates: Array<Variable> = []

            for (const variable of variables) {
                if (! (variable.key in localVariables)) {
                    if (! flags.constructive) continue

                    if (! flags.force && ! await cli.confirm(`The ${variable.key} variable is not currently present in your ${filename} file. Would you like to add it? Y/n`)) continue
                }

                if (localVariables[variable.key] === parseValue(variable.latest_version.value)) continue

                let expression = new RegExp('^' + variable.key + '=.*', 'gm')

                contents = contents.replace(expression, `${variable.key}=${variable.latest_version.value}`)

                if (! contents.match(expression)) {
                    contents += `\n${variable.key}=${variable.latest_version.value}\n`
                }

                updates.push(variable)
            }

            await fs.writeFile(filename, contents)

            if (updates.length) {
                this.log(`We updated ${updates.length} ${updates.length > 1 ? 'variables' : 'variable'}:`)

                let updatesTree = cli.tree()

                for (const variable of updates) {
                    updatesTree.insert(`${variable.key} to v${variable.latest_version.id}`)
                }

                updatesTree.display()

                return
            }

            this.log('You are already up to date 🎉')

            return
        }

        const config = await getConfig()

        if (! config) this.error('Please initialize your Envault environment before trying to pull.')

        let authToken = config.authToken
        let environment = config.environment
        let filename = flags.filename ?? config.filename ?? '.env'
        let server = config.server

        cli.action.start('Connecting to your Envault server')

        axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`

        let response

        try {
            response = await axios.post(`https://${server}/api/v1/apps/${environment}/update`)
        } catch (error) {
            this.error('There is an error with your Envault configuration, please set up your app again!')

            return
        }

        cli.action.stop()

        const variables: Array<Variable> = response.data.variables

        let contents = ''

        try {
            contents = (await fs.readFile(filename)).toString()
        } catch (error) {
            if (! flags.force && ! await cli.confirm(`A ${filename} file was not found. Would you like to create a new one? Y/n`)) return this.error(`Pull aborted as a ${filename} file was not found.`)

            for (const variable of variables) {
                contents += `${variable.key}=\n`
            }

            await fs.writeFile(filename, contents)
        }

        const localVariables = require('dotenv').config({ path: path.resolve(process.cwd(), filename) }).parsed

        let updates: Array<Variable> = []

        for (const variable of variables) {
            if (! (variable.key in localVariables)) {
                if (! flags.constructive) continue

                if (! flags.force && ! await cli.confirm(`The ${variable.key} variable is not currently present in your ${filename} file. Would you like to add it? Y/n`)) continue
            }

            if (localVariables[variable.key] === parseValue(variable.latest_version.value)) continue

            let expression = new RegExp('^' + variable.key + '=.*', 'gm')

            contents = contents.replace(expression, `${variable.key}=${variable.latest_version.value}`)

            if (! contents.match(expression)) {
                contents += `\n${variable.key}=${variable.latest_version.value}\n`
            }

            updates.push(variable)
        }

        await fs.writeFile(filename, contents)

        if (updates.length) {
            this.log(`We updated ${updates.length} ${updates.length > 1 ? 'variables' : 'variable'}:`)

            let updatesTree = cli.tree()

            for (const variable of updates) {
                updatesTree.insert(`${variable.key} to v${variable.latest_version.id}`)
            }

            updatesTree.display()

            return
        }

        this.log('You are already up to date 🎉')
    }
}

export = Envault
