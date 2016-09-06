import {PathUtil} from '../../services/pathutil';
import {PathResolver} from '../../services/path-resolver/path-resolver';
import {Services, ServiceId, IValidationService, ISchemaProvider} from '../../services/services';
import {IRuleService, IRuleServiceCallBack} from '../../services/rule/rule-service';
import {IDataProvider} from '../../services/data/data-providers';
import {IRule, IControlObject} from '../../../uischema';
import {SchemaElement} from '../../../jsonschema';
import {LabelObjectUtil} from '../Labels';

export class AbstractControl implements IRuleServiceCallBack {

    public instance: any;
    public rule: IRule;
    public hide: boolean;
    protected schemaPath: string;
    protected resolvedData: any;
    protected resolvedSchema: SchemaElement;
    protected fragment: string;
    protected uiSchema: IControlObject;
    protected schema: SchemaElement;
    protected data: any;
    private services: Services;
    private alerts = [];
    private showLabel: boolean;
    protected label: string;

    constructor(protected scope: ng.IScope) {
        this.services = scope['services'];
        this.uiSchema = scope['uischema'];
        this.schema = this.services.get<ISchemaProvider>(ServiceId.SchemaProvider).getSchema();
        this.data = this.services.get<IDataProvider>(ServiceId.DataProvider).getData();
        let indexedSchemaPath = this.uiSchema['scope']['$ref'];
        this.schemaPath = PathUtil.filterIndexes(indexedSchemaPath);
        this.fragment = PathResolver.lastFragment(this.uiSchema.scope.$ref);
        this.resolvedData = PathResolver.resolveToLastModel(this.data, this.uiSchema.scope.$ref);
        this.resolvedSchema = PathResolver.resolveSchema(this.schema, this.schemaPath);
        this.showLabel = LabelObjectUtil.shouldShowLabel(this.uiSchema);
        this.label = AbstractControl.createLabel(this.uiSchema, this.schemaPath, AbstractControl.isRequired(this.schema, this.schemaPath));

        this.scope.$on('jsonforms:change', () => {
            // TODO: remote references to services
            // instead try to iterate over all services and call some sort of notifier
            if (this.validate) {
                this.validate();
            }
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

    private static createLabel(uischema: IControlObject, schemaPath: string, isRequiredProperty: boolean): string {
        let labelObject = LabelObjectUtil.getElementLabelObject(uischema, schemaPath);
        let stringBuilder = labelObject.text;

        if (isRequiredProperty) {
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

    private static isRequired(schema: SchemaElement, schemaPath: string): boolean {
        let path = PathUtil.init(schemaPath);
        let lastFragment = PathUtil.lastFragment(path);

        // if last fragment points to properties, we need to move one level higher
        if (lastFragment === 'properties') {
            path = PathUtil.init(path);
        }

        // FIXME: we want resolveSchema to actually return an array here
        let subSchema: any = PathResolver.resolveSchema(schema, path + '/required');
        if (subSchema !== undefined) {
            if (subSchema.indexOf(PathUtil.lastFragment(schemaPath)) !== -1) {
                return true;
            }
        }

        return false;
    }
}

export default angular.module('jsonforms.control.base', ['jsonforms.renderers.controls'])
    .factory('BaseController', () => AbstractControl)
    .name;
