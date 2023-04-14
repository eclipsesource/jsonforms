const devPresets = ['@vue/cli-plugin-babel/preset'];
const buildPresets = ['@babel/preset-env', '@babel/preset-typescript'];
module.exports = {
  presets: process.env.NODE_ENV === 'production' ? buildPresets : devPresets,
  plugins:
    process.env.NODE_ENV === 'test'
      ? [
          '@babel/plugin-proposal-optional-chaining',
          '@babel/plugin-proposal-nullish-coalescing-operator',
        ]
      : [],
};
