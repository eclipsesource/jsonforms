import { RankedTester } from '../../core/testers';
import { Category } from '../../models/uischema';
/**
 * Default tester for a categorization.
 * @type {RankedTester}
 */
export declare const categorizationTester: RankedTester;
export interface CategorizationState {
    selected: {
        category: Category;
    };
}
declare const _default: any;
export default _default;
