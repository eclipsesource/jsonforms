require('./masterdetail.css');

import {RendererTester, NOT_FITTING} from '../../renderer-service';
import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {AbstractControl} from '../../controls/abstract-control';
import {IUISchemaElement} from '../../../../jsonforms';
class MasterDetailDirective implements ng.IDirective {
    restrict = 'E';
    template = `<div class="row">
        <!-- Master -->
        <div class="col-sm-30 jsf-masterdetail">
            <jsonforms-masterdetail-collection properties="vm.subSchema.properties"
                                               instance="vm.data"
                                               select="vm.select(child,childSchema)">
            </jsonforms-masterdetail-collection>
        </div>
        <!-- Detail -->
        <div class="col-sm-70">
            <jsonforms schema="vm.selectedSchema"
                       data="vm.selectedChild"
                       ng-if="vm.selectedChild"></jsonforms>
        </div>
    </div>`;
    controller = MasterDetailController;
    controllerAs = 'vm';
}
interface MasterDetailControllerScope extends ng.IScope {
}
class MasterDetailController extends AbstractControl {
    static $inject = ['$scope', 'PathResolver'];
    private subSchema: SchemaElement;
    private selectedChild: any;
    private selectedSchema: SchemaElement;
    constructor(scope: MasterDetailControllerScope, pathResolver: IPathResolver) {
        super(scope, pathResolver);
        this.subSchema = this.pathResolver.resolveSchema(this.schema, this.schemaPath);
    }
    public select(selectedChild: any, selectedSchema: SchemaElement) {
        this.selectedChild = selectedChild;
        this.selectedSchema = selectedSchema;
    }
}
const MasterDetailControlRendererTester: RendererTester = function(element: IUISchemaElement,
                                                                   dataSchema: any,
                                                                   dataObject: any,
                                                                   pathResolver: IPathResolver) {
    if (element.type === 'MasterDetailLayout'
        && dataSchema !== undefined
        && dataSchema.type === 'object') {
        return 2;
    }
    return NOT_FITTING;
};

class MasterDetailCollectionDirective implements ng.IDirective {

    restrict = 'E';
    replace = true;
    scope = {
        properties: '=',
        instance: '=',
        select: '&'
    };
    template = `<div>
            <uib-accordion close-others="false">
                <uib-accordion-group is-open="status_attribute.open"
                                 ng-repeat="(key, value) in filter(properties)"
                                 class="{{isEmptyInstance(key)?'jsf-masterdetail-empty':''}}">
                    <uib-accordion-heading class="jsf-masterdetail-header">
                        <span class="jsf-masterdetail-property">{{key}}</span>
                        <i class="pull-right glyphicon"
                           ng-class="{
                              'glyphicon-chevron-down': status_attribute.open,
                              'glyphicon-chevron-right': !status_attribute.open
                           }"
                           ng-show="!isEmptyInstance(key)">
                        </i>
                    </uib-accordion-heading>

                    <uib-accordion close-others="false"
                               ng-show="!isEmptyInstance(key)">
                        <uib-accordion-group is-open="status_object.open"
                                         ng-repeat="child in instance[key]"
                                         class="{{!hasKeys(value.items)?'jsf-masterdetail-empty':''}}">
                            <uib-accordion-heading>
                                <span ng-click="selectElement(child,value)"
                                      ng-class="{
                                         'jsf-masterdetail-selected':selectedChild==child
                                      }">
                                      {{child.name!=undefined?child.name:child}}
                                </span>
                                <i class="pull-right glyphicon"
                                   ng-class="{
                                      'glyphicon-chevron-down': status_object.open,
                                      'glyphicon-chevron-right': !status_object.open
                                   }"
                                   ng-if="hasKeys(value.items)"></i>
                            </uib-accordion-heading>
                            <jsonforms-masterdetail-member filter='filter'
                                                           select='select'
                                                           child-schema="value.items"
                                                           child-data="child">
                            </jsonforms-masterdetail-member>
                        </uib-accordion-group>
                    </uib-accordion>
                </uib-accordion-group>
            </uib-accordion>
        </div>`;
    link = (scope) => {
        scope.filter = (properties) => {
            let result = {};
            angular.forEach(properties, (value, key) => {
                if (value.type === 'array' && value.items.type === 'object') {
                    result[key] = value;
                }
            });
            return result;
        };
        scope.selectElement = (child, value) => {
            scope.selectedChild = child;
            scope.selectedSchema = value.items;
            scope.select({child: scope.selectedChild, childSchema: scope.selectedSchema});
        };
        scope.hasKeys = (schemaToCheck) =>
            _.keys(scope.filter(schemaToCheck.properties)).length > 0;
        scope.isEmptyInstance = (key) =>
            scope.instance[key] === undefined || scope.instance[key].length === 0;
    };
}

class MasterDetailMember implements angular.IDirective {

    constructor(private $compile: ng.ICompileService) {

    }

    restrict = 'E';
    replace = true;
    scope = {
        childSchema: '=',
        childData: '=',
        select: '&',
        filter: '&'
    };
    link = (scope, element) => {
        if (Object.keys(scope.filter(scope.childSchema.properties)).length !== 0) {
            this.$compile(
                `<jsonforms-masterdetail-collection
                            select="select"
                            properties="childSchema.properties"
                            instance="childData">
                </jsonforms-masterdetail-collection>`
            )
            (scope, (cloned) => element.replaceWith(cloned));
        }
    }
}

export default angular
    .module('jsonforms.renderers.layouts.masterdetail', ['jsonforms.renderers.layouts'])
    .directive('masterDetail', () => new MasterDetailDirective())
    .run(['RendererService', RendererService =>
        RendererService.register('master-detail', MasterDetailControlRendererTester)
    ])
    .directive('jsonformsMasterdetailCollection', () => new MasterDetailCollectionDirective())
    .directive('jsonformsMasterdetailMember', ['$compile', ($compile) =>
        new MasterDetailMember($compile)]
    )
    .name;
