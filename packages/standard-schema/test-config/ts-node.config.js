// Register ts-node and override ts options for ava
require('ts-node').register({
  compilerOptions: {
    module: 'commonjs',
    target: 'es5',
  },
});
