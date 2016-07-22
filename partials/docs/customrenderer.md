---
layout: doc
---
CUSTOM RENDERER
===============

This article introduces the basic architecture of the rendering components within JSON Forms. We'll first take a look at how a single renderer works. Then, we'll describe the ```RendererService```, which acts as a registry for renderers and as the entry point for any JSON Forms based application.

After this architecture overview, we suggest to have a look at the dedicated tutorials on [implementing a custom renderer in Typescript](#/docs/customrenderer-ts), [in Javascript ES5](#/docs/customrenderer-es5), and [in Javascript ES6](#/docs/customrenderer-es6).

Renderer
--------
JSON Forms rendering is based on [Angular directives](https://docs.angularjs.org/guide/directive) to display each control to the user.
Each directive must be registered together with a tester and priority to JSON Forms.

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
You can see all the snippets in action [the integer directive in JSON Forms](https://github.com/eclipsesource/jsonforms/blob/master/src/components/renderers/controls/integer/integer-directive.ts).

Being equipped with the general knowledge on the architecture of renderers in JSON Forms, a great next step is to look at the tutorials on [implementing a custom renderer in Typescript](#/docs.customrenderer-ts), [in Javascript ES5](#/docs/customrenderer-es5), or [in Javascript ES6](#/docs/customrenderer-es6).
