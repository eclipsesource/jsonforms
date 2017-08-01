"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * The different types of runtime related changes.
 */
var RUNTIME_TYPE;
(function (RUNTIME_TYPE) {
    RUNTIME_TYPE[RUNTIME_TYPE["VALIDATION_ERROR"] = 0] = "VALIDATION_ERROR";
    RUNTIME_TYPE[RUNTIME_TYPE["VISIBLE"] = 1] = "VISIBLE";
    RUNTIME_TYPE[RUNTIME_TYPE["ENABLED"] = 2] = "ENABLED";
})(RUNTIME_TYPE = exports.RUNTIME_TYPE || (exports.RUNTIME_TYPE = {}));
/**
 * A runtime object holds information about runtime related properties
 * of a rendered UI schema element, like the visible/disabled state and
 * possible validation errors.
 */
var Runtime = (function () {
    function Runtime() {
        this.isVisible = true;
        this.isEnabled = true;
        this.listeners = [];
    }
    Object.defineProperty(Runtime.prototype, "visible", {
        /**
         * Whether the element is visible.
         * @return {boolean} true, if the element is visible, false otherwise
         */
        get: function () { return this.isVisible; },
        /**
         * Set the visibility state of the element
         * @param {boolean} visible whether the element should be visible
         */
        set: function (visible) {
            this.isVisible = visible;
            this.notifyRuntimeListeners(RUNTIME_TYPE.VISIBLE);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Runtime.prototype, "enabled", {
        /**
         * Whether the element is enabled.
         * @return {boolean} true, if the element is enabled, false otherwise
         */
        get: function () { return this.isEnabled; },
        /**
         * Set the enabled state of the element
         * @param {boolean} enabled whether the element should be enabled
         */
        set: function (enabled) {
            this.isEnabled = enabled;
            this.notifyRuntimeListeners(RUNTIME_TYPE.ENABLED);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Runtime.prototype, "validationErrors", {
        /**
         * Returns the validation errors associated with the element.
         * @return {Array<string>} the validation errors
         */
        get: function () { return this.validationErrorMessages; },
        /**
         * Set the validation errors.
         *
         * @param {string[]} validationErrors the validation errors
         */
        set: function (validationErrors) {
            this.validationErrorMessages = validationErrors;
            this.notifyRuntimeListeners(RUNTIME_TYPE.VALIDATION_ERROR);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Add the given runtime listener.
     *
     * @param {RuntimeListener} listener the runtime listener to be added
     */
    Runtime.prototype.registerRuntimeListener = function (listener) {
        this.listeners.push(listener);
    };
    /**
     * Remove the given runtime listener.
     *
     * @param {RuntimeListener} listener the runtime listener to be removed
     */
    Runtime.prototype.deregisterRuntimeListener = function (listener) {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
    };
    /**
     * Notifies any runtime listeners about a runtime change.
     *
     * @param {RUNTIME_TYPE} type the runtime type
     */
    Runtime.prototype.notifyRuntimeListeners = function (type) {
        this.listeners.forEach(function (listener) {
            listener.runtimeUpdated(type);
        });
    };
    return Runtime;
}());
exports.Runtime = Runtime;
//# sourceMappingURL=runtime.js.map