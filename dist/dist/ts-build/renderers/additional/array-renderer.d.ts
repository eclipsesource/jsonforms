import { Renderer } from '../../core/renderer';
import { RankedTester } from '../../core/testers';
import { ControlProps } from '../controls/Control';
export declare const getStyle: (styleName: string) => string;
/**
 * Default tester for an array control.
 * @type {RankedTester}
 */
export declare const arrayTester: RankedTester;
export declare class ArrayControlRenderer extends Renderer<ControlProps, void> {
    addNewItem(path: string): void;
    /**
     * @inheritDoc
     */
    render(): any;
}
declare const _default: any;
export default _default;
