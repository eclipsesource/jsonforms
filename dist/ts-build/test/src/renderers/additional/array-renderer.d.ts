import { DataChangeListener } from '../../core/data.service';
import { Renderer } from '../../core/renderer';
import { RankedTester } from '../../core/testers';
import { ControlElement } from '../../models/uischema';
/**
 * Default tester for an array control.
 * @type {RankedTester}
 */
export declare const arrayTester: RankedTester;
/**
 * Default renderer for an array.
 */
export declare class ArrayControlRenderer extends Renderer implements DataChangeListener {
    constructor();
    /**
     * @inheritDoc
     */
    needsNotificationAbout(controlElement: ControlElement): boolean;
    /**
     * @inheritDoc
     */
    dataChanged(uischema: ControlElement, newValue: any, data: any): void;
    /**
     * @inheritDoc
     */
    connectedCallback(): void;
    /**
     * @inheritDoc
     */
    disconnectedCallback(): void;
    /**
     * @inheritDoc
     */
    dispose(): void;
    /**
     * @inheritDoc
     */
    render(): HTMLElement;
}
