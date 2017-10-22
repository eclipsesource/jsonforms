"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./reducers/index");
exports.INIT = 'INIT';
exports.UPDATE_DATA = 'UPDATE';
exports.UPDATE_UI = 'UPDATE_UI';
exports.VALIDATE = 'VALIDATE';
exports.SHOW = 'SHOW';
exports.HIDE = 'HIDE';
exports.ENABLE = 'ENABLE';
exports.DISABLE = 'DISABLE';
exports.ADD_RENDERER = 'ADD_RENDERER';
exports.REMOVE_RENDERER = 'REMOVE_RENDERER';
// TODO: fix typings
exports.update = (path, updater) => (dispatch, getState) => {
    dispatch({
        type: exports.UPDATE_DATA,
        path,
        updater
    });
    dispatch({
        type: exports.VALIDATE,
        data: index_1.getData(getState())
    });
};
exports.validate = () => (dispatch, getState) => {
    dispatch({
        type: exports.VALIDATE,
        data: index_1.getData(getState())
    });
};
exports.registerRenderer = (tester, renderer) => ({
    type: exports.ADD_RENDERER,
    tester,
    renderer
});
exports.unregisterRenderer = (tester, renderer) => ({
    type: exports.REMOVE_RENDERER,
    tester,
    renderer
});
//# sourceMappingURL=actions.js.map