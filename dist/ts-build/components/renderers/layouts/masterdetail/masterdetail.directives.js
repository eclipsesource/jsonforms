"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var pathutil_1 = require('../../../services/pathutil');
var abstract_control_1 = require('../../controls/abstract-control');
var testers_1 = require('../../testers');
var MasterDetailDirective = (function () {
    function MasterDetailDirective() {
        this.restrict = 'E';
        this.templateUrl = 'masterdetail.html';
        this.controller = MasterDetailController;
        this.controllerAs = 'vm';
    }
    return MasterDetailDirective;
}());
var MasterDetailController = (function (_super) {
    __extends(MasterDetailController, _super);
    function MasterDetailController(scope) {
        var _this = this;
        _super.call(this, scope);
        this.labelProvider = {};
        this.imageProvider = {};
        this.deletableRoot = true;
        this.scope['select'] = function (child, schema) { return _this.select(child, schema); };
        var options = this.uiSchema['options'];
        if (options) {
            var definedLabelProvider = options['labelProvider'];
            if (definedLabelProvider) {
                this.labelProvider = definedLabelProvider;
            }
            var definedImageProvider = options['imageProvider'];
            if (definedImageProvider) {
                this.imageProvider = definedImageProvider;
            }
        }
        if (this.resolvedSchema.type === 'object') {
            var innerSchema = this.resolvedSchema;
            this.treeSchema = { 'type': 'array', 'items': innerSchema };
            this.treeData = [this.resolvedData];
            this.deletableRoot = false;
        }
        else {
            this.treeSchema = this.resolvedSchema;
            this.treeData = this.resolvedData;
        }
    }
    MasterDetailController.prototype.select = function (selectedChild, selectedSchema) {
        this.selectedChild = selectedChild;
        this.selectedSchema = selectedSchema;
        this.scope['selectedChild'] = selectedChild;
    };
    MasterDetailController.$inject = ['$scope'];
    return MasterDetailController;
}(abstract_control_1.AbstractControl));
var MasterDetailCollectionController = (function () {
    function MasterDetailCollectionController(scope) {
        this.scope = scope;
        this.showSelectKeyDialog = false;
    }
    MasterDetailCollectionController.prototype.getArraySubSchemas = function (schema) {
        var result = {};
        angular.forEach(schema.properties, function (value, key) {
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
    MasterDetailCollectionController.prototype.selectElement = function (child, schema) {
        if (child === undefined || schema === undefined) {
            this.scope.select(undefined, undefined);
        }
        else {
            this.scope.select(child, schema.items);
        }
    };
    MasterDetailCollectionController.prototype.updateHasContents = function (scope) {
        if (scope.child === this.instance) {
            scope.hasContents = true;
            return;
        }
        var child = scope.child;
        var schemaToCheck = scope.schema.items;
        var keys = _.keys(this.getArraySubSchemas(schemaToCheck));
        scope.hasContents = _.some(keys, function (key) { return child[key] !== undefined && child[key].length !== 0; });
    };
    MasterDetailCollectionController.prototype.canHaveChildren = function (dataSchema) {
        return _.keys(this.getArraySubSchemas(dataSchema.items)).length !== 0;
    };
    MasterDetailCollectionController.prototype.getLabel = function (data, dataSchema) {
        var labelProperty = this.labelProvider[dataSchema.items.id];
        if (labelProperty !== undefined) {
            return data[labelProperty];
        }
        return data.name || data.id || JSON.stringify(data);
    };
    MasterDetailCollectionController.prototype.getImage = function (dataSchema) {
        var imageUrl = this.imageProvider[dataSchema.items.id];
        if (imageUrl !== undefined) {
            return imageUrl;
        }
        return null;
    };
    MasterDetailCollectionController.prototype.addElement = function (schemaKeyForAdd, schemaOfNewElement, event) {
        if (this.selectedElementForAdd[schemaKeyForAdd] === undefined) {
            this.selectedElementForAdd[schemaKeyForAdd] = [];
        }
        var newElement = {};
        this.selectedElementForAdd[schemaKeyForAdd].push(newElement);
        this.selectElement(newElement, schemaOfNewElement);
        event.stopPropagation();
        this.updateHasContents(this.selectedScopeForAdd);
        this.selectedScopeForAdd.object_open = true;
        this.showSelectKeyDialog = false;
        this.selectedScopeForAdd = undefined;
        this.selectedElementForAdd = undefined;
        this.selectedSchemaForAdd = undefined;
    };
    MasterDetailCollectionController.prototype.addToRoot = function () {
        var newElement = {};
        this.instance.push(newElement);
        this.selectElement(newElement, this.schema);
    };
    MasterDetailCollectionController.prototype.removeElement = function (data, key, parentData, parentSchema) {
        var children;
        if (parentData === this.instance) {
            children = this.instance;
        }
        else {
            children = parentData[key];
        }
        var index = children.indexOf(data);
        children.splice(index, 1);
        if (parentData === this.instance) {
            this.selectElement(undefined, undefined);
        }
        else {
            this.selectElement(parentData, parentSchema);
        }
    };
    MasterDetailCollectionController.prototype.deactivateScroll = function () {
        document.body.style.overflow = 'hidden';
    };
    MasterDetailCollectionController.prototype.activateScroll = function () {
        document.body.style.overflow = 'auto';
    };
    Object.defineProperty(MasterDetailCollectionController.prototype, "pageHeight", {
        get: function () {
            return document.body['scrollHeight'];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MasterDetailCollectionController.prototype, "pageWidth", {
        get: function () {
            return document.body['scrollWidth'];
        },
        enumerable: true,
        configurable: true
    });
    MasterDetailCollectionController.prototype.getBeautifulKeyName = function (key) {
        return pathutil_1.PathUtil.beautify(key);
    };
    MasterDetailCollectionController.prototype.handleAddClick = function (event) {
        this.addClickPositionX = event.clientX;
        this.addClickPositionY = event.clientY;
    };
    MasterDetailCollectionController.$inject = ['$scope'];
    return MasterDetailCollectionController;
}());
var MasterDetailCollectionDirective = (function () {
    function MasterDetailCollectionDirective() {
        this.restrict = 'E';
        this.controller = MasterDetailCollectionController;
        this.controllerAs = 'vm';
        this.bindToController = {
            schema: '=',
            instance: '=',
            labelProvider: '=',
            imageProvider: '=',
            deletableRoot: '='
        };
        this.scope = true;
        this.templateUrl = 'masterdetail-collection.html';
    }
    return MasterDetailCollectionDirective;
}());
var masterDetailTemplate = "\n<div class=\"jsf-masterdetail\">\n    <!-- Master -->\n    <div class=\"jsf-masterdetail-master\">\n        <jsonforms-masterdetail-collection schema=\"vm.treeSchema\" instance=\"vm.treeData\"\n            label-provider=\"vm.labelProvider\" image-provider=\"vm.imageProvider\"\n            deletable-root=\"vm.deletableRoot\">\n        </jsonforms-masterdetail-collection>\n    </div>\n    <!-- Detail -->\n    <div class=\"jsf-masterdetail-detail\">\n        <jsonforms schema=\"vm.selectedSchema\" data=\"vm.selectedChild\" ng-if=\"vm.selectedChild\">\n        </jsonforms>\n    </div>\n</div>";
var masterDetailCollectionTemplate = "\n<script type=\"text/ng-template\" id=\"masterDetailTreeEntry\">\n  <div>\n    <i ng-class=\"{\n       'chevron-down': object_open && hasContents,\n       'chevron-right': !object_open && hasContents,\n       'chevron-placeholder': !hasContents\n     }\"\n     ng-click=\"object_open=!object_open\"></i>\n    <span class=\"jsf-masterdetail-entry-icon\" ng-click=\"vm.selectElement(child,schema)\">\n      <img ng-src=\"{{vm.getImage(schema)}}\"/>\n    </span>\n    <span ng-click=\"vm.selectElement(child,schema)\"\n      class=\"jsf-masterdetail-entry\"\n      ng-class=\"{'jsf-masterdetail-entry-selected':vm.selectedChild === child}\">\n      {{vm.getLabel(child,schema)}}\n      <span class=\"jsf-masterdetail-entry-add\"\n        ng-click=\"vm.selectedScopeForAdd=$parent;vm.selectedSchemaForAdd=schema;\n          vm.selectedElementForAdd=child;vm.showSelectKeyDialog=true;\n          vm.handleAddClick($event);vm.deactivateScroll()\"\n        ng-if=\"vm.canHaveChildren(schema)\">+</span>\n      <span class=\"jsf-masterdetail-entry-remove\"\n        ng-click=\"vm.updateHasContents(parentItemContext);\n          parentItemContext.object_open=\n            parentItemContext.object_open && parentItemContext.hasContents;\n            vm.removeElement(child,schemaKey,parentItemContext.child,parentItemContext.schema);\"\n        ng-if=\"parentItemContext.hasContents\">-</span>\n    </span>\n  </div>\n  <ul class=\"jsf-masterdetail-entries\" ng-show=\"object_open\" ng-if=\"hasContents\"\n    ng-repeat=\"(schemaKey, schema) in vm.getArraySubSchemas(schema.items)\">\n    <li ng-repeat=\"child in child[schemaKey]\"\n      ng-init=\"vm.updateHasContents(this);object_open=false;\n        parentItemContext = this.$parent.$parent.$parent\"\n      class=\"{{!hasContents?'jsf-masterdetail-empty':''}}\"\n      ng-include=\"'masterDetailTreeEntry'\">\n    </li>\n  </ul>\n</script>\n<div ng-init=\"hasContents=vm.deletableRoot;parentItemContext=this;\n    child=vm.instance;schema=vm.schema;\">\n    <span ng-if=\"vm.deletableRoot\" ng-click=\"vm.addToRoot()\"\n      class=\"jsf-masterdetail-addRoot\">Add Root Item</span>\n    <ul class=\"jsf-masterdetail-entries\" ng-repeat=\"child in vm.instance\"\n      ng-init=\"object_open=false;vm.updateHasContents(this);\">\n      <li ng-include=\"'masterDetailTreeEntry'\"></li>\n    </ul>\n</div>\n<div class=\"selectKeyForAdd\" ng-if=\"vm.showSelectKeyDialog\"\n  ng-click=\"vm.showSelectKeyDialog=false;vm.activateScroll();\"\n  ng-style=\"{'height':vm.pageHeight,'width':vm.pageWidth}\">\n  <div ng-style=\"{'left':vm.addClickPositionX,'top':vm.addClickPositionY}\">\n    <ul>\n      <li ng-repeat=\"(schemaKey, schema) in vm.getArraySubSchemas(vm.selectedSchemaForAdd.items)\"\n        ng-click=\"vm.addElement(schemaKey,schema,$event);vm.activateScroll();\">\n        <span class=\"jsf-masterdetail-selectkey-icon\">\n          <img ng-src=\"{{vm.getImage(schema)}}\"/>\n        </span>\n        <span class=\"jsf-masterdetail-selectkey-label\">{{vm.getBeautifulKeyName(schemaKey)}}</span>\n      </li>\n    </ul>\n    <span ng-click=\"vm.showSelectKeyDialog=false;vm.activateScroll();\">Cancel</span>\n  </div>\n</div>\n";
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
    .name;
//# sourceMappingURL=masterdetail.directives.js.map