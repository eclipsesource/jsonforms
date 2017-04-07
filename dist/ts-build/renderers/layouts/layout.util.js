"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var runtime_1 = require("../../core/runtime");
exports.createRuntimeNotificationEvaluator = function (self, uischema) {
    return function (type) {
        var runtime = uischema['runtime'];
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
        }
    };
};
//# sourceMappingURL=layout.util.js.map