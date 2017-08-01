"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_util_1 = require("../path.util");
/**
 * The data service that holds the data of a form and maintains
 * a list of listeners that are notified whenever the data changes.
 */
class DataService {
    /**
     * Constructor
     * .
     * @param data the data object to be wrapped by the service
     */
    constructor(data) {
        this.data = data;
        this.dataChangeListeners = [];
    }
    /**
     * Notifies any data change listeners about a data change.
     *
     * @param {Scopable} controlElement the affected control element
     * @param newValue the new value of the data chunk
     */
    notifyAboutDataChange(controlElement, newValue) {
        if (controlElement !== undefined && controlElement !== null) {
            const pair = path_util_1.getValuePropertyPair(this.data, controlElement.scope.$ref);
            pair.instance[pair.property] = newValue;
        }
        this.notifyDataChangeListeners(controlElement, newValue);
    }
    /**
     * Register the given data change listener.
     * @param {DataChangeListener} listener the listener to be registered
     */
    registerDataChangeListener(listener) {
        this.dataChangeListeners.push(listener);
    }
    /**
     * De-register the given data change listener.
     * @param {DataChangeListener} listener the data change listener to be un-registered
     */
    deregisterDataChangeListener(listener) {
        this.dataChangeListeners.splice(this.dataChangeListeners.indexOf(listener), 1);
    }
    /**
     * Resolve the ref of the given control against the root data.
     *
     * @param {ControlElement} controlElement
     * @return {any} the de-referenced data chunk
     */
    getValue(controlElement) {
        const pair = path_util_1.getValuePropertyPair(this.data, controlElement.scope.$ref);
        if (pair.property === undefined) {
            return pair.instance;
        }
        return pair.instance[pair.property];
    }
    /**
     * Notifies all data change listeners initially.
     */
    initDataChangeListeners() {
        this.notifyDataChangeListeners(null, null);
    }
    notifyDataChangeListeners(controlElement, newValue) {
        this.dataChangeListeners.forEach(listener => {
            if (listener.needsNotificationAbout(controlElement)) {
                listener.dataChanged(controlElement, newValue, this.data);
            }
        });
    }
}
exports.DataService = DataService;
//# sourceMappingURL=data.service.js.map