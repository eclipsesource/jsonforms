import {IPathResolver} from '../../../services/pathresolver/jsonforms-pathresolver';
import {AbstractControl, ControlRendererTester} from '../abstract-control';

class BooleanDirective implements ng.IDirective {
    restrict = 'E';
    templateUrl = 'boolean.html';
    controller = BooleanController;
    controllerAs = 'vm';
}
interface BooleanControllerScope extends ng.IScope {
}

class BooleanController extends AbstractControl {
    static $inject = ['$scope', 'PathResolver'];
    constructor(scope: BooleanControllerScope, pathResolver: IPathResolver) {
        super(scope, pathResolver);
    }
}

export default angular
    .module('jsonforms.renderers.controls.boolean', ['jsonforms.renderers.controls'])
    .directive('booleanControl', () => new BooleanDirective())
    .run(['RendererService', RendererService =>
        RendererService.register('boolean-control', ControlRendererTester('boolean', 1))
    ])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('boolean.html', require('./boolean.html'));
    }])
    .name;
