///<reference path="../../references.ts"/>

class MaterialControlDirective implements ng.IDirective {
    restrict    = "E";
    replace     = true;
    transclude  = true;
    templateUrl = 'components/renderers/controls/control.html'
}

angular.module('jsonforms-material.renderers.controls').directive('jsonformsMaterialControl', () => new MaterialControlDirective);
