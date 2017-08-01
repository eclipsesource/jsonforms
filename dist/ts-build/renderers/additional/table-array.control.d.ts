import { DataChangeListener } from '../../core/data.service';
import { Renderer } from '../../core/renderer';
import { RankedTester } from '../../core/testers';
import { ControlElement } from '../../models/uischema';
/**
 * Alternative tester for an array that also checks whether the 'table'
 * option is set.
 * @type {RankedTester}
 */
export declare const tableArrayTester: RankedTester;
/**
 * Alternative array renderer that uses a HTML table.
 */
export declare class TableArrayControlRenderer extends Renderer implements DataChangeListener {
    constructor();
    /**
     * @inheritDoc
     */
    needsNotificationAbout(uischema: ControlElement): boolean;
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
