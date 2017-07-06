import { ControlElement } from '../models/uischema';
/**
 * A listener that is notified whenever the underlying data changes.
 */
export interface DataChangeListener {
    /**
     * Determines whether this listener is interested in any data change.
     * If this returns true, the dataChanged method of the listener will be called.
     * @param {ControlElement} uiSchema the control element that is affected by the data change
     * @returns whether this listener is interested in the given control element
     */
    needsNotificationAbout(uiSchema: ControlElement): boolean;
    /**
     * Represents the listener's logic to be called in case of a data change that
     * is relevant to the listener.
     *
     * @param {ControlElement} controlElement the control element that is affected by the data change
     * @param {any} newValue the changed data value
     * @param {any} data the current data value
     */
    dataChanged(controlElement: ControlElement, newValue: any, data: any): void;
}
/**
 * The data service that holds the data of a form and maintains
 * a list of listeners that are notified whenever the data changes.
 */
export declare class DataService {
    private data;
    private dataChangeListeners;
    /**
     * Constructor
     * .
     * @param data the data object to be wrapped by the service
     */
    constructor(data: any);
    /**
     * Notifies any data change listeners about a data change.
     *
     * @param {ControlElement} controlElement the affected control element
     * @param newValue the new value of the data chunk
     */
    notifyAboutDataChange(controlElement: ControlElement, newValue: any): void;
    /**
     * Register the given data change listener.
     * @param {DataChangeListener} listener the listener to be registered
     */
    registerDataChangeListener(listener: DataChangeListener): void;
    /**
     * De-register the given data change listener.
     * @param {DataChangeListener} listener the data change listener to be un-registered
     */
    deregisterDataChangeListener(listener: DataChangeListener): void;
    /**
     * Resolve the ref of the given control against the root data.
     *
     * @param {ControlElement} controlElement
     * @return {any} the de-referenced data chunk
     */
    getValue(controlElement: ControlElement): any;
    /**
     * Notifies all data change listeners initially.
     */
    initDataChangeListeners(): void;
    private notifyDataChangeListeners(controlElement, newValue);
}
