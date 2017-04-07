"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_util_1 = require("../path.util");
var DataService = (function () {
    function DataService(data) {
        this.data = data;
        this.changeListeners = [];
    }
    DataService.prototype.notifyChange = function (uischema, newValue) {
        var _this = this;
        if (uischema !== undefined && uischema !== null) {
            var pair = path_util_1.getValuePropertyPair(this.data, uischema.scope.$ref);
            pair.instance[pair.property] = newValue;
        }
        this.changeListeners.forEach(function (listener) {
            if (listener.isRelevantKey(uischema)) {
                listener.notifyChange(uischema, newValue, _this.data);
            }
        });
    };
    DataService.prototype.registerChangeListener = function (listener) {
        this.changeListeners.push(listener);
    };
    DataService.prototype.unregisterChangeListener = function (listener) {
        this.changeListeners.splice(this.changeListeners.indexOf(listener), 1);
    };
    DataService.prototype.getValue = function (uischema) {
        var pair = path_util_1.getValuePropertyPair(this.data, uischema.scope.$ref);
        if (pair.property === undefined) {
            return pair.instance;
        }
        return pair.instance[pair.property];
    };
    DataService.prototype.initialRootRun = function () {
        var _this = this;
        this.changeListeners.forEach(function (listener) {
            if (listener.isRelevantKey(null)) {
                listener.notifyChange(null, null, _this.data);
            }
        });
    };
    return DataService;
}());
exports.DataService = DataService;
//# sourceMappingURL=data.service.js.map