"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const runtime_1 = require("../../core/runtime");
/**
 * Utility function for evaluating a runtime notification.
 * @param {HTMLElement} self a HTML element whose state might be updated
 *        due to the runtime notification
 * @param {UISchemaElement} uischema a UI schema element with the current runtime state
 */
exports.createRuntimeNotificationEvaluator = (self, uischema) => (type) => {
    const runtime = uischema.runtime;
    switch (type) {
        case runtime_1.RUNTIME_TYPE.VISIBLE:
            self.hidden = !runtime.visible;
            break;
        case runtime_1.RUNTIME_TYPE.ENABLED:
            if (!runtime.enabled) {
                self.firstElementChild.setAttribute('disabled', 'true');
            }
            else {
                self.firstElementChild.removeAttribute('disabled');
            }
            break;
        default:
    }
};
//# sourceMappingURL=layout.util.js.map