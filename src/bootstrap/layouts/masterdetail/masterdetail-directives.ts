require('./masterdetail.css');

export default angular
    .module('jsonforms-bootstrap.renderers.layouts.masterdetail',
        ['jsonforms.renderers.layouts', 'jsonforms-bootstrap'])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('masterdetail.html', require('./masterdetail.html'));
    }])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('masterdetail-collection.html',
            require('./masterdetail-collection.html'));
    }])
    .name;
