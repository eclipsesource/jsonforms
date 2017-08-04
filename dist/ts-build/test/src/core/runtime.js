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
class Runtime {
    constructor() {
        this.isVisible = true;
        this.isEnabled = true;
        this.listeners = [];
    }
    /**
     * Whether the element is visible.
     * @return {boolean} true, if the element is visible, false otherwise
     */
    get visible() { return this.isVisible; }
    /**
     * Set the visibility state of the element
     * @param {boolean} visible whether the element should be visible
     */
    set visible(visible) {
        this.isVisible = visible;
        this.notifyRuntimeListeners(RUNTIME_TYPE.VISIBLE);
    }
    /**
     * Whether the element is enabled.
     * @return {boolean} true, if the element is enabled, false otherwise
     */
    get enabled() { return this.isEnabled; }
    /**
     * Set the enabled state of the element
     * @param {boolean} enabled whether the element should be enabled
     */
    set enabled(enabled) {
        this.isEnabled = enabled;
        this.notifyRuntimeListeners(RUNTIME_TYPE.ENABLED);
    }
    /**
     * Returns the validation errors associated with the element.
     * @return {Array<string>} the validation errors
     */
    get validationErrors() { return this.validationErrorMessages; }
    /**
     * Set the validation errors.
     *
     * @param {string[]} validationErrors the validation errors
     */
    set validationErrors(validationErrors) {
        this.validationErrorMessages = validationErrors;
        this.notifyRuntimeListeners(RUNTIME_TYPE.VALIDATION_ERROR);
    }
    /**
     * Add the given runtime listener.
     *
     * @param {RuntimeListener} listener the runtime listener to be added
     */
    registerRuntimeListener(listener) {
        this.listeners.push(listener);
    }
    /**
     * Remove the given runtime listener.
     *
     * @param {RuntimeListener} listener the runtime listener to be removed
     */
    deregisterRuntimeListener(listener) {
        this.listeners.splice(this.listeners.indexOf(listener), 1);
    }
    /**
     * Notifies any runtime listeners about a runtime change.
     *
     * @param {RUNTIME_TYPE} type the runtime type
     */
    notifyRuntimeListeners(type) {
        this.listeners.forEach(listener => {
            listener.runtimeUpdated(type);
        });
    }
}
exports.Runtime = Runtime;
//# sourceMappingURL=runtime.js.map