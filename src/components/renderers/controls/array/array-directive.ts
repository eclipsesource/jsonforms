import 'lodash';
import {RendererTester, NOT_FITTING} from '../../renderer-service';
import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {PathUtil} from '../../../services/pathutil';
import {AbstractControl, ControlRendererTester} from '../abstract-control';
import {IUISchemaElement, IGroup, IControlObject} from '../../../../jsonforms';

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
            <jsonforms schema="vm.arraySchema" data="d" ui-schema="vm.arrayUiSchema"></jsonforms>
        </div>
          <jsonforms schema="vm.arraySchema" data="vm.submitElement"></jsonforms>
       </fieldset>
       <input class="btn btn-primary"
              ng-show="vm.supportsSubmit"
              type="button" 
              value="Add to {{vm.buttonText}}"
              ng-click="vm.submitCallback()"
              ng-model="vm.submitElement">
       </input>
     </jsonforms-layout>`;
    controller = ArrayController;
    controllerAs = 'vm';
}

interface ArrayControllerScope extends ng.IScope {
}

class ArrayController extends AbstractControl {
    static $inject = ['$scope', 'PathResolver'];
    private properties: string[];
    private submitElement = {};
    private arraySchema: any;
    private arrayUiSchema: IGroup;
    constructor(scope: ArrayControllerScope, pathResolver: IPathResolver) {
        super(scope, pathResolver);
        let resolvedSubSchema = this.pathResolver.resolveSchema(
            this.schema, this.schemaPath) as SchemaArray;
        let items = resolvedSubSchema.items;
        this.arraySchema = items;
        this.properties = _.keys(items['properties']);
        this.arrayUiSchema = this.createControlGroupPerItem();
    }
    // Code should be in the ui schema generator ...
    private static createGroup(elements: IUISchemaElement[]): IGroup {
        return {
            'type': 'Group',
            'elements': elements
        };
    }
    private static createControl(schemaPath: string, prop: string): IControlObject {
        return {
            'type': 'Control',
            'label': PathUtil.beautify(prop),
            'scope': {
                '$ref': schemaPath
            }
        };
    }
    public get buttonText(){
        return PathUtil.beautifiedLastFragment(this.schemaPath);
    }
    public submitCallback() {
        if (this.modelValue[this.fragment] === undefined) {
            this.modelValue[this.fragment] = [];
        }
        this.modelValue[this.fragment].push(_.clone(this.submitElement));
    }
    public get supportsSubmit(){
        let options = this.uiSchema['options'];
        return !(options !== undefined && options['submit'] === false);
    }


    private createControlGroupPerItem(): IGroup {
        let elements = _.keys(this.arraySchema['properties']).map(key =>
            // path does not actually exists
            ArrayController.createControl(`#/properties/${key}`, key)
        );
        return ArrayController.createGroup(elements);
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
