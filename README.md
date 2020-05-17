# Envault CLI

[Envault](https://envault.dev) is a repository for your credentials. It lets you manage and sync your entire team’s local .env variables, so you’re all kept up to date. Simply install your Envault server and you're ready to sync. 🚀

The Envault CLI allows you to connect to your Envault server and sync its credentials to your local .env file.

## Usage

To use the Envault CLI, you must have [Node.js](https://nodejs.org/) installed on your computer.

On your Envault dashboard, you will find a setup command for each app, which you can run to establish a connection to your Envault server, and sync your local .env. This command only needs to be run the first time you connect your .env to Envault. An example setup command:

```
npx envault vault.envault.dev 84632 iCNaGGLou6v0mRas
```

After you've run your app setup command for the first time, you can sync your .env again easily:

```
npx envault
```

## Documentation

Envault has a [comprehensive documentation](https://docs.envault.dev) available on our website.

## Support

If you spot a bug with the Envault CLI, please [submit a detailed issue](https://github.com/envault/cli/issues) and a member of our team will assist you.

If you would like support, please log into the [Envault Portal](https://portal.envault.dev), where you can access live chat with our team. Alternatively, you can email [support@envault.dev](mailto:support@envault.dev) and we'll get right back to you.

If you discover a security vulnerability within Envault, please email Dan Harrin via [dan@envault.dev](mailto:dan@envault.dev). All security vulnerabilities will be promptly addressed.

## License

The Envault CLI has been released under [the MIT License](https://github.com/envault/cli/blob/master/LICENSE.md).