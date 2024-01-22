const path = require('path');
const ngCore = require('@angular-devkit/core');
const buildWebpackBrowser = require('@angular-devkit/build-angular/src/builders/browser').buildWebpackBrowser;

const main = async () => new Promise((resolve, reject) => {
  const project = 'angular-material';
  const target = 'build';
  const configuration = '';
  const workspaceRoot = path.join(process.cwd(), '../..');
  const root = `packages/${project}`;
  const options = {
    outputPath: root + '/example/dist',
    tsConfig: root + '/tsconfig.example.json',
    main: root + '/example/main.ts',
    index: root + '/example/index.html',
    styles: [
      root + '/node_modules/@angular/material/prebuilt-themes/indigo-pink.css'
    ],
    allowedCommonJsDependencies: [
      'lodash',
      'hammerjs'
    ],
    watch: false,
    buildOptimizer: false,
    optimization: false,
    outputHashing: 'none',
  };
  const sourceRoot = root;
  const teardownLogics = [];
  const context = {
    workspaceRoot,
    logger: new ngCore.logging.Logger(`${project}:${target}:`),
    target: {
        project,
        configuration,
        target
    },
    getProjectMetadata: (projectName) => Promise.resolve({
        root,
        sourceRoot
    }),
    getBuilderNameForTarget: () => '@angular-devkit/build-angular:karma',
    getTargetOptions: (target) => ({...options}),
    validateOptions: (options) => options,
    addTeardown: (teardown) => {
      teardownLogics.push(teardown);
    }
  };
  let exitCode = 1;
  buildWebpackBrowser(options, context, {}).subscribe({
    next: out => {
      if (out.success) {
        exitCode = 0;
      }
    },
    error: (err) => {
      reject(err);
    },
    complete: () => {
      if (!exitCode) return resolve();
      reject();
    }
  });
  return exitCode;
});

main()
.then(() => {
  process.exit(0);
})
.catch(err => {
  process.exit(1);
});