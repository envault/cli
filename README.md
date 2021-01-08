# Envault CLI

The Envault CLI allows you to connect to your [Envault server](https://github.com/envault/enevault) and sync its credentials to your local .env file.

## Usage

To use the Envault CLI, you must have [Node.js](https://nodejs.org/) installed on your computer.

On your Envault dashboard, you will find an initialization command for each environment, which you can run to establish a connection to your Envault server, and pull your variables. This command only needs to be run the first time you connect your .env to Envault. An example initialization command:

```
npx envault vault.envault.dev 84632 iCNaGGLou6v0mRas
```

After you've run your environment initialization command for the first time, you can pull your .env again easily:

```
npx envault
```

### Options

By default, Envault will not pull variables that are not already present in your .env file. To enable this behaviour, use the `--constructive` flag:

```
npx envault --constructive
```

You are able to customise the name of your .env file using the `--filename` flag:

```
npx envault vault.envault.dev 84632 iCNaGGLou6v0mRas --filename=.myenv
```

The Envault CLI will sometimes prompt you to confirm your actions, especially those made in constructive mode. To bypass these prompts, use the `--force` flag:

```
npx envault --force
```

## Need Help?

🐞 If you spot a bug with Envault, please [submit a detailed issue](https://github.com/envault/envault/issues/new), and wait for assistance.

🤔 If you have a question or feature request, please [start a new discussion](https://github.com/envault/envault/discussions/new).

🔐 If you discover a vulnerability within Envault, please review our [security policy](https://github.com/envault/cli/blob/master/SECURITY.md).
