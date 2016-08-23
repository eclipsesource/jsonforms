const enumTemplate = `<jsonforms-control>
      <md-select aria-label="{{vm.label}}"
                 ng-change='vm.triggerChangeEvent()'
                 ng-model="vm.resolvedData[vm.fragment]"
                 ng-readonly="vm.uiSchema.readOnly">
        <md-option ng-repeat="option in vm.options" ng-value="option">
          {{option}}
        </md-option>           
      </md-select>
</jsonforms-control>`;

export default angular
    .module('jsonforms-material.renderers.controls.enum', [])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('enum.html', enumTemplate);
    }])
    .name;

