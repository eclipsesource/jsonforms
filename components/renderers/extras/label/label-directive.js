var renderer_service_1 = require('../../renderer-service');
var LabelDirective = (function () {
    function LabelDirective() {
        this.restrict = 'E';
        this.template = "<jsonforms-widget class=\"jsf-label\">{{vm.text}}<hr></jsonforms-widget>";
        this.controller = LabelController;
        this.controllerAs = 'vm';
    }
    return LabelDirective;
})();
var LabelController = (function () {
    function LabelController(scope) {
        this.scope = scope;
        this.text = scope['uischema']['text'];
    }
    Object.defineProperty(LabelController.prototype, "size", {
        get: function () {
            return 100;
        },
        enumerable: true,
        configurable: true
    });
    LabelController.$inject = ['$scope'];
    return LabelController;
})();
var LabelControlRendererTester = function (element, dataSchema, dataObject, pathResolver) {
    if (element.type !== 'Label') {
        return renderer_service_1.NOT_FITTING;
    }
    return 2;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.renderers.extras.label', ['jsonforms.renderers'])
    .directive('labelControl', function () { return new LabelDirective(); })
    .run(['RendererService', function (RendererService) {
        return RendererService.register('label-control', LabelControlRendererTester);
    }
])
    .name;
//# sourceMappingURL=label-directive.js.map