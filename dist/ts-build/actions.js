"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./reducers/index");
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
exports.update = function (path, updater) {
    return function (dispatch, getState) {
        dispatch({
            type: exports.UPDATE_DATA,
            path: path,
            updater: updater
        });
        dispatch({
            type: exports.VALIDATE,
            data: index_1.getData(getState())
        });
    };
};
exports.validate = function () { return function (dispatch, getState) {
    dispatch({
        type: exports.VALIDATE,
        data: index_1.getData(getState())
    });
}; };
exports.registerRenderer = function (tester, renderer) { return ({
    type: exports.ADD_RENDERER,
    tester: tester,
    renderer: renderer
}); };
exports.unregisterRenderer = function (tester, renderer) { return ({
    type: exports.REMOVE_RENDERER,
    tester: tester,
    renderer: renderer
}); };
//# sourceMappingURL=actions.js.map