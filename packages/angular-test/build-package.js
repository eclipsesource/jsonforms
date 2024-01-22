const ngPackage = require('ng-packagr');

ngPackage
  .ngPackagr()
  .forProject('ng-package.json')
  .withTsConfig('tsconfig.json')
  .build()
  .catch(error => {
    console.error(error);
    process.exit(1);
  });