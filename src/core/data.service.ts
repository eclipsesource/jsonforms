import {ControlElement} from '../models/uischema';
import { getValuePropertyPair } from '../path.util';

export interface DataChangeListener {
  isRelevantKey(uischema: ControlElement): boolean;
  notifyChange(uischema: ControlElement, newValue: any, data: any): void;
}
export class DataService {
  private changeListeners: Array<DataChangeListener>= [];
  constructor(private data: any) {
  }
  notifyChange(uischema: ControlElement, newValue: any): void {
    const pair = getValuePropertyPair(this.data, uischema.scope.$ref);
    pair.instance[pair.property] = newValue;

    this.changeListeners.forEach(listener => {
      if (listener.isRelevantKey(uischema)) {
        listener.notifyChange(uischema, newValue, this.data);
      }
    });
  }
  registerChangeListener(listener: DataChangeListener): void {
    this.changeListeners.push(listener);
  }
  unregisterChangeListener(listener: DataChangeListener): void {
    this.changeListeners.splice(this.changeListeners.indexOf(listener), 1);
  }
  getValue(uischema: ControlElement): any {
    const pair = getValuePropertyPair(this.data, uischema.scope.$ref);
    if (pair.property === undefined) {
      return pair.instance;
    }
    return pair.instance[pair.property];
  }
  initialRootRun(): void {
    this.changeListeners.forEach(listener => {
      if (listener.isRelevantKey(null)) {
        listener.notifyChange(null, null, this.data);
      }
    });
  }
}
