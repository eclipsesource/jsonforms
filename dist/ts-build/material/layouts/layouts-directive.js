var layoutTemplate = "<div ng-hide=\"vm.hide || vm.uiSchema.elements.length==0\" flex ng-transclude></div>";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms-material.renderers.layouts', [])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('layout.html', layoutTemplate);
    }])
    .name;
//# sourceMappingURL=layouts-directive.js.map