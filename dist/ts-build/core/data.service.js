"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_util_1 = require("../path.util");
/**
 * The data service that holds the data of a form and maintains
 * a list of listeners that are notified whenever the data changes.
 */
var DataService = (function () {
    /**
     * Constructor
     * .
     * @param data the data object to be wrapped by the service
     */
    function DataService(data) {
        this.data = data;
        this.dataChangeListeners = [];
    }
    /**
     * Notifies any data change listeners about a data change.
     *
     * @param {ControlElement} controlElement the affected control element
     * @param newValue the new value of the data chunk
     */
    DataService.prototype.notifyAboutDataChange = function (controlElement, newValue) {
        if (controlElement !== undefined && controlElement !== null) {
            var pair = path_util_1.getValuePropertyPair(this.data, controlElement.scope.$ref);
            pair.instance[pair.property] = newValue;
        }
        this.notifyDataChangeListeners(controlElement, newValue);
    };
    /**
     * Register the given data change listener.
     * @param {DataChangeListener} listener the listener to be registered
     */
    DataService.prototype.registerDataChangeListener = function (listener) {
        this.dataChangeListeners.push(listener);
    };
    /**
     * De-register the given data change listener.
     * @param {DataChangeListener} listener the data change listener to be un-registered
     */
    DataService.prototype.deregisterDataChangeListener = function (listener) {
        this.dataChangeListeners.splice(this.dataChangeListeners.indexOf(listener), 1);
    };
    /**
     * Resolve the ref of the given control against the root data.
     *
     * @param {ControlElement} controlElement
     * @return {any} the de-referenced data chunk
     */
    DataService.prototype.getValue = function (controlElement) {
        var pair = path_util_1.getValuePropertyPair(this.data, controlElement.scope.$ref);
        if (pair.property === undefined) {
            return pair.instance;
        }
        return pair.instance[pair.property];
    };
    /**
     * Notifies all data change listeners initially.
     */
    DataService.prototype.initDataChangeListeners = function () {
        this.notifyDataChangeListeners(null, null);
    };
    DataService.prototype.notifyDataChangeListeners = function (controlElement, newValue) {
        var _this = this;
        this.dataChangeListeners.forEach(function (listener) {
            if (listener.needsNotificationAbout(controlElement)) {
                listener.dataChanged(controlElement, newValue, _this.data);
            }
        });
    };
    return DataService;
}());
exports.DataService = DataService;
//# sourceMappingURL=data.service.js.map