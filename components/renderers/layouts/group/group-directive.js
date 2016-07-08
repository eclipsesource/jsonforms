var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var renderer_service_1 = require('../../renderer-service');
var abstract_layout_1 = require('../abstract-layout');
var GroupDirective = (function () {
    function GroupDirective() {
        this.restrict = 'E';
        this.templateUrl = 'group.html';
        this.controller = GroupController;
        this.controllerAs = 'vm';
    }
    return GroupDirective;
})();
var GroupController = (function (_super) {
    __extends(GroupController, _super);
    function GroupController(scope) {
        _super.call(this, scope);
    }
    Object.defineProperty(GroupController.prototype, "label", {
        get: function () {
            return this.uiSchema.label ? this.uiSchema.label : '';
        },
        enumerable: true,
        configurable: true
    });
    GroupController.$inject = ['$scope'];
    return GroupController;
})(abstract_layout_1.AbstractLayout);
var GroupLayoutRendererTester = function (element, dataSchema, dataObject, pathResolver) {
    if (element.type !== 'Group') {
        return renderer_service_1.NOT_FITTING;
    }
    return 2;
};
var groupTemplate = "<jsonforms-layout>\n    <div class=\"jsf-group\">\n        <fieldset>\n            <legend ng-if=\"vm.label\">{{vm.label}}</legend>\n            <jsonforms-inner ng-repeat=\"child in vm.uiSchema.elements\"\n                             uischema=\"child\">\n            </jsonforms-inner>\n         </fieldset>\n    </div>\n</jsonforms-layout>";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.renderers.layouts.group', ['jsonforms.renderers.layouts'])
    .directive('grouplayout', function () { return new GroupDirective(); })
    .run(['RendererService', function (RendererService) {
        return RendererService.register('grouplayout', GroupLayoutRendererTester);
    }
])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('group.html', groupTemplate);
    }])
    .name;
//# sourceMappingURL=group-directive.js.map