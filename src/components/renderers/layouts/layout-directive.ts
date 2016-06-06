
export default angular
    .module('jsonforms.renderers.layouts', ['jsonforms.renderers'])
    .directive('jsonformsLayout', (): ng.IDirective => {
        return {
            restrict: 'E',
            transclude: true,
            templateUrl: 'layout.html'
        };
    })
    .run(['$templateCache', $templateCache => {
        $templateCache.put('layout.html', require('./layout.html'));
    }])
    .name;
