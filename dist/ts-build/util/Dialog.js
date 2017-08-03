"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var snabbdomJsx = require("snabbdom-jsx");
var JSX = { createElement: snabbdomJsx.html };
var DefaultDialogHandlerFactory = (function () {
    function DefaultDialogHandlerFactory() {
    }
    DefaultDialogHandlerFactory.prototype.create = function () {
        return new DefaultDialogHandler();
    };
    return DefaultDialogHandlerFactory;
}());
var VNodeRegistry = (function () {
    function VNodeRegistry() {
    }
    VNodeRegistry.register = function (dialogHandlerFactory) {
        this.factory = dialogHandlerFactory;
    };
    VNodeRegistry.registerVnode = function (id, vnode) {
        this.nodeRegistry.set(id, vnode);
    };
    VNodeRegistry.prepare = function () {
        return this.factory;
    };
    VNodeRegistry.get = function (id) {
        return this.nodeRegistry.get(id);
    };
    VNodeRegistry.nodeRegistry = new Map();
    VNodeRegistry.factory = new DefaultDialogHandlerFactory();
    return VNodeRegistry;
}());
exports.VNodeRegistry = VNodeRegistry;
var DefaultDialogHandler = (function () {
    function DefaultDialogHandler() {
    }
    DefaultDialogHandler.prototype.open = function () {
        var dialog = document.getElementById(this.title + "-dialog");
        dialog.showModal();
    };
    DefaultDialogHandler.prototype.close = function () {
        var dialog = document.getElementById(this.title + "-dialog");
        dialog.close();
    };
    DefaultDialogHandler.prototype.create = function (title, description, content) {
        this.title = title;
        return (JSX.createElement("dialog", { id: title + "-dialog" },
            JSX.createElement("title", null, title),
            JSX.createElement("p", null, description),
            JSX.createElement("div", null, content)));
    };
    return DefaultDialogHandler;
}());
//# sourceMappingURL=Dialog.js.map