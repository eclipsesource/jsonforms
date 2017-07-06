import { RUNTIME_TYPE } from '../../core/runtime';
import { UISchemaElement } from '../../models/uischema';
/**
 * Utility function for evaluating a runtime notification.
 * @param {HTMLElement} self a HTML element whose state might be updated
 *        due to the runtime notification
 * @param {UISchemaElement} uischema a UI schema element with the current runtime state
 */
export declare const createRuntimeNotificationEvaluator: (self: HTMLElement, uischema: UISchemaElement) => (type: RUNTIME_TYPE) => void;
