
export default angular
    .module('jsonforms.filters.capitalize', [])
    .filter('capitalize', () =>
        (input) => _.capitalize(input)
    ).name;
