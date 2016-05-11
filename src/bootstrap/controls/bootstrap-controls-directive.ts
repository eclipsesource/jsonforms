export default angular
    .module('jsonforms-bootstrap.renderers.controls', ['jsonforms-bootstrap'])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('control.html', require('./control.html'));
    }])
    .name;
