import 'lodash';
import {RendererTester, NOT_FITTING} from '../../renderer-service';
import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {PathUtil} from '../../../services/pathutil';
import {IUISchemaGenerator} from '../../../generators/generators';
import {AbstractControl, ControlRendererTester} from '../abstract-control';
import {IUISchemaElement, IGroup} from '../../../../uischema';
import {SchemaArray} from '../../../../jsonschema';

class ArrayReadOnlyDirective implements ng.IDirective {
    restrict = 'E';
    template = `
    <jsonforms-layout class="jsf-group">
      <fieldset>
        <legend>{{vm.label}}</legend>
        <div ng-repeat='data in vm.modelValue[vm.fragment]'>
            <div ng-repeat='prop in vm.properties'>
            <strong>{{prop | capitalize}}:</strong> {{data[prop]}}
            </div>
            <hr ng-show="!$last">
        </div>
       </fieldset>
     </jsonforms-layout>`;
    controller = ArrayController;
    controllerAs = 'vm';
}

class ArrayDirective implements ng.IDirective {
    restrict = 'E';
    template = `
    <jsonforms-layout class="jsf-group">
        <fieldset ng-disabled="vm.uiSchema.readOnly">
            <legend>{{vm.label}}</legend>
            <div ng-repeat="d in vm.modelValue[vm.fragment]">
                <jsonforms schema="vm.arraySchema" data="d" uischema="vm.arrayUiSchema"></jsonforms>
            </div>
            <fieldset>
                <legend>Add New Entry</legend>
                <jsonforms schema="vm.arraySchema" data="vm.submitElement"></jsonforms>
                <input class="btn btn-primary"
                      ng-show="vm.supportsSubmit"
                      type="button"
                      value="Add to {{vm.buttonText}}"
                      ng-click="vm.submitCallback()"
                      ng-model="vm.submitElement">
                </input>
            </fieldset>
        </fieldset>
    </jsonforms-layout>`;
    controller = ArrayController;
    controllerAs = 'vm';
}

interface ArrayControllerScope extends ng.IScope {
}

class ArrayController extends AbstractControl {
    static $inject = ['$scope', 'PathResolver', 'UISchemaGenerator'];
    private properties: string[];
    private submitElement = {};
    private arraySchema: any;
    private arrayUiSchema: IGroup;
    constructor(scope: ArrayControllerScope,
        pathResolver: IPathResolver, uiGenerator: IUISchemaGenerator) {
        super(scope, pathResolver);
        let resolvedSubSchema = this.pathResolver.resolveSchema(
            this.schema, this.schemaPath) as SchemaArray;
        let items = resolvedSubSchema.items;
        this.arraySchema = items;
        this.properties = _.keys(items['properties']);
        this.arrayUiSchema = uiGenerator.generateDefaultUISchema(items, 'Group');
    }

    public get buttonText(){
        return PathUtil.beautifiedLastFragment(this.schemaPath);
    }
    public submitCallback() {
        if (this.modelValue[this.fragment] === undefined) {
            this.modelValue[this.fragment] = [];
        }
        this.modelValue[this.fragment].push(_.clone(this.submitElement));
        this.submitElement = {};
    }
    public get supportsSubmit(){
        let options = this.uiSchema['options'];
        return !(options !== undefined && options['submit'] === false);
    }

}
let ArrayReadOnlyControlRendererTester: RendererTester = function (element: IUISchemaElement,
                                                                   dataSchema: any,
                                                                   dataObject: any,
                                                                   pathResolver: IPathResolver ){
    let specificity = ControlRendererTester('array', 1)(element,
        dataSchema, dataObject, pathResolver);

    if (specificity === NOT_FITTING) {
        return NOT_FITTING;
    }
    if (element['options'] !== undefined && element['options']['simple']) {
        return 1;
    }
    return NOT_FITTING;
};
let ArrayControlRendererTester: RendererTester = ControlRendererTester('array', 1);

export default angular
    .module('jsonforms.renderers.controls.array', ['jsonforms.renderers.controls'])
    .directive('arrayReadonlyControl', () => new ArrayReadOnlyDirective())
    .directive('arrayControl', () => new ArrayDirective())
    .run(['RendererService', RendererService => {
            RendererService.register('array-readonly-control', ArrayReadOnlyControlRendererTester);
            RendererService.register('array-control', ArrayControlRendererTester);
        }
    ])
    .name;
