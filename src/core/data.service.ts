import { Scopable } from '../models/uischema';
import { getValuePropertyPair } from '../path.util';

/**
 * A listener that is notified whenever the underlying data changes.
 */
export interface DataChangeListener {

  /**
   * Determines whether this listener is interested in any data change.
   * If this returns true, the dataChanged method of the listener will be called.
   * @param {Scopable} uiSchema the control element that is affected by the data change
   * @returns whether this listener is interested in the given control element
   */
  needsNotificationAbout(uiSchema: Scopable): boolean;

  /**
   * Represents the listener's logic to be called in case of a data change that
   * is relevant to the listener.
   *
   * @param {Scopable} controlElement the control element that is affected by the data change
   * @param {any} newValue the changed data value
   * @param {any} data the current data value
   */
  dataChanged(controlElement: Scopable, newValue: any, data: any): void;
}

/**
 * The data service that holds the data of a form and maintains
 * a list of listeners that are notified whenever the data changes.
 */
export class DataService {

  private dataChangeListeners: DataChangeListener[] = [];

  /**
   * Constructor
   * .
   * @param data the data object to be wrapped by the service
   */
  constructor(private data: any) {
  }

  /**
   * Notifies any data change listeners about a data change.
   *
   * @param {Scopable} controlElement the affected control element
   * @param newValue the new value of the data chunk
   */
  notifyAboutDataChange(controlElement: Scopable, newValue: any): void {
    if (controlElement !== undefined && controlElement !== null) {
      const pair = getValuePropertyPair(this.data, controlElement.scope.$ref);
      pair.instance[pair.property] = newValue;
    }
    this.notifyDataChangeListeners(controlElement, newValue);
  }

  /**
   * Register the given data change listener.
   * @param {DataChangeListener} listener the listener to be registered
   */
  registerDataChangeListener(listener: DataChangeListener): void {
    this.dataChangeListeners.push(listener);
  }

  /**
   * De-register the given data change listener.
   * @param {DataChangeListener} listener the data change listener to be un-registered
   */
  deregisterDataChangeListener(listener: DataChangeListener): void {
    this.dataChangeListeners.splice(this.dataChangeListeners.indexOf(listener), 1);
  }

  /**
   * Resolve the ref of the given control against the root data.
   *
   * @param {ControlElement} controlElement
   * @return {any} the de-referenced data chunk
   */
  getValue(controlElement: Scopable): any {
    const pair = getValuePropertyPair(this.data, controlElement.scope.$ref);
    if (pair.property === undefined) {
      return pair.instance;
    }

    return pair.instance[pair.property];
  }

  /**
   * Notifies all data change listeners initially.
   */
  initDataChangeListeners(): void {
    this.notifyDataChangeListeners(null, null);
  }

  private notifyDataChangeListeners(controlElement: Scopable, newValue: any): void {
    this.dataChangeListeners.forEach(listener => {
      if (listener.needsNotificationAbout(controlElement)) {
        listener.dataChanged(controlElement, newValue, this.data);
      }
    });
  }
}
