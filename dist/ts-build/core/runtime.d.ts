/**
 * The different types of runtime related changes.
 */
export declare enum RUNTIME_TYPE {
    VALIDATION_ERROR = 0,
    VISIBLE = 1,
    ENABLED = 2,
}
/**
 * A listener that is notified about any runtime related changes.
 */
export interface RuntimeListener {
    /**
     * Called when a runtime related property changes.
     * @param {RUNTIME_TYPE} type the type of runtime change
     */
    runtimeUpdated(type: RUNTIME_TYPE): void;
}
/**
 * A runtime object holds information about runtime related properties
 * of a rendered UI schema element, like the visible/disabled state and
 * possible validation errors.
 */
export declare class Runtime {
    private validationErrorMessages;
    private isVisible;
    private isEnabled;
    private listeners;
    /**
     * Whether the element is visible.
     * @return {boolean} true, if the element is visible, false otherwise
     */
    /**
     * Set the visibility state of the element
     * @param {boolean} visible whether the element should be visible
     */
    visible: boolean;
    /**
     * Whether the element is enabled.
     * @return {boolean} true, if the element is enabled, false otherwise
     */
    /**
     * Set the enabled state of the element
     * @param {boolean} enabled whether the element should be enabled
     */
    enabled: boolean;
    /**
     * Returns the validation errors associated with the element.
     * @return {Array<string>} the validation errors
     */
    /**
     * Set the validation errors.
     *
     * @param {string[]} validationErrors the validation errors
     */
    validationErrors: string[];
    /**
     * Add the given runtime listener.
     *
     * @param {RuntimeListener} listener the runtime listener to be added
     */
    registerRuntimeListener(listener: RuntimeListener): void;
    /**
     * Remove the given runtime listener.
     *
     * @param {RuntimeListener} listener the runtime listener to be removed
     */
    deregisterRuntimeListener(listener: RuntimeListener): void;
    /**
     * Notifies any runtime listeners about a runtime change.
     *
     * @param {RUNTIME_TYPE} type the runtime type
     */
    private notifyRuntimeListeners(type);
}
