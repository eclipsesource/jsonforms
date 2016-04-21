
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
    })
    .name;