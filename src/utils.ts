const fs = require('fs').promises

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

export async function getConfig() {
    let config

    try {
        config = (await fs.readFile('.envault.json')).toJSON()
    } catch (error) {
        return false
    }

    let fixed = false

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

export async function writeConfig(contents: object) {
    await fs.writeFile('.envault.json', JSON.stringify(contents))

    return contents
}
