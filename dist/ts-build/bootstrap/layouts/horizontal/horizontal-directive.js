var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var horizontal_directive_1 = require('../../../components/renderers/layouts/horizontal/horizontal-directive');
var testers_1 = require('../../../components/renderers/testers');
var BootstrapHorizontalDirective = (function () {
    function BootstrapHorizontalDirective() {
        this.restrict = 'E';
        this.templateUrl = 'horizontal.html';
        this.controller = BootstrapHorizontalController;
        this.controllerAs = 'vm';
    }
    return BootstrapHorizontalDirective;
})();
var BootstrapHorizontalController = (function (_super) {
    __extends(BootstrapHorizontalController, _super);
    function BootstrapHorizontalController(scope) {
        _super.call(this, scope);
    }
    Object.defineProperty(BootstrapHorizontalController.prototype, "size", {
        get: function () {
            return 100;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BootstrapHorizontalController.prototype, "childSize", {
        get: function () {
            return Math.floor(this.size / this.uiSchema.elements.length);
        },
        enumerable: true,
        configurable: true
    });
    BootstrapHorizontalController.$inject = ['$scope'];
    return BootstrapHorizontalController;
})(horizontal_directive_1.HorizontalController);
var horizontalTemplate = "<jsonforms-layout class=\"jsf-horizontal-layout\">\n    <div class=\"jsf-horizontal-layout\">\n        <div class=\"row\">\n            <div ng-repeat=\"child in vm.uiSchema.elements\" class=\"col-sm-{{vm.childSize}}\">\n                <jsonforms-inner uischema=\"child\"></jsonforms-inner>\n            </div>\n        </div>\n    </div>\n</jsonforms-layout>";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms-bootstrap.renderers.layouts.horizontal', ['jsonforms.renderers.layouts', 'jsonforms-bootstrap'])
    .directive('horizontalBootstrapLayout', function () { return new BootstrapHorizontalDirective(); })
    .run(['RendererService', function (RendererService) {
        return RendererService.register('horizontal-bootstrap-layout', testers_1.uiTypeIs('HorizontalLayout'), 3);
    }
])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('horizontal.html', horizontalTemplate);
    }])
    .name;
//# sourceMappingURL=horizontal-directive.js.map