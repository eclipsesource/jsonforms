angular.module('jsonforms-website')
    .controller('CustomRendererController',
        ['CustomRendererUiSchema', 'CustomRendererSchema', function(UiSchema, Schema) {
            var vm = this;
            vm.exampleRating = 2;
            vm.schema = Schema;
            vm.uischema = UiSchema;
            vm.data = {
                "name": "Send email to Adriana",
                "description": "Confirm if you have passed the subject",
                "done": true
            };
            vm.data2 = {
                "name": "Send email to XX",
                "description": "Confirm if you have passed the subject",
                "done": true
            };
        }]);
