# JSON Forms Documentation Website

For detailed architecture, see [.prompts/project-info.prompttemplate](.prompts/project-info.prompttemplate).

## Development Commands

### Install Dependencies
```bash
npm ci
```

### Start Development Server
```bash
npm start
```
This starts the local development server at `http://localhost:3000` with hot-reloading.
It uses the published `@jsonforms/*` versions from `package.json`.

### Develop Against Local JSON Forms
This website lives inside the JSON Forms monorepo. To render the site against
the local (unreleased) state of JSON Forms, build the packages once at the repo
root (`pnpm build`), then run:
```bash
npm run start:local   # or: npm run build:local
```
`JSONFORMS_LOCAL=true` makes the build alias `@jsonforms/*` to the monorepo's
local `packages/*` (see `src/custom-webpack/index.js`). Re-run `pnpm build` at
the root after changing a package. Refresh the bundled API docs with
`./copy-docs.sh`.

### Build for Production
```bash
npm run build
```
This generates static files in the `/build` directory.

### Serve Production Build Locally
```bash
npm run serve
```
Serves the built site locally to verify the production build.

### Clear Cache
```bash
npm run clear
```
Clears the Docusaurus cache if you encounter build issues.
