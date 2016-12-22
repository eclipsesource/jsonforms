"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_layout_1 = require('../abstract-layout');
var testers_1 = require('../../testers');
var VerticalDirective = (function () {
    function VerticalDirective() {
        this.restrict = 'E';
        this.templateUrl = 'vertical.html';
        this.controller = VerticalController;
        this.controllerAs = 'vm';
    }
    return VerticalDirective;
}());
var VerticalController = (function (_super) {
    __extends(VerticalController, _super);
    function VerticalController(scope) {
        _super.call(this, scope);
    }
    VerticalController.$inject = ['$scope'];
    return VerticalController;
}(abstract_layout_1.AbstractLayout));
var verticalTemplate = "\n<jsonforms-layout>\n    <div class=\"jsf-vertical-layout\">\n        <div class=\"jsf-vertical-layout-container\">        \n            <div ng-repeat=\"child in vm.uiSchema.elements\">\n                <jsonforms-inner uischema=\"child\"></jsonforms-inner>\n            </div>\n        </div>\n    </div>\n</jsonforms-layout>";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.renderers.layouts.vertical', ['jsonforms.renderers.layouts'])
    .directive('verticallayout', function () { return new VerticalDirective(); })
    .run(['RendererService', function (RendererService) {
        return RendererService.register('verticallayout', testers_1.uiTypeIs('VerticalLayout'), 2);
    }
])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('vertical.html', verticalTemplate);
    }])
    .name;
//# sourceMappingURL=vertical.directive.js.map