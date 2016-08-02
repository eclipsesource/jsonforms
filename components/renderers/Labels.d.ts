import { ILabelObject, IWithLabel } from "../../uischema";
export declare class LabelObjectUtil {
    static shouldShowLabel(label: IWithLabel): boolean;
    static getElementLabelObject(labelProperty: IWithLabel, schemaPath: string): ILabelObject;
}
