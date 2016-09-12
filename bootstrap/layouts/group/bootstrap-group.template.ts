const groupTemplate = `<jsonforms-layout>
    <div class="jsf-group">
        
          <fieldset>
              <legend ng-if="vm.label">{{vm.label}}</legend>
              <jsonforms-inner ng-repeat="child in vm.uiSchema.elements"
                             uischema="child"
                             class="col-sm-100">
              </jsonforms-inner>
          </fieldset>      
        
    </div>
</jsonforms-layout>`;

export default angular
    .module('jsonforms-bootstrap.renderers.layouts.group',
        ['jsonforms.renderers.layouts', 'jsonforms-bootstrap'])
    .run(['$templateCache', $templateCache => {
        $templateCache.put('group.html', groupTemplate);
    }])
    .name;
