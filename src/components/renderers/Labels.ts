
import {PathUtil} from '../services/pathutil';
import {ILabelObject, IWithLabel} from '../../uischema';

export class Labels {

    public shouldShowLabel(withLabel: IWithLabel): boolean {
        let label = withLabel.label;
        if (label === undefined ) {
            return true;
        } else if (_.isBoolean(label)) {
            return <boolean> label;
        } else if (_.isString(label)) {
            return (<string> label) !== '';
        } else {
            let labelObj = <ILabelObject> label;
            return _.has(labelObj, 'show') ? labelObj.show : true;
        }
    }

    public getElementLabelObject(withLabel: IWithLabel,
                                        schemaPath: string): ILabelObject {
        let labelProperty = withLabel.label;
        if (_.isBoolean(labelProperty)) {
            if (labelProperty) {
                return new LabelObject(
                    PathUtil.beautifiedLastFragment(schemaPath),
                    <boolean>labelProperty);
            } else {
                return new LabelObject(undefined, <boolean>labelProperty);
            }
        } else if (_.isString(labelProperty)) {
            return new LabelObject(<string>labelProperty, true);
        } else if (_.isObject(labelProperty)) {
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
export const LabelObjectUtil = new Labels();

class LabelObject implements ILabelObject {
    public text: string;
    public show: boolean;

    constructor(text: string, show: boolean) {
        this.text = text;
        this.show = show;
    }
}
