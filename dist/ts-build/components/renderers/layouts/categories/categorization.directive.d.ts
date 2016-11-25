import { AbstractLayout } from '../abstract-layout';
export declare class CategorizationController extends AbstractLayout {
    static $inject: string[];
    private selectedCategory;
    constructor(scope: ng.IScope);
    changeSelectedCategory(category: any, clickScope: any): void;
}
declare var _default: string;
export default _default;
