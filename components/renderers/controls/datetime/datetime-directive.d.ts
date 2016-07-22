import { AbstractControl } from '../abstract-control';
export interface DateTimeControllerScope extends ng.IScope {
}
export declare class DateTimeController extends AbstractControl {
    static $inject: string[];
    protected dt: Date;
    constructor(scope: DateTimeControllerScope);
    protected triggerChangeEvent(): void;
    protected updateDateObject(): void;
}
declare var _default: string;
export default _default;
