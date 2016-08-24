var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var abstract_control_1 = require('../../controls/abstract-control');
var jsonforms_pathresolver_1 = require('../../../services/pathresolver/jsonforms-pathresolver');
var testers_1 = require('../../testers');
var MasterDetailDirective = (function () {
    function MasterDetailDirective() {
        this.restrict = 'E';
        this.templateUrl = 'masterdetail.html';
        this.controller = MasterDetailController;
        this.controllerAs = 'vm';
    }
    return MasterDetailDirective;
})();
var MasterDetailController = (function (_super) {
    __extends(MasterDetailController, _super);
    function MasterDetailController(scope) {
        var _this = this;
        _super.call(this, scope);
        this.scope['select'] = function (child, schema) { return _this.select(child, schema); };
        this.subSchema = jsonforms_pathresolver_1.PathResolver.resolveSchema(this.schema, this.schemaPath);
    }
    MasterDetailController.prototype.select = function (selectedChild, selectedSchema) {
        this.selectedChild = selectedChild;
        this.selectedSchema = selectedSchema;
        this.scope['selectedChild'] = selectedChild;
    };
    MasterDetailController.$inject = ['$scope', 'PathResolver'];
    return MasterDetailController;
})(abstract_control_1.AbstractControl);
var MasterDetailCollectionController = (function () {
    function MasterDetailCollectionController(scope) {
        this.scope = scope;
        this.scope['filter'] = this.filter;
    }
    MasterDetailCollectionController.prototype.filter = function (properties) {
        var result = {};
        angular.forEach(properties, function (value, key) {
            if (value.type === 'array' && value.items.type === 'object') {
                result[key] = value;
            }
        });
        return result;
    };
    Object.defineProperty(MasterDetailCollectionController.prototype, "selectedChild", {
        get: function () {
            return this.scope.selectedChild;
        },
        enumerable: true,
        configurable: true
    });
    MasterDetailCollectionController.prototype.selectElement = function (child, value) {
        this.scope.select(child, value.items);
    };
    MasterDetailCollectionController.prototype.hasKeys = function (schemaToCheck) {
        return _.keys(this.filter(schemaToCheck.properties)).length > 0;
    };
    MasterDetailCollectionController.prototype.isEmptyInstance = function (object, key) {
        return object[key] === undefined || object[key].length === 0;
    };
    MasterDetailCollectionController.$inject = ['$scope'];
    return MasterDetailCollectionController;
})();
var MasterDetailCollectionDirective = (function () {
    function MasterDetailCollectionDirective() {
        this.restrict = 'E';
        this.controller = MasterDetailCollectionController;
        this.controllerAs = 'vm';
        this.bindToController = {
            properties: '=',
            instance: '='
        };
        this.scope = true;
        this.templateUrl = 'masterdetail-collection.html';
    }
    return MasterDetailCollectionDirective;
})();
var MasterDetailMemberController = (function () {
    function MasterDetailMemberController($compile, scope) {
        this.$compile = $compile;
        this.scope = scope;
    }
    MasterDetailMemberController.prototype.init = function () {
        var _this = this;
        if (_.keys(this.scope.filter(this.childSchema.properties)).length !== 0) {
            this.$compile("<jsonforms-masterdetail-collection\n                            properties=\"vm.childSchema.properties\"\n                            instance=\"vm.childData\">\n                </jsonforms-masterdetail-collection>")(this.scope, function (cloned) { return _this.element.replaceWith(cloned); });
        }
    };
    MasterDetailMemberController.$inject = ['$compile', '$scope'];
    return MasterDetailMemberController;
})();
var MasterDetailMember = (function () {
    function MasterDetailMember() {
        this.restrict = 'E';
        this.controller = MasterDetailMemberController;
        this.controllerAs = 'vm';
        this.bindToController = {
            childSchema: '=',
            childData: '='
        };
        this.scope = true;
        this.link = function (scope, el, attrs, ctrl) {
            ctrl.element = el;
            ctrl.init();
        };
    }
    return MasterDetailMember;
})();
var masterDetailTemplate = "\n<div class=\"jsf-masterdetail\">\n    <!-- Master -->\n    <div class=\"jsf-masterdetail-master\">\n        <jsonforms-masterdetail-collection properties=\"vm.subSchema.properties\"\n                                           instance=\"vm.data\">\n        </jsonforms-masterdetail-collection>\n    </div>\n    <!-- Detail -->\n    <div class=\"jsf-masterdetail-detail\">\n        <jsonforms schema=\"vm.selectedSchema\" \n                   data=\"vm.selectedChild\" \n                   ng-if=\"vm.selectedChild\"></jsonforms>\n    </div>\n</div>";
var masterDetailCollectionTemplate = "\n<div>\n    <ul class=\"jsf-masterdetail-properties\">\n        <li ng-repeat=\"(key, value) in vm.filter(vm.properties)\">\n            <div>\n                <span class=\"jsf-masterdetail-property\">{{key}}</span>\n                <i\n                   ng-class=\"{\n                     'chevron-down': vm.attribute_open[$index],\n                     'chevron-right': !vm.attribute_open[$index]\n                   }\"\n                   ng-show=\"!vm.isEmptyInstance(vm.instance,key)\" \n                   ng-click=\"vm.attribute_open[$index]=!vm.attribute_open[$index]\">\n                </i>\n            </div>\n            <ul ng-if=\"!vm.isEmptyInstance(vm.instance,key)\" \n                class=\"jsf-masterdetail-entries\" \n                ng-show=\"vm.attribute_open[$index]\">\n                <li ng-repeat=\"child in vm.instance[key]\" \n                    class=\"{{vm.isEmptyInstance(vm.instance,key)?'jsf-masterdetail-empty':''}}\">\n                    <div>\n                        <span ng-click=\"vm.selectElement(child,value)\" \n                              class=\"jsf-masterdetail-entry\" \n                              ng-class=\"{\n                                'jsf-masterdetail-entry-selected':vm.selectedChild === child\n                              }\">\n                              {{child.name!=undefined?child.name:child}}\n                        </span>\n                        <i\n                           ng-class=\"{\n                             'chevron-down': vm.object_open[$index],\n                             'chevron-right': !vm.object_open[$index]\n                           }\"\n                           ng-if=\"vm.hasKeys(value.items)\" \n                           ng-click=\"vm.object_open[$index]=!vm.object_open[$index]\"></i>\n                    </div>\n                    <div ng-show=\"vm.object_open[$index]\" ng-if=\"vm.hasKeys(value.items)\" >\n                        <jsonforms-masterdetail-member child-schema=\"value.items\" \n                                                       child-data=\"child\">\n                        </jsonforms-masterdetail-member>\n                    </div>\n                </li>\n            </ul>\n        </li>\n    </ul>\n</div>";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.renderers.layouts.masterdetail', ['jsonforms.renderers.layouts'])
    .directive('masterDetail', function () { return new MasterDetailDirective(); })
    .run(['RendererService', function (RendererService) {
        return RendererService.register('master-detail', testers_1.uiTypeIs('MasterDetailLayout'), 2);
    }
])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('masterdetail.html', masterDetailTemplate);
    }])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('masterdetail-collection.html', masterDetailCollectionTemplate);
    }])
    .directive('jsonformsMasterdetailCollection', function () { return new MasterDetailCollectionDirective(); })
    .directive('jsonformsMasterdetailMember', function () { return new MasterDetailMember(); })
    .name;
//# sourceMappingURL=masterdetail-directives.js.map