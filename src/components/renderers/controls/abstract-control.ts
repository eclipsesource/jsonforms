import {PathUtil} from '../../services/pathutil';
import {IPathResolver} from '../../services/pathresolver/jsonforms-pathresolver';
import {RendererTester, NOT_FITTING} from '../renderer-service';
import {Services, ServiceId, IValidationService, ISchemaProvider} from '../../services/services';
import {IRuleService, IRuleServiceCallBack} from '../../services/rule/rule-service';
import {IDataProvider} from '../../services/data/data-service';
import {IControlObject, IRule, IWithLabel, ILabelObject, IUISchemaElement}
    from '../../../jsonforms';

export abstract class AbstractControl implements IRuleServiceCallBack {

    // IRuleServiceCallBack
    public instance: any;
    public rule: IRule;
    public hide: boolean;
    protected schemaPath: string;
    protected modelValue: any;
    protected fragment: string;
    protected uiSchema: IControlObject;
    protected schema: SchemaElement;
    protected data: any;
    private services: Services;
    private alerts = [];

    constructor(protected scope: ng.IScope, protected pathResolver: IPathResolver) {
        this.services = scope['services'];
        this.uiSchema = scope['uiSchema'];
        this.schema = this.services.get<ISchemaProvider>(ServiceId.SchemaProvider).getSchema();
        this.data = this.services.get<IDataProvider>(ServiceId.DataProvider).getData();
        let indexedSchemaPath = this.uiSchema['scope']['$ref'];
        this.schemaPath = PathUtil.filterIndexes(indexedSchemaPath);
        this.fragment = pathResolver.lastFragment(this.uiSchema.scope.$ref);
        this.modelValue = pathResolver.resolveToLastModel(this.data, this.uiSchema.scope.$ref);

        this.scope.$on('modelChanged', () => {
            // TODO: remote references to services
            // instead try to iterate over all services and call some sort of notifier
            this.validate();
            this.services.get<IRuleService>(ServiceId.RuleService).reevaluateRules(this.schemaPath);
        });

        // IRuleServiceCallBack
        this.instance = this.data;
        this.rule = this.uiSchema.rule;
        this.services.get<IRuleService>(ServiceId.RuleService).addRuleTrack(this);
    }

    protected get id() {
        return this.schemaPath;
    }

    protected get showLabel() {
        return LabelObjectUtil.shouldShowLabel(this.uiSchema.label);
    }

    protected get label() {
        let labelObject = LabelObjectUtil.getElementLabelObject(this.uiSchema.label,
            this.schemaPath);
        let stringBuilder = labelObject.text;

        if (this.isRequired(this.schemaPath)) {
            stringBuilder += '*';
        }

        return stringBuilder;
    }

    protected modelChanged() {
        this.scope.$root.$broadcast('modelChanged');
        // this.scope.$emit('modelChanged');
    }

    private validate() {
        let validationService = this.services.get<IValidationService>(ServiceId.Validation);
        validationService.validate(this.data, this.schema);
        let result = validationService.getResult(this.data,
            '/' + PathUtil.normalize(this.schemaPath));
        this.alerts = [];
        if (result !== undefined) {
            let alert = {
                type: 'danger',
                msg: result
            };
            this.alerts.push(alert);
        }
    }

    private isRequired(schemaPath: string): boolean {
        let path = PathUtil.init(schemaPath);
        let lastFragment = PathUtil.lastFragment(path);

        // if last fragment points to properties, we need to move one level higher
        if (lastFragment === 'properties') {
            path = PathUtil.init(path);
        }

        // FIXME: we want resolveSchema to actually return an array here
        let subSchema: any = this.pathResolver.resolveSchema(this.schema, path + '/required');
        if (subSchema !== undefined) {
            if (subSchema.indexOf(PathUtil.lastFragment(schemaPath)) !== -1) {
                return true;
            }
        }

        return false;
    }
}
// TODO extract to util
export class LabelObjectUtil {

    public static shouldShowLabel(label: IWithLabel): boolean {
        if (label === undefined ) {
            return true;
        } else if (typeof label === 'boolean') {
            return <boolean> label;
        } else if (typeof label === 'string') {
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

export const ControlRendererTester = function(type: string, specificity: number): RendererTester {
    return function (element: IUISchemaElement,
                     dataSchema: any, dataObject: any, pathResolver: IPathResolver ) {

        if (element.type !== 'Control') {
            return NOT_FITTING;
        }
        let currentDataSchema = pathResolver.resolveSchema(dataSchema, element['scope']['$ref']);
        if (currentDataSchema === undefined || currentDataSchema.type !== type) {
            return NOT_FITTING;
        }
        return specificity;
    };
};
