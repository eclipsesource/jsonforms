import { ILabelObject, IWithLabel } from '../../uischema';
export declare class Labels {
    shouldShowLabel(withLabel: IWithLabel): boolean;
    getElementLabelObject(withLabel: IWithLabel, schemaPath: string): ILabelObject;
}
export declare const LabelObjectUtil: Labels;
