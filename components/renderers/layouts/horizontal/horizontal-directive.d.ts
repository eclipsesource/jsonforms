import { AbstractLayout } from '../abstract-layout';
export interface HorizontalControllerScope extends ng.IScope {
}
export declare class HorizontalController extends AbstractLayout {
    static $inject: string[];
    constructor(scope: HorizontalControllerScope);
    private updateChildrenLabel(elements);
}
declare var _default: string;
export default _default;
