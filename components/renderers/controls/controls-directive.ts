///<reference path="../../references.ts"/>

class ControlDirective implements ng.IDirective {
    restrict    = "E";
    replace     = true;
    transclude  = true;
    templateUrl = 'components/renderers/controls/control.html'
}

angular.module('jsonforms.renderers.controls').directive('jsonformsControl', () => new ControlDirective);