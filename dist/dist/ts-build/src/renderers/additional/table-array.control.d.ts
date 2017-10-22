import { Renderer } from '../../core/renderer';
import { RankedTester } from '../../core/testers';
import { ControlProps } from '../controls/Control';
/**
 * Alternative tester for an array that also checks whether the 'table'
 * option is set.
 * @type {RankedTester}
 */
export declare const tableArrayTester: RankedTester;
export declare class TableArrayControl extends Renderer<ControlProps, void> {
    addNewItem(path: string): void;
    /**
     * @inheritDoc
     */
    render(): any;
}
declare const _default: any;
export default _default;
