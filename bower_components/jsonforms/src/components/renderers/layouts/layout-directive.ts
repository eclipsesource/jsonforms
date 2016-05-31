
export default angular
    .module('jsonforms.renderers.layouts', ['jsonforms.renderers'])
    .directive('jsonformsLayout', (): ng.IDirective => {
        return {
            restrict: 'E',
            transclude: true,
            template: require('./layout.html')
        };
    })
    .name;
