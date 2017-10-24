"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var actions_1 = require("../actions");
exports.rendererReducer = function (state, _a) {
    if (state === void 0) { state = []; }
    var type = _a.type, tester = _a.tester, renderer = _a.renderer;
    switch (type) {
        case actions_1.ADD_RENDERER:
            return state.concat([{ tester: tester, renderer: renderer }]);
        case actions_1.REMOVE_RENDERER:
            return state.filter(function (t) { return t.tester !== tester; });
        default:
            return state;
    }
};
//# sourceMappingURL=renderers.js.map