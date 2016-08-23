const layoutTemplate = `<div ng-hide="vm.hide || vm.uiSchema.elements.length==0" flex ng-transclude></div>`;

export default angular
    .module('jsonforms-material.renderers.layouts', [])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('layout.html', layoutTemplate);
    }])
    .name;
