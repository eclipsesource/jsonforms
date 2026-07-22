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
