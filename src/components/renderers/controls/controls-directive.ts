
import './control.css';

class ControlDirective implements ng.IDirective {
    restrict    = 'E';
    transclude  = true;
    templateUrl = 'control.html';
}

export default angular
    .module('jsonforms.renderers.controls', ['jsonforms.renderers'])
    .directive('jsonformsControl', () => new ControlDirective)
    .run(['$templateCache', $templateCache => {
        $templateCache.put('control.html', require('./control.html'));
    }])
    .name;
