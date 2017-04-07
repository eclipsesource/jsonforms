import { ControlElement } from '../models/uischema';
export interface DataChangeListener {
    isRelevantKey(uischema: ControlElement): boolean;
    notifyChange(uischema: ControlElement, newValue: any, data: any): void;
}
export declare class DataService {
    private data;
    private changeListeners;
    constructor(data: any);
    notifyChange(uischema: ControlElement, newValue: any): void;
    registerChangeListener(listener: DataChangeListener): void;
    unregisterChangeListener(listener: DataChangeListener): void;
    getValue(uischema: ControlElement): any;
    initialRootRun(): void;
}
