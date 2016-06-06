export default angular
    .module('jsonforms-bootstrap.renderers.layouts.categories',
        ['jsonforms.renderers.layouts', 'jsonforms-bootstrap'])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('categorization.html', require('./categorization.html'));
    }])
    .name;
