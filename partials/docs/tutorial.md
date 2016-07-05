---
layout: doc
---
RENDERER TUTORIAL
=================
*Disclaimer*: This is only a draft version of the article, it's likely things change. Nevertheless it should give readers a good starting point.

This article introduces the basic architecture of the rendering components within JSON Forms. We'll first take a look at how a single renderer works. Then, we'll describe the ```RendererService```, which acts as a registry for renderers and as the entry point for any JSON Forms based application.

Renderer
--------
JSONForms rendering is based on [Angular directives](https://docs.angularjs.org/guide/directive) to display each control to the user. Each directive must be registered together with a ```RendererTester``` to JSONForms.

Let's take a detailed look at the [default renderer for integer controls](https://github.com/eclipsesource/jsonforms/blob/master/src/components/renderers/controls/integer/integer-directive.ts) to get a grasp of what is going on.

### Renderer Directive ###

{% highlight coffee %}
class IntegerDirective implements ng.IDirective {
    template = `
    <jsonforms-control>
      <input type="number"
             step="1"
             id="{{vm.id}}"
             class="form-control jsf-control-integer"
             ng-model="vm.modelValue[vm.fragment]"
             ng-change='vm.modelChanged()'
             ng-readonly="vm.uiSchema.readOnly"/>
    </jsonforms-control>`;
    controller = IntegerController;
    controllerAs = 'vm';
}
{% endhighlight %}

The renderer directive is a normal [Angular directive](https://docs.angularjs.org/guide/directive). The ```IntegerController``` is a subclass of ```AbstractControl``` which already provides all the functionality needed for the integer input element. However if you want to leverage this functionality then the root element of the template needs to be ```jsonforms-control```. Within the ```jsonforms-control``` you are free to do as you wish. Note: Is is recommended to define new css classes for each control to allow further styling without the need of overwriting the renderer.

### Renderer Controller ###

{% highlight coffee %}
class IntegerController extends AbstractControl {
    static $inject = ['$scope', 'PathResolver'];
    constructor(scope: IntegerControllerScope, pathResolver: IPathResolver) {
        super(scope, pathResolver);
    }
}
{% endhighlight %}

It is recommended to extend ```AbstractControl``` since it already provides a lot of default functionality. The ```AbstractControl``` needs the ```$scope``` and the ```PathResolver``` to work with. These variables can simply be injected. Here we do not need any specialization to the scope. Therefore the ```IntegerControllerScope``` is simply the same as the default [Angular scope](https://docs.angularjs.org/guide/scope).

{% highlight coffee %}
interface IntegerControllerScope extends ng.IScope {}
{% endhighlight %}

### Renderer Tester ###

It is possible that multiple renderers are capable of rendering a UI schema element. This is why each renderer tester needs to specify a ```number``` which represents its priority. The renderer with the highest priority will be picked. In general, the more specific renderers get, the higher will be their priority.

The tester is invoked for every control and returns either ```RendererService.NOT_FITTING``` (```-1```) or a positive number.

{% highlight coffee %}
interface RendererTester {
    (element: IUISchemaElement,
     dataSchema: any,
     dataObject: any,
     pathResolver: IPathResolver): number;
}
{% endhighlight %}

There exists a default implementation for controls which can be used via the alias ```ControlRendererTester```. The ```ControlRendererTester``` only needs the type of control it shall indicate to render and the priority to return. In the case of the integer renderer it looks like this:

{% highlight coffee %}
const IntegerControlRendererTester: RendererTester = ControlRendererTester('integer', 1);
{% endhighlight %}

Note that priority 1-100 is reserved by the framework. Any user implemented ```RendererTester``` should return a priority larger than 100.

### Registration ###

Finally the directive and its renderer tester both need to be registered.

The directive is registered like any other [Angular directive](https://docs.angularjs.org/guide/directive).

{% highlight coffee %}
angular
    .module('jsonforms.renderers.controls.integer')
    .directive('integerControl', () => new IntegerDirective())
{% endhighlight %}

The tester is registered within the [run method of the module](https://docs.angularjs.org/guide/module#module-loading-dependencies).

{% highlight coffee %}
angular
    .module('jsonforms.renderers.controls.integer')
    .run(['RendererService', RendererService =>
            RendererService.register('integer-control', IntegerControlRendererTester)
    ])
{% endhighlight %}

When your tester 'wins', a directive of your registered name (```integer-control```) will be created. Therefore make sure that the directive you register to Angular has the same name. In the example ```integerControl``` [is the same as](https://docs.angularjs.org/guide/directive#normalization) ```integer-control```.

This is all we need to know for the integer renderer. You can see all the snippets in action [here](https://github.com/eclipsesource/jsonforms/blob/master/src/components/renderers/controls/integer/integer-directive.ts).

Creating a custom renderer
--------------------------
Armed with this knowledge let’s now move on and implement our own custom control render in Javascript. Clone the seed project in order to have a ready-to-use AngularJS application that uses JSON Forms and install all relevant dependencies:

{% highlight bash %}
git clone https://github.com/eclipsesource/jsonforms-seed.git custom-control-tutorial
cd custom-control-tutorial
npm start
{% endhighlight %}

The seed project comes pre-configured with two ```schema.js``` and a ```ui-schema.js``` Javascript files that contain the JSON schema and the UI schema respectively.

The schema describes a User entity and features three basic data types and also contains a validation constraint ```minLength```, which requires the ```name``` property to be at least three characters long.
The UI schema only consists of a ```HorizontalLayout``` with three Controls and is therefore left out here. In case you are interested nevertheless, have a look at the ```js/ui-schema.js``` file.

Let’s now create a custom control for the ```name``` property of a user. First we'll need to create a new directive which is responsible for rendering the ```name``` property. Add the following code to the ```js/app.js``` file.

{% highlight js %}
app.directive('nameControl', function () {
    return {
        restrict: 'E',
        template: '<jsonforms-control>' +
        '<input type="text"' +
        ' id="{{vm.id}}"' +
        ' class="form-control"' +
        ' style="background-color: #3278b3; color: #8dd0ff"' +
        ' ng-model="vm.modelValue[vm.fragment]"' +
        ' ng-change="vm.modelChanged()"' +
        ' ng-readonly="vm.uiSchema.readOnly"/>' +
        '</jsonforms-control>',
        controller: { /* TODO */ },
        controllerAs: 'vm'
    };
});
{% endhighlight %}

This template makes sure that our name input is rendered with a different color than the other inputs.

Now we need to implement the controller. We will create a new one from scratch which will set all properties needed for the ```jsonforms-control``` directive.

{% highlight js %}
{
    controller: ['$scope', 'PathResolver', function (scope, pathResolver) {
        var vm = this;
        vm.submitCallback = function () {
            if (vm.modelValue[vm.fragment] === undefined) {
                vm.modelValue[vm.fragment] = [];
            }
            vm.modelValue[vm.fragment].push(_.clone(vm.submitElement));
        };
        vm.submitElement = {};

        var services = scope['services'];
        var uiSchema = scope['uiSchema'];
        var schema = services.get(2).getSchema();
        var data = services.get(1).getData();
        var indexedSchemaPath = uiSchema['scope']['$ref'];
        vm.fragment = pathResolver.lastFragment(uiSchema.scope.$ref);
        vm.modelValue = pathResolver.resolveToLastModel(data, uiSchema.scope.$ref);
        vm.label = uiSchema.label;
        if (vm.label == undefined)
            vm.label = vm.fragment.charAt(0).toUpperCase() + vm.fragment.substr(1);
        vm.showLabel = true;
    }]
}
{% endhighlight %}

Finally we’ll need to execute ```run``` in order to register our control with a custom renderer tester at the ```RenderService``` while the application is bootstrapping:

{% highlight js %}
app.run(['RendererService', function (RendererService) {
    var nameTester = function (element, dataSchema, dataObject, pathResolver) {
        if (element.type !== 'Control') {
            return -1;
        }

        var schemaPath = element['scope']['$ref'];

        var currentDataSchema = pathResolver.resolveSchema(dataSchema, schemaPath);
        if (currentDataSchema === undefined || currentDataSchema.type !== 'string') {
            return -1;
        }

        if (schemaPath.indexOf('name') > -1) {
            return 200;
        }

        return -1;
    };

    RendererService.register('name-control', nameTester);
}]);
{% endhighlight %}

The tester checks whether the UI schema element is of type ```Control```, the control of type ```string``` and whether the ```schemaPath``` contains ```name```  as a fragment. If it does we know that our control is responsible for displaying a user's name.

That's basically it. Open the ```index.html``` of the jsonforms-seed project and you should see your custom control in action.
