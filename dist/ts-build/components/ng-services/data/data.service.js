"use strict";
var angular = require('angular');
var DataService = (function () {
    function DataService() {
    }
    DataService.prototype.unset = function () {
        this.root = undefined;
    };
    DataService.prototype.setRoot = function (newRootData) {
        if (this.root === undefined) {
            this.root = newRootData;
        }
    };
    DataService.prototype.getRoot = function () {
        return this.root;
    };
    return DataService;
}());
exports.DataService = DataService;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.service.data', [])
    .service('DataService', DataService)
    .name;
//# sourceMappingURL=data.service.js.map