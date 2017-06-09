import { UISchemaElement } from '../../models/uischema';
import {Runtime, RUNTIME_TYPE} from '../../core/runtime';

/**
 * Utility function for evaluating a runtime notification.
 * @param {HTMLElement} self a HTML element whose state might be updated
 *        due to the runtime notification
 * @param {UISchemaElement} uischema a UI schema element with the current runtime state
 */
export const createRuntimeNotificationEvaluator =
(self: HTMLElement, uischema: UISchemaElement) =>
  (type: RUNTIME_TYPE) => {
  const runtime = <Runtime>uischema['runtime'];
  switch (type) {
    case RUNTIME_TYPE.VISIBLE:
      self.hidden = !runtime.visible;
      break;
    case RUNTIME_TYPE.ENABLED:
      if (!runtime.enabled) {
        self.firstElementChild.setAttribute('disabled', 'true');
      } else {
        self.firstElementChild.removeAttribute('disabled');
      }
      break;
  }
};
