const layoutTemplate = `<div flex ng-transclude></div>`;

export default angular
    .module('jsonforms-material.renderers.layouts', [])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('layout.html', layoutTemplate);
    }])
    .name;
