export default angular
    .module('jsonforms.renderers.layouts.categories', ['jsonforms.renderers.layouts'])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('categorization.html', require('./categorization.html'));
    }])
    .name;
