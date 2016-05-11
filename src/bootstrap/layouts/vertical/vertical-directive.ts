export default angular
    .module('jsonforms-bootstrap.renderers.layouts.vertical',
        ['jsonforms.renderers.layouts', 'jsonforms-bootstrap'])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('vertical.html', require('./vertical.html'));
    }])
    .name;
