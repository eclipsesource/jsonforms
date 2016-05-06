export default angular
    .module('jsonforms-bootstrap.controls', ['jsonforms-bootstrap'])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('control.html', require('./control.html'));
    }])
    .name;
