require('./masterdetail.css');

export default angular
    .module('jsonforms.renderers.layouts.masterdetail', ['jsonforms.renderers.layouts'])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('masterdetail.html', require('./masterdetail.html'));
    }])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('masterdetail-collection.html',
            require('./masterdetail-collection.html'));
    }])
    .name;
