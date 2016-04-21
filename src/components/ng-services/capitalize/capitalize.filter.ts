
export default angular
    .module('jsonforms.filters.capitalize', [])
    .filter('capitalize', () =>
        (input) => {
            if (input !== undefined) {
                return input.charAt(0).toUpperCase() + input.substring(1).toLowerCase()
            }
        }
    ).name;
