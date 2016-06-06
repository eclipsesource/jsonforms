export default angular
    .module('jsonforms-bootstrap.renderers.layouts.group',
        ['jsonforms.renderers.layouts', 'jsonforms-bootstrap'])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('group.html', require('./group.html'));
    }])
    .name;
