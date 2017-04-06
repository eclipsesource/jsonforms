import { UISchemaElement } from '../../models/uischema';
import {Runtime, RUNTIME_TYPE} from '../../core/runtime';
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
}
