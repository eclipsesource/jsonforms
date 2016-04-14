///<reference path="../../references.ts"/>

import './control.css'

declare var require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};


class ControlDirective implements ng.IDirective {
    restrict    = "E";
    replace     = true;
    transclude  = true;
    template = require('./control.html'); //'components/renderers/controls/control.html'
}

export default angular
    .module('jsonforms.renderers.controls', ['jsonforms.renderers'])
    .directive('jsonformsControl', () => new ControlDirective)
    .name;