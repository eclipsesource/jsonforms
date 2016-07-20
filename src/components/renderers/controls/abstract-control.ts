import {PathUtil} from '../../services/pathutil';
import {PathResolver} from '../../services/pathresolver/jsonforms-pathresolver';
import {NOT_FITTING} from '../renderer-service';
import {Services, ServiceId, IValidationService, ISchemaProvider} from '../../services/services';
import {IRuleService, IRuleServiceCallBack} from '../../services/rule/rule-service';
import {IDataProvider} from '../../services/data/data-service';
import {IRule, IControlObject, IWithLabel, ILabelObject, IUISchemaElement} from '../../../uischema';
import {SchemaElement} from '../../../jsonschema';

export class AbstractControl implements IRuleServiceCallBack {

    public instance: any;
    public rule: IRule;
    public hide: boolean;
    protected schemaPath: string;
    protected resolvedData: any;
    protected fragment: string;
    protected uiSchema: IControlObject;
    protected schema: SchemaElement;
    protected data: any;
    private services: Services;
    private alerts = [];

    constructor(protected scope: ng.IScope) {
        this.services = scope['services'];
        this.uiSchema = scope['uischema'];
        this.schema = this.services.get<ISchemaProvider>(ServiceId.SchemaProvider).getSchema();
        this.data = this.services.get<IDataProvider>(ServiceId.DataProvider).getData();
        let indexedSchemaPath = this.uiSchema['scope']['$ref'];
        this.schemaPath = PathUtil.filterIndexes(indexedSchemaPath);
        this.fragment = PathResolver.lastFragment(this.uiSchema.scope.$ref);
        this.resolvedData = PathResolver.resolveToLastModel(this.data, this.uiSchema.scope.$ref);

        this.scope.$on('jsonforms:change', () => {
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

    protected triggerChangeEvent() {
        this.scope.$root.$broadcast('jsonforms:change');
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
        let subSchema: any = PathResolver.resolveSchema(this.schema, path + '/required');
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

export function schemaTypeIs(expected: string) {
    return (uiSchema: IUISchemaElement, schema: SchemaElement, data: any): boolean => {
        let schemaPath =  uiSchema['scope'] === undefined ? undefined : uiSchema['scope']['$ref'];
        if (schemaPath === undefined) {
            return false;
        }
        let currentDataSchema: SchemaElement = PathResolver.resolveSchema(schema, schemaPath);
        if (currentDataSchema === undefined) {
            return false;
        }
        return currentDataSchema.type === expected;
    };
}

export function uiTypeIs(expected: string) {
    return (uiSchema: IUISchemaElement, schema: SchemaElement, data: any): boolean => {
        return uiSchema.type === expected;
    };
}


export function optionIs(optionName: string, expected: any) {
    return (uiSchema: IUISchemaElement, schema: SchemaElement, data: any): boolean => {
        let options = uiSchema['options'];
        if (options === undefined) {
            return false;
        }
        return options[optionName] === expected;
    };
}

export function schemaTypeMatches(check: (SchemaElement) => boolean) {
    return (uiSchema: IUISchemaElement, schema: SchemaElement, data: any): boolean => {
        let schemaPath =  uiSchema['scope'] === undefined ? undefined : uiSchema['scope']['$ref'];
        // TODO ugly
        let currentDataSchema: SchemaElement = PathResolver.resolveSchema(schema, schemaPath);
        return check(currentDataSchema);
    };
}


export function schemaPathEndsWith(expected: string) {
    return (uiSchema: IUISchemaElement, schema: SchemaElement, data: any): boolean => {
        if (expected === undefined || uiSchema['scope'] === undefined) {
            return false;
        }
        return _.endsWith(uiSchema['scope']['$ref'], expected);
    };
}

export function schemaPropertyName(expected: string) {
    return (uiSchema: IUISchemaElement, schema: SchemaElement, data: any): boolean => {
        if (expected === undefined || uiSchema['scope'] === undefined) {
            return false;
        }
        let schemaPath = uiSchema['scope']['$ref'];
        return _.last(schemaPath.split("/")) === expected;
    };
}

export function always(uiSchema: IUISchemaElement, schema: SchemaElement, data: any): boolean {
    return true;
}

export class RendererTesterBuilder {

    and(...testers:
            Array<(uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => boolean>)  {
        return (uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => 
            testers.reduce((acc, tester) => acc && tester(uiSchema, schema, data), true);
        
    }


    create(test: (uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => boolean,
           spec: number): (uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => number {
        return (uiSchema: IUISchemaElement, schema: SchemaElement, data: any): number => {
            if (test(uiSchema, schema, data)) {
                return spec;
            }
            return NOT_FITTING;
        };
    }

}

export const Testers = new RendererTesterBuilder();

export default angular.module('jsonforms.control.base', ['jsonforms.renderers.controls'])
    .controller('BaseController', AbstractControl)
    .service('JSONFormsTesters', function() {
        return {
            schemaPathEndsWith: schemaPathEndsWith,
            schemaPropertyName: schemaPropertyName,
            schemaTypeMatches:  schemaTypeMatches,
            uiTypeIs: uiTypeIs,
            schemaTypeIs: schemaTypeIs,
            optionIs: optionIs,
            and: Testers.and
        };
    })
    .name;
