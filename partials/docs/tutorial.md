---
layout: doc
---
RENDERER TUTORIAL
=================
*Disclaimer*: This is only a draft version of the article, it's likely things change. Nevertheless it should give readers a good starting point.

This article introduces the basic architecture of the rendering components within JSON Forms. We'll first take a look at how a single renderer works. Then, we'll describe the ```RendererService```, which acts as a registry for renderers and as the entry point for any JSON Forms based application.

Renderer
--------
JSONForms rendering is based on [Angular directives](https://docs.angularjs.org/guide/directive) to display each control to the user. 
Each directive must be registered together with a tester and priority to JSONForms.

Let's take a detailed look at the [default renderer for integer controls](https://github.com/eclipsesource/jsonforms/blob/master/src/components/renderers/controls/integer/integer-directive.ts) to get a 
grasp of what is going on.

### Renderer Directive ###

{% highlight coffee %}
class IntegerDirective implements ng.IDirective {
    template = `
    <jsonforms-control>
      <input type="number"
             step="1"
             id="{{vm.id}}"
             class="form-control jsf-control-integer"
             ng-model="vm.resolvedData[vm.fragment]"
             ng-change='vm.triggerChangeEvent()'
             ng-readonly="vm.uiSchema.readOnly"/>
    </jsonforms-control>`;
    controller = IntegerController;
    controllerAs = 'vm';
}
{% endhighlight %}

The renderer directive is just a regular [Angular directive](https://docs.angularjs.org/guide/directive). The ```IntegerController``` is a subclass of ```AbstractControl``` as described
which already provides all the functionality needed for the integer input element. If you want to leverage this functionality then the root element of the 
template needs to be ```jsonforms-control```. Within the ```jsonforms-control``` you are free to do as you wish. 
Note: Is is recommended to define new css classes for each control to allow further styling without the need of overwriting the renderer.

### Renderer Controller ###

{% highlight coffee %}
class IntegerController extends AbstractControl {
    static $inject = ['$scope', 'PathResolver'];
    constructor(scope: IntegerControllerScope, pathResolver: IPathResolver) {
        super(scope, pathResolver);
    }
}
{% endhighlight %}

It is recommended to extend ```AbstractControl``` since it already provides a lot of default functionality.
The ```AbstractControl``` needs the ```$scope``` service work with. 
This service can be simply injected.

### Renderer Tester ###

It is possible that multiple renderers are capable of rendering the same UI schema element. 
This is why each renderer needs to be registered via a tester function
which allows to solve ambiguous situations where multiple renderers can render the
current element. A tester is just a regular function, which returns a boolean.
Upon registering a Renderer, the registration process also needs to specify
a number which is used alongside with the tester function

In general, the more specific renderers get, the higher will be their priority. The interface 
looks like follows:

{% highlight coffee %}
(uiSchema: IUISchemaElement, schema: SchemaElement, data: any) => boolean
{% endhighlight %}

There already exist a couple of pre-defined testers which are described 
in a latter section of this section.

### Registration ###

Finally the directive and its renderer tester both need to be registered, which
happens via the `RendererService`.

The directive is registered like any other [Angular directive](https://docs.angularjs.org/guide/directive).

{% highlight coffee %}
angular
    .module('jsonforms.renderers.controls.integer')
    .directive('integerControl', () => new IntegerDirective())
{% endhighlight %}

The tester is registered within the [run method of the module](https://docs.angularjs.org/guide/module#module-loading-dependencies).
The last argument to the register call specifies the priority of the 
registered control, in this case 1.


{% highlight coffee %}
angular
    .module('jsonforms.renderers.controls.integer')
    .run(['RendererService', RendererService =>
               RendererService.register('integer-control',
                            Testers.and(
                                schemaTypeIs('integer'),
                                uiTypeIs('Control')
                            ), 1)
    ])
{% endhighlight %}

When your tester 'wins', a directive of your registered name (```integer-control```) will be created. 
Therefore make sure that the directive you register to Angular has the same name. 
In the example ```integerControl``` [is the same as](https://docs.angularjs.org/guide/directive#normalization) ```integer-control```.

This is all we need to know for the integer renderer. 
You can see all the snippets in action [here](https://github.com/eclipsesource/jsonforms/blob/master/src/components/renderers/controls/integer/integer-directive.ts).

Creating a custom renderer
--------------------------
Armed with this knowledge let’s now move on and implement our own custom control render in Javascript. 
We'll be using Javascript ES5 for this version of the tutorial, but there are other tutorials for ES 6 and Typescript as well (TODO: add links).

Let's start by creating a new file called `my-boolean.control.js` where
we can put in our custom control directive.

We'll first declare our directive and add the parameters that we 
expect to be injected, which we'll need to create the controller 
for the directive. Since we want to create an element we'll use 
`E`  as the value for the `restrict` property. We also will alias 
the yet to be created controller with `vm` within the template.


{% highlight js %}
angular.module('MiHexample')
.directive('myBooleanControl', function($controller, $scope) {
    return {
        restrict: 'E',
        controllerAs: 'vm',
        controller: function() { // TODO }
        template: '<div>TODO</div>'
    };
})
{% endhighlight %}

For the controller we can use the Angular `$controller` service and 
inherit from JSON Form's `BaseController`. We can do this via:

{% highlight js %}
  controller: function($controller, $scope) {
    $controller('BaseController', { scope: $scope })
  }
{% endhighlight %}

The first argument is the name of the parent controller, while the second
one provides the necessary constructor parameter.

All there's left to do is to create the template (TODO: put this into template HTML).

{% highlight js %}
  template: '<jsonforms-control>' +
        '<input type="text"' +
        ' id="{{vm.id}}"' +
        ' class="form-control"' +
        ' style="background-color: #3278b3; color: #8dd0ff"' +
        ' ng-model="vm.resolvedData[vm.fragment]"' +
        ' ng-change="vm.triggerChangeEvent()"' +
        ' ng-readonly="vm.uiSchema.readOnly"/>' +
        '</jsonforms-control>',
        controller: { /* TODO */ },
        controllerAs: 'vm'  
{% endhighlight %}

This template makes sure that our name input is rendered with a different color than the other inputs.
The `ng-model` attribute is necessary to set-up databinding with the `vm.resolvedData` 
value which holds the scoped data of the control. To set-up change-detection
we also need to bind `ng-change` to `vm.triggerChangeEvent`. Finally, if 
the control should support read-only states, we also need to set-up the 
`ng-readonly` attribute (but this is an optional step)


Now all there's left to do is to execute ```run``` in order to register our control with a custom renderer tester at the ```RenderService``` while the application is bootstrapping.
We provide the listing for reference here.

{% highlight js %}
  angular.module('MiHexample')
    .directive('myBooleanControl', function() {
        return {
            restrict: 'E',
            controller: function($controller, $scope) {
                $controller('BaseController', {scope: $scope})
            },
            controllerAs: 'vm',
            templateUrl: './renderer/my-boolean.control.html'
        };
    })
    .run(['RendererService', 'JSONFormsTesters', function(RendererService, Testers) {
        RendererService.register('my-boolean-control', Testers.and(
            Testers.uiTypeIs('Control'),
            Testers.schemaTypeIs('boolean')
        ), 10);
    }]);

{% endhighlight %}

Note how the registration of the control takes place.
We use two conditions which both need to be fulfilled in order to 
trigger our directive: `uiTypeis`, which checks whether the given 
UI schema element is a Control and `schemaTypeIs` which checks for the
respective type of the data schema. The priority we use for registering the control
is set to 10.


That's basically it. Open the ```index.html``` and you should see your custom control in action.
