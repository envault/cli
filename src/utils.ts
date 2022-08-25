const fs = require('fs').promises

interface ConfigItem {
    authToken: string
    environment: string
    filename: string
    server: string
}

export async function addConfigToGitignore() {
    let contents

    try {
        contents = (await fs.readFile('.gitignore')).toString()
    } catch (error) {
        return false
    }

    if (contents.includes('.envault.json')) return false

    await fs.appendFile('.gitignore', '\n.envault.json')

    return true
}

export async function getConfig(server = null, environment = null) {
    let configs
    let fixed = false

    try {
        configs = await fs.readFile('.envault.json')
    } catch (error) {
        return false
    }

    configs = JSON.parse(configs)

    if (! Array.isArray(configs)) {
        configs = [configs];
        fixed = true
    }

    let config = configs.find((item : ConfigItem) => {
        return item.server === server && item.environment === environment
    })

    // If no config found
    if (typeof config === 'undefined') {
        // Default to first config if no server and environment provided
        if ((configs.length) && (! server) && (! environment)) {
            config = configs[0]
        } else {
            return
        }
    }

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
        await writeConfig(config)
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

export async function writeConfig(contents: ConfigItem) {
    let configs

    try {
        configs = await fs.readFile('.envault.json')
    } catch (error) {
        configs = JSON.stringify([]);
    }

    configs = JSON.parse(configs)

    if (! Array.isArray(configs)) {
        configs = [configs];
    }

    let configIndex = configs.findIndex((configItem: ConfigItem) => {
        return configItem.server === contents.server && configItem.environment === contents.environment
    })

    if (configIndex === -1) {
        configs.push(contents)
    } else {
        configs.splice(configIndex, 1, contents)
    }

    await fs.writeFile('.envault.json', JSON.stringify(configs))

    return contents
}
