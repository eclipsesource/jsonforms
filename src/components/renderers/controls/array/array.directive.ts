import 'lodash';
import {PathUtil} from '../../../services/pathutil';
import {IUISchemaGenerator} from '../../../generators/generators';
import {AbstractControl} from '../abstract-control';
import {IGroup} from '../../../../uischema';
import {SchemaArray} from '../../../../jsonschema';
import {PathResolver} from '../../../services/path-resolver/path-resolver';
import {Testers, schemaTypeIs, optionIs} from '../../testers';
let pluralize = require('pluralize');

const readOnlyArrayTemplate = `
    <jsonforms-layout>
      <fieldset>
        <legend>{{vm.label}}</legend>
        <div class="jsf-control-array-container">
            <div ng-repeat='data in vm.resolvedData[vm.fragment]' class="jsf-control-array-element">
                <div ng-repeat='prop in vm.properties'>
                <strong>{{prop | capitalize}}:</strong> {{data[prop]}}
                </div>
                <hr ng-show="!$last">
            </div>
            <div ng-if="vm.isEmpty" class="array-empty">{{vm.emptyMsg}}</div>
        </div>
       </fieldset>
     </jsonforms-layout>`;

class ArrayReadOnlyDirective implements ng.IDirective {
    restrict = 'E';
    templateUrl = 'read-only-array.html';
    controller = ArrayController;
    controllerAs = 'vm';
}

const arrayTemplate = `
    <jsonforms-layout>
        <fieldset ng-disabled="vm.uiSchema.readOnly">
          <legend>{{vm.label}}</legend>
            <div ng-repeat="d in vm.resolvedData" 
                 ng-if="vm.fragment === undefined"
                 class="jsf-control-array-container">
                <div class="jsf-control-array-element">
                    <jsonforms schema="vm.arraySchema" 
                               data="d"
                               uischema="vm.arrayUiSchema">
                    </jsonforms>
                </div>
                <div class="jsf-control-array-element-delete">
                    <input class="btn btn-primary"
                           ng-show="vm.supportsDelete"
                           type="button"
                           value="X"
                           ng-click="vm.deleteCallback(d)">
                    </input>
                </div>
            </div>
            <div ng-repeat="d in vm.resolvedData[vm.fragment]"
                 ng-if="vm.fragment !== undefined" 
                 class="jsf-control-array-container">
                <div class="jsf-control-array-element">
                    <jsonforms schema="vm.arraySchema" 
                               data="d" 
                               uischema="vm.arrayUiSchema">                               
                    </jsonforms>
                </div>
                <div class="jsf-control-array-element-delete">
                    <input class="btn btn-primary"
                           ng-show="vm.supportsDelete"
                           type="button"
                           value="X"
                           ng-click="vm.deleteCallback(d)">
                    </input>
                </div>
            </div>
            <div ng-if="vm.isEmpty" class="array-empty">{{vm.emptyMsg}}</div>
            <input class="btn btn-primary"
                   ng-show="vm.supportsSubmit"
                   type="button"
                   value="Add {{vm.buttonText}}"
                   ng-click="vm.submitCallback()"
                   ng-model="vm.submitElement">
            </input>
        </fieldset>
    </jsonforms-layout>`;

class ArrayDirective implements ng.IDirective {
    restrict = 'E';
    templateUrl = 'array.html';
    controller = ArrayController;
    controllerAs = 'vm';
}

interface ArrayControllerScope extends ng.IScope {
}

class ArrayController extends AbstractControl {
    static $inject = ['$scope', 'UISchemaGenerator'];
    private properties: string[];
    private submitElement = {};
    private arraySchema: any;
    private arrayUiSchema: IGroup;
    constructor(scope: ArrayControllerScope, uiGenerator: IUISchemaGenerator) {
        super(scope);
        let resolvedSubSchema = PathResolver.resolveSchema(
            this.schema, this.schemaPath) as SchemaArray;
        let items = resolvedSubSchema.items;
        this.arraySchema = items;
        this.properties = _.keys(items['properties']);
        this.arrayUiSchema = uiGenerator.generateDefaultUISchema(items, 'HorizontalLayout');
    }

    public get buttonText(){
        return pluralize(PathUtil.beautifiedLastFragment(this.schemaPath), 1);
    }
    public submitCallback() {
        if (this.resolvedData[this.fragment] === undefined) {
            this.resolvedData[this.fragment] = [];
        }
        this.resolvedData[this.fragment].push(_.clone(this.submitElement));
        this.submitElement = {};
    }
    public deleteCallback(element: any) {
        let index = this.resolvedData[this.fragment].indexOf(element);
        if (index !== -1) {
            this.resolvedData[this.fragment].splice(index, 1);
        }
    }
    public get supportsSubmit(){
        return this.supports('submit');
    }
    public get supportsDelete(){
        return this.supports('delete');
    }
    private supports(keyword: string) {
        let options = this.uiSchema['options'];
        return !(options !== undefined && options[keyword] === false);
    }

    public get isEmpty(): boolean {
        return _.isEmpty(this.resolvedData) || _.isEmpty(this.resolvedData[this.fragment]);
    }

    public get emptyMsg(): string {
      return 'No ' + PathUtil.beautifiedLastFragment(this.schemaPath) + ' yet.';
    }
}

export default angular
    .module('jsonforms.renderers.controls.array', ['jsonforms.renderers.controls'])
    .directive('arrayReadonlyControl', () => new ArrayReadOnlyDirective())
    .directive('arrayControl', () => new ArrayDirective())
    .run(['RendererService', RendererService => {
        RendererService.register('array-readonly-control',
            Testers.and(
                schemaTypeIs('array'),
                optionIs('simple', true)
            ), 1);
        RendererService.register('array-control', schemaTypeIs('array'), 1);
    }])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('read-only-array.html', readOnlyArrayTemplate);
        $templateCache.put('array.html', arrayTemplate);
    }])
    .name;
