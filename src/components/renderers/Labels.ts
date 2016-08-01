
// TODO extract to util
import {PathUtil} from "../services/pathutil";
import {ILabelObject, IWithLabel} from "../../uischema";

export class LabelObjectUtil {

    public static shouldShowLabel(label: IWithLabel): boolean {
        if (label === undefined ) {
            return true;
        } else if (_.isBoolean(label)) {
            return <boolean> label;
        } else if (_.isString(label)) {
            return (<string> label) !== '';
        } else {
            let labelObj = <ILabelObject> label;
            return labelObj.hasOwnProperty('show') ? labelObj.show : true;
        }
    }
    
    public static getElementLabelObject(labelProperty: IWithLabel,
                                        schemaPath: string): ILabelObject {

        if (typeof labelProperty === 'boolean') {
            if (labelProperty) {
                return new LabelObject(
                    PathUtil.beautifiedLastFragment(schemaPath),
                    <boolean>labelProperty);
            } else {
                return new LabelObject(undefined, <boolean>labelProperty);
            }
        } else if (typeof labelProperty === 'string') {
            return new LabelObject(<string>labelProperty, true);
        } else if (typeof labelProperty === 'object') {
            let show = _.has(labelProperty, 'show') ?
                (<ILabelObject>labelProperty).show : true;
            let label = _.has(labelProperty, 'text') ?
                (<ILabelObject>labelProperty).text : PathUtil.beautifiedLastFragment(schemaPath);
            return new LabelObject(label, show);
        } else {
            return new LabelObject(PathUtil.beautifiedLastFragment(schemaPath), true);
        }
    }
}

class LabelObject implements ILabelObject {
    public text: string;
    public show: boolean;

    constructor(text: string, show: boolean) {
        this.text = text;
        this.show = show;
    }
}