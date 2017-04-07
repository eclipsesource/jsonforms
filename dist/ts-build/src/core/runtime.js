"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RUNTIME_TYPE;
(function (RUNTIME_TYPE) {
    RUNTIME_TYPE[RUNTIME_TYPE["VALIDATION_ERROR"] = 0] = "VALIDATION_ERROR";
    RUNTIME_TYPE[RUNTIME_TYPE["VISIBLE"] = 1] = "VISIBLE";
    RUNTIME_TYPE[RUNTIME_TYPE["ENABLED"] = 2] = "ENABLED";
})(RUNTIME_TYPE = exports.RUNTIME_TYPE || (exports.RUNTIME_TYPE = {}));
var Runtime = (function () {
    function Runtime() {
        this._visible = true;
        this._enabled = true;
        this._listeners = [];
    }
    Object.defineProperty(Runtime.prototype, "visible", {
        get: function () { return this._visible; },
        set: function (visible) {
            this._visible = visible;
            this.notifyListeners(RUNTIME_TYPE.VISIBLE);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Runtime.prototype, "enabled", {
        get: function () { return this._enabled; },
        set: function (enabled) {
            this._enabled = enabled;
            this.notifyListeners(RUNTIME_TYPE.ENABLED);
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(Runtime.prototype, "validationErrors", {
        get: function () { return this._validationErrors; },
        set: function (validationErrors) {
            this._validationErrors = validationErrors;
            this.notifyListeners(RUNTIME_TYPE.VALIDATION_ERROR);
        },
        enumerable: true,
        configurable: true
    });
    ;
    ;
    ;
    ;
    Runtime.prototype.addListener = function (listener) {
        this._listeners.push(listener);
    };
    Runtime.prototype.removeListener = function (listener) {
        this._listeners.splice(this._listeners.indexOf(listener), 1);
    };
    Runtime.prototype.notifyListeners = function (type) {
        this._listeners.forEach(function (listener) { return listener.notify(type); });
    };
    return Runtime;
}());
exports.Runtime = Runtime;
//# sourceMappingURL=runtime.js.map