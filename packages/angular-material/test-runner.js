const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const path = require('path');
const ngCore = require('@angular-devkit/core');
const execute = require('@angular-devkit/build-angular/src/builders/karma').execute;

// Dumped from debug, subject to changes
const defaultWebpackOptions = {
  assets: [],
  scripts: [],
  styles: [],
  inlineStyleLanguage: 'css',
  stylePreprocessorOptions: {
    includePaths: [],
  },
  include: [
    '../test/**/*.spec.ts'
  ],
  exclude: [],
  sourceMap: true,
  progress: true,
  codeCoverage: false,
  codeCoverageExclude: [],
  fileReplacements: [],
  reporters: []
};

const normalizeOptions = (options, context) => {
  return {
    ...defaultWebpackOptions,
    ...options
  }
};

const webpackConfigTransform = (options, context, webpackConfig) => {
  const projectRoot = context.getProjectMetadata().root;
  webpackConfig.resolve.modules.push(projectRoot + '/node_modules');
  return webpackConfig;
};

const karmaConfigOptionsTransform = (options, context, karmaConfigOptions) => {
  /* FYI
  type KarmaConfigOptions = ConfigOptions & {
      buildWebpack?: unknown;
      configFile?: string;
  };
  */
  return karmaConfigOptions;
};
const main = async (params) => new Promise((resolve, reject) => {
  const singleRun = !!params.singleRun;
  const coverage = !!params.coverage;
  const project = 'angular-material';
  const target = 'test';
  const configuration = '';
  const workspaceRoot = path.join(process.cwd(), '../..');
  const options = {
    singleRun,
    watch: !singleRun, // angular uses the opposite of watch as single run in karmaConfigOptions
    coverage,
    codeCoverage: coverage,
    polyfills: [
      'zone.js',
      'zone.js/testing'
    ],
    tsConfig: 'packages/angular-material/tsconfig.spec.json',
    karmaConfig: 'packages/angular-material/karma.conf.js'
  };
  const root = `packages/${project}`;
  const sourceRoot = root + '/src';
  const teardownLogics = [];
  const context = {
    workspaceRoot,
    logger: new ngCore.logging.Logger(`${project}:${target}:`),
    target: {
        project,
        configuration,
        target
    },
    getProjectMetadata: (projectName) => ({
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
  
  const transforms = {
    webpackConfiguration: webpackConfigTransform.bind(null, options, context),
    karmaOptions: karmaConfigOptionsTransform.bind(null, options, context)
  };
  let exitCode = 1;
  execute(normalizeOptions(options, context), context, transforms).subscribe({
    next: out => {
      if (out.success) {
        exitCode = 0;
      }
    },
    error: reject,
    complete: () => {
      if (!exitCode) return resolve();
      reject();
    }
  });
  return exitCode;
});

main(
  yargs(hideBin(process.argv)).options({
    singleRun: {
      alias: 'single-run',
      type: 'boolean'
    },
    codeCoverage: {
      alias: 'coverage',
      type: 'boolean'
    }
  }).parseSync()
)
.then(() => {
  process.exit(0);
})
.catch(err => {
  process.exit(1);
});