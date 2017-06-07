import {ControlElement} from '../models/uischema';
import { getValuePropertyPair } from '../path.util';

/**
 * A listener that is notified whenever the underlying data changes.
 */
export interface DataChangeListener {

  /**
   * Determines whether this listener is interested in any data change.
   * If this returns true, the notifyChange method of the listener will be called.
   * @param {ControlElement} uischema the control element that is affected by the data change
   * @returns whether this listener is interested in the given control element
   */
  isRelevantKey(uischema: ControlElement): boolean;

  /**
   * Represents the listener's logic to be called in case of a data change that
   * is relevant to the listener.
   *
   * @param {ControlElement} uischema the control element that is affected by the data change
   * @param {any} newValue the changed data value
   * @param {any} data the current data value
   */
  notifyChange(uischema: ControlElement, newValue: any, data: any): void;
}

/**
 * The data service that holds the data of a form and maintains
 * a list of listeners that are notified whenever the data changes.
 */
export class DataService {
  private changeListeners: Array<DataChangeListener>= [];

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
   * @param {ControlElement} uischema the affected control element
   * @param newValue the new value of the data chunk
   */
  notifyChange(uischema: ControlElement, newValue: any): void {
    if (uischema !== undefined && uischema !== null) {
      const pair = getValuePropertyPair(this.data, uischema.scope.$ref);
      pair.instance[pair.property] = newValue;
    }

    this.changeListeners.forEach(listener => {
      if (listener.isRelevantKey(uischema)) {
        listener.notifyChange(uischema, newValue, this.data);
      }
    });
  }

  /**
   * Register the given data change listener.
   * @param {DataChangeListener} listener the listener to be registered
   */
  registerChangeListener(listener: DataChangeListener): void {
    this.changeListeners.push(listener);
  }

  /**
   * Un-register the given data change listener.
   * @param {DataChangeListener} listener the data change listener to be un-registered
   */
  unregisterChangeListener(listener: DataChangeListener): void {
    this.changeListeners.splice(this.changeListeners.indexOf(listener), 1);
  }

  /**
   * Resolve the ref of the given control against the root data.
   *
   * @param {ControlElement} uischema
   * @return {any} the de-referenced data chunk
   */
  getValue(uischema: ControlElement): any {
    const pair = getValuePropertyPair(this.data, uischema.scope.$ref);
    if (pair.property === undefined) {
      return pair.instance;
    }
    return pair.instance[pair.property];
  }

  /**
   * Notifies all data change listeners initially.
   */
  initialRootRun(): void {
    this.changeListeners.forEach(listener => {
      if (listener.isRelevantKey(null)) {
        listener.notifyChange(null, null, this.data);
      }
    });
  }
}
