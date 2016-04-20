
import './control.css'

class ControlDirective implements ng.IDirective {
    restrict    = "E";
    replace     = true;
    transclude  = true;
    template = require('./control.html');
}

export default angular
    .module('jsonforms.renderers.controls', ['jsonforms.renderers'])
    .directive('jsonformsControl', () => new ControlDirective)
    .name;