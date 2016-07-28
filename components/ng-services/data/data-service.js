var angular = require('angular');
var RootDataService = (function () {
    function RootDataService() {
    }
    RootDataService.prototype.unset = function () {
        this.root = undefined;
    };
    RootDataService.prototype.setData = function (newRootData) {
        if (this.root === undefined) {
            this.root = newRootData;
        }
    };
    RootDataService.prototype.getRootData = function () {
        return this.root;
    };
    return RootDataService;
})();
exports.RootDataService = RootDataService;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.data.root', [])
    .service('RootDataService', RootDataService)
    .name;
//# sourceMappingURL=data-service.js.map