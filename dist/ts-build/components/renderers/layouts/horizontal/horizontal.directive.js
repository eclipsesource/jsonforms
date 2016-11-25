"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_layout_1 = require('../abstract-layout');
var testers_1 = require('../../testers');
var Labels_1 = require('../../Labels');
var HorizontalDirective = (function () {
    function HorizontalDirective() {
        this.restrict = 'E';
        this.templateUrl = 'horizontal.html';
        this.controller = HorizontalController;
        this.controllerAs = 'vm';
    }
    return HorizontalDirective;
}());
var HorizontalController = (function (_super) {
    __extends(HorizontalController, _super);
    function HorizontalController(scope) {
        _super.call(this, scope);
        this.updateChildrenLabel(this.uiSchema.elements);
    }
    HorizontalController.prototype.updateChildrenLabel = function (elements) {
        var labelExists = elements.reduce(function (atLeastOneLabel, element) {
            return atLeastOneLabel || Labels_1.LabelObjectUtil.shouldShowLabel(element);
        }, false);
        if (labelExists) {
            elements.forEach(function (element) {
                var showElementLabel = Labels_1.LabelObjectUtil.shouldShowLabel(element);
                if (!showElementLabel) {
                    element.label = { show: true, text: '' };
                }
            });
        }
    };
    HorizontalController.$inject = ['$scope'];
    return HorizontalController;
}(abstract_layout_1.AbstractLayout));
exports.HorizontalController = HorizontalController;
var horizontalTemplate = "<jsonforms-layout>\n    <div class=\"jsf-horizontal-layout\">\n         <div class=\"jsf-horizontal-layout-container\">\n              <div ng-repeat=\"child in vm.uiSchema.elements\">\n                   <jsonforms-inner uischema=\"child\"></jsonforms-inner>\n              </div>\n         </div>\n    </div>\n</jsonforms-layout>";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.renderers.layouts.horizontal', ['jsonforms.renderers.layouts'])
    .directive('horizontallayout', function () { return new HorizontalDirective(); })
    .run(['RendererService', function (RendererService) {
        return RendererService.register('horizontallayout', testers_1.uiTypeIs('HorizontalLayout'), 2);
    }
])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('horizontal.html', horizontalTemplate);
    }])
    .name;
//# sourceMappingURL=horizontal.directive.js.map