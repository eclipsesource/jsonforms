
declare var require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};


export default angular
    .module('jsonforms.renderers.layouts', ['jsonforms.renderers'])
    .directive('jsonformsLayout', ():ng.IDirective => {
        //require('../../../node_modules/bootstrap/less/bootstrap.less');
        return {
            restrict: "E",
            replace: true,
            transclude: true,
            template: require('./layout.html')
        }
    }).name;