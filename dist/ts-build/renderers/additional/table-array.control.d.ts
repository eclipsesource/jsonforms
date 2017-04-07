import { ControlElement } from '../../models/uischema';
import { Renderer } from '../../core/renderer';
import { DataChangeListener } from '../../core/data.service';
export declare class TableArrayControlRenderer extends Renderer implements DataChangeListener {
    constructor();
    isRelevantKey(uischema: ControlElement): boolean;
    notifyChange(uischema: ControlElement, newValue: any, data: any): void;
    connectedCallback(): void;
    disconnectedCallback(): void;
    dispose(): void;
    render(): HTMLElement;
}
