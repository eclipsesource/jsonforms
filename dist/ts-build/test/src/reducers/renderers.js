"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actions_1 = require("../actions");
exports.rendererReducer = (state = [], { type, tester, renderer }) => {
    switch (type) {
        case actions_1.ADD_RENDERER:
            return state.concat([{ tester, renderer }]);
        case actions_1.REMOVE_RENDERER:
            return state.filter(t => t.tester !== tester);
        default:
            return state;
    }
};
//# sourceMappingURL=renderers.js.map