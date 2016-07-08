import { IPathResolver } from '../../../services/pathresolver/jsonforms-pathresolver';
import { AbstractControl } from '../abstract-control';
export interface DateTimeControllerScope extends ng.IScope {
}
export declare class DateTimeController extends AbstractControl {
    static $inject: string[];
    protected dt: Date;
    constructor(scope: DateTimeControllerScope, pathResolver: IPathResolver);
    protected modelChanged(): void;
    protected updateDateObject(): void;
}
declare var _default: string;
export default _default;
