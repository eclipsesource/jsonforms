export default angular
    .module('jsonforms-bootstrap.renderers.controls.boolean',
        ['jsonforms-bootstrap.renderers.controls'])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('boolean.html', require('./boolean.html'));
    }])
    .name;
