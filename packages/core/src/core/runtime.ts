/**
 * The different types of runtime related changes.
 */
export enum RUNTIME_TYPE {
  VALIDATION_ERROR, VISIBLE, ENABLED
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
export class Runtime {
  private validationErrorMessages: string[];
  private isVisible = true;
  private isEnabled = true;
  private listeners: RuntimeListener[] = [];

  /**
   * Whether the element is visible.
   * @return {boolean} true, if the element is visible, false otherwise
   */
  get visible(): boolean { return this.isVisible; }

  /**
   * Set the visibility state of the element
   * @param {boolean} visible whether the element should be visible
   */
  set visible(visible: boolean) {
    this.isVisible = visible;
    this.notifyRuntimeListeners(RUNTIME_TYPE.VISIBLE);
  }

  /**
   * Whether the element is enabled.
   * @return {boolean} true, if the element is enabled, false otherwise
   */
  get enabled(): boolean { return this.isEnabled; }

  /**
   * Set the enabled state of the element
   * @param {boolean} enabled whether the element should be enabled
   */
  set enabled(enabled: boolean) {
    this.isEnabled = enabled;
    this.notifyRuntimeListeners(RUNTIME_TYPE.ENABLED);
  }

  /**
   * Returns the validation errors associated with the element.
   * @return {Array<string>} the validation errors
   */
  get validationErrors(): string[] { return this.validationErrorMessages; }

  /**
   * Set the validation errors.
   *
   * @param {string[]} validationErrors the validation errors
   */
  set validationErrors(validationErrors: string[]) {
    this.validationErrorMessages = validationErrors;
    this.notifyRuntimeListeners(RUNTIME_TYPE.VALIDATION_ERROR);
  }

  /**
   * Add the given runtime listener.
   *
   * @param {RuntimeListener} listener the runtime listener to be added
   */
  registerRuntimeListener(listener: RuntimeListener): void {
    this.listeners.push(listener);
  }

  /**
   * Remove the given runtime listener.
   *
   * @param {RuntimeListener} listener the runtime listener to be removed
   */
  deregisterRuntimeListener(listener: RuntimeListener): void {
    this.listeners.splice(this.listeners.indexOf(listener), 1);
  }

  /**
   * Notifies any runtime listeners about a runtime change.
   *
   * @param {RUNTIME_TYPE} type the runtime type
   */
  private notifyRuntimeListeners(type: RUNTIME_TYPE): void {
    this.listeners.forEach(listener => {
      listener.runtimeUpdated(type);
    });
  }
}
