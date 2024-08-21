/**
 * plugins/app.ts
 *
 * Automatically loads and bootstraps files
 * in the `./src/components/` folder.
 */

export function registerComponents(app) {
  // Automatically get all .vue files within
  // `src/components` and register them to
  // the current app.
  // https://webpack.js.org/guides/dependency-management/#requirecontext
  const requireComponent = require.context('@/components', true, /\.vue$/);

  for (const file of requireComponent.keys()) {
    const componentConfig = requireComponent(file);

    app.component(
      componentConfig.default.name,
      componentConfig.default || componentConfig
    );
  }
}
