"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_layout_1 = require('../abstract-layout');
var testers_1 = require('../../testers');
var CategorizationDirective = (function () {
    function CategorizationDirective() {
        this.restrict = 'E';
        this.templateUrl = 'categorization.html';
        this.controller = CategorizationController;
        this.controllerAs = 'vm';
    }
    return CategorizationDirective;
}());
var CategorizationController = (function (_super) {
    __extends(CategorizationController, _super);
    function CategorizationController(scope) {
        _super.call(this, scope);
    }
    CategorizationController.prototype.changeSelectedCategory = function (category, clickScope) {
        if (category.type === 'Category') {
            this.selectedCategory = category;
        }
        else {
            clickScope.expanded = !clickScope.expanded;
            if (!clickScope.expanded) {
                this.selectedCategory = null;
            }
        }
    };
    CategorizationController.$inject = ['$scope'];
    return CategorizationController;
}(abstract_layout_1.AbstractLayout));
exports.CategorizationController = CategorizationController;
var categorizationTemplate = "\n<script type=\"text/ng-template\" id=\"category.html\">\n  <ul>\n      <li ng-repeat=\"category in categorization.elements\" ng-init=\"expanded=false\"\n        ng-class=\"{\n          'closed': !expanded && category.type==='Categorization',\n          'expanded': expanded && category.type==='Categorization',\n          'none': category.type==='Category'\n        }\">\n          <div class=\"jsf-category-entry\">\n            <span class=\"jsf-category-label\"\n                  ng-class=\"{'selected': category===vm.selectedCategory}\"\n                  ng-click=\"vm.changeSelectedCategory(category,this)\">\n                  {{category.label}}\n            </span>\n          </div>\n          <div class=\"jsf-category-subcategories\" ng-init=\"categorization=category\"\n           ng-if=\"category.type==='Categorization'\" ng-show=\"expanded\" ng-include=\"'category.html'\">\n          </div>\n      </li>\n  </ul>\n</script>\n<jsonforms-layout>\n    <div class=\"jsf-categorization\">\n        <div class=\"jsf-categorization-master\" ng-include=\"'category.html'\"\n          ng-init=\"categorization=vm.uiSchema\">\n        </div>\n        <div class=\"jsf-categorization-detail\">\n            <jsonforms-inner ng-if=\"vm.selectedCategory\"\n                             ng-repeat=\"child in vm.selectedCategory.elements\"\n                             uischema=\"child\">\n             </jsonforms-inner>\n        </div>\n    </div>\n</jsonforms-layout>";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.renderers.layouts.categories', ['jsonforms.renderers.layouts'])
    .directive('categorization', function () { return new CategorizationDirective(); })
    .run(['RendererService', function (RendererService) {
        return RendererService.register('categorization', testers_1.uiTypeIs('Categorization'), 2);
    }
])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('categorization.html', categorizationTemplate);
    }])
    .name;
//# sourceMappingURL=categorization.directive.js.map