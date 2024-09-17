# JSON Forms Website

The JSON Forms documentation website is built using [Docusaurus 2](https://v2.docusaurus.io/), a modern static website generator.

The content of the website can be found within the `content` folder.
All the logic for demos, the index and the support page can be found within the `src` folder.
Some static files such as images, logos etc. can be found within the `static` folder.

## Installation

Use Node >= 18

```console
npm ci
```

## Local Development

```console
npm start
```

This command starts a local development server and opens up a Browser window.
Most changes are reflected live without having to restart the server.

## Build

```console
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Copy API docs

```console
./copy-docs.sh <jsonforms-folder-location>
```

This command will copy the docs from each package of the jsonforms repository into the `/static/api` folder within this project.
The command only takes one argument: The relative path to the jsonforms repository location (e.g. `../jsonforms`)

## Build with @next text

```console
./build_with_next.sh
```

This script queries the latest preview version of JSON Forms from Github and writes it into the environment variables.
