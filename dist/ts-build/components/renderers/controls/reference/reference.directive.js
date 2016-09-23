"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_control_1 = require('../abstract-control');
var path_resolver_1 = require('../../../services/path-resolver/path-resolver');
var testers_1 = require('../../testers');
var ReferenceDirective = (function () {
    function ReferenceDirective() {
        this.restrict = 'E';
        this.template = "<div>{{vm.prefix}} <a href=\"{{vm.link}}\">{{vm.linkText}}</a></div>";
        this.controller = ReferenceController;
        this.controllerAs = 'vm';
    }
    return ReferenceDirective;
}());
var ReferenceController = (function (_super) {
    __extends(ReferenceController, _super);
    function ReferenceController(scope) {
        _super.call(this, scope);
    }
    Object.defineProperty(ReferenceController.prototype, "link", {
        get: function () {
            var normalizedPath = path_resolver_1.PathResolver.toInstancePath(this.schemaPath);
            return '#' + this.uiSchema['href']['url'] + '/' + this.data[normalizedPath];
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ReferenceController.prototype, "linkText", {
        get: function () {
            return this.uiSchema['href']['label'] ? this.uiSchema['href']['label'] : this.label;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReferenceController.prototype, "prefix", {
        get: function () {
            return this.uiSchema.label ? this.uiSchema.label : 'Go to';
        },
        enumerable: true,
        configurable: true
    });
    ReferenceController.$inject = ['$scope'];
    return ReferenceController;
}(abstract_control_1.AbstractControl));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.renderers.controls.reference', ['jsonforms.renderers.controls'])
    .directive('referenceControl', function () { return new ReferenceDirective(); })
    .run(['RendererService', function (RendererService) {
        return RendererService.register('reference-control', testers_1.uiTypeIs('ReferenceControl'), 2);
    }
])
    .name;
//# sourceMappingURL=reference.directive.js.map