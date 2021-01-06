const fs = require('fs')

export function addConfigToGitignore() {
    // If .gitignore exists, make sure that the configuration file is listed in it
    if (! fs.existsSync('.gitignore')) return false

    const contents = fs.readFileSync('.gitignore').toString()

    if (contents.includes('.envault.json')) return false

    fs.appendFileSync('.gitignore', '\n.envault.json')

    return true
}

export function getConfig() {
    if (! fs.existsSync('.envault.json')) return false

    let config = JSON.parse(fs.readFileSync('.envault.json'))

    let fixed = false;

    if ('appId' in config) {
        config.environment = config.appId
        delete config.appId

        fixed = true
    }

    if ('domain' in config) {
        config.server = config.domain
        delete config.domain

        fixed = true
    }

    if (fixed) {
        writeConfig(config)
    }

    return config
}

export function parseValue(value = '') {
    const end = value.length - 1

    const isDoubleQuoted = value[0] === '"' && value[end] === '"'
    const isSingleQuoted = value[0] === "'" && value[end] === "'"

    // If no single or double quotes detected, trim whitespace
    if (! isSingleQuoted && ! isDoubleQuoted) return value.trim()

    // Remove quotes
    value = value.substring(1, end)

    // If double quoted, expand new lines
    if (isDoubleQuoted) {
        value = value.replace(/\\n/g, '\n')
    }

    return value
}

export function syncEnv(variables, environment) {
    let updates = []

    // Update .env file with new credentials
    variables.forEach((variable) => {
        // Ensure that the variable is present in the .env file
        if (! variable.key in environment) return

        // Ensure that the variable needs updating
        if (environment[variable.key] === parseValue(variable.latest_version.value)) return

        let value = variable.latest_version.value

        // Write updated value to .env
        let contents = fs.readFileSync('.env').toString()

        let expression = new RegExp('^' + variable.key + '=.*', 'gm')

        if (contents.match(expression)) {
            contents = contents.replace(expression, `${variable.key}=${value}`)
            updates.push(variable)
        }

        fs.writeFileSync('.env', contents)
    })

    // Report updates
    print(chalk.green.bold(updates.length ? `We updated ${updates.length} ${updates.length > 1 ? 'variables' : 'variable'}:` : 'Your .env is up to date!'))

    updates.forEach((variable) => {
        print(chalk.green(`- ${variable.key} to v${variable.latest_version.id}`))
    })
}

export function writeConfig(contents: object) {
    fs.writeFileSync('.envault.json', JSON.stringify(contents))

    return contents
}
