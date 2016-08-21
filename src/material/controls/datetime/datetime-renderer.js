"use strict";
var datetimeTemplate = "<jsonforms-material-control>\n  <md-datepicker md-placeholder=\"{{element.label}}\"\n                 ng-model=\"vm.resolvedData[vm.fragment]\"\n                 ng-change='vm.triggerChangeEvent()'\n                 ng-disabled=\"vm.uiSchema.readOnly\"> \n  </md-datepicker>        \n</jsonforms-material-control >";
exports.__esModule = true;
exports["default"] = angular
    .module('jsonforms-material.renderers.controls.datetime', [])
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('datetime.html', datetimeTemplate);
    }])
    .name;
//# sourceMappingURL=datetime-renderer.js.map