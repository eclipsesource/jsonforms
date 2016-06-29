---
layout: doc
---
RENDERER TUTORIAL
=================
*Disclaimer*: This is only a draft version of the article, it's likely things change. Nevertheless it should give readers a good starting point.

This article introduces the basic architecture of the rendering components within JSON Forms. We'll first take a look at how a single renderer works. Then, we'll describe the ```RenderService```, which acts as a registry for renderers and as the entry point for any JSON Forms based application.

Renderer
--------
Simply said, a renderer is responsible for displaying a single UI schema element and also maintaining its possible state, if it has any (e.g. validation markers and the like). A renderer hence needs to conform to the following (preliminary) interface (TypeScript):

{% highlight coffee %}
interface IRenderer {
    isApplicable(element:IUISchemaElement, subSchema:SchemaElement, schemaPath:string):boolean

    render(element:IUISchemaElement, schema:SchemaElement,
           schemaPath:string, dataProvider:IDataProvider):IRenderDescription

    priority:number
}
{% endhighlight %}

The ```isApplicable``` method determines whether a renderer is capable of rendering the current UI schema element. The current UI schema element hereby refers to the currently visited part of the UI schema since the whole UI schema is traversed in a depth-first fashion.
If the UI schema element is a Control, i.e. whether it refers to a specific sub part of the schema via the control's ```scope``` property, the ```isApplicable``` method is also passed that specific sub part of the schema together with the according schema path. This means, for all UI schema element which are not controls, the passed ```subSchema``` and ```schemaPath``` are possibly ```undefined```.

It is possible that multiple renderers are capable of rendering a UI schema element. This is why each renderer needs to specify a ```priority``` of type ```number```. The renderer with the highest priority will be picked. In genereal, the more specific renderers get, the higher will be their ```priority```.

Here’s an exemplary implementation of the ```isApplicable``` method taken from the default implementation of the ```IntegerControl```:

{% highlight coffee %}
isApplicable(uiElement: IUISchemaElement, subSchema: SchemaElement, schemaPath: string):boolean {
    /* note that subSchema and schemaPath are potentially undefined */
    return uiElement.type == 'Control' && subSchema != undefined && subSchema.type == 'integer';
}
{% endhighlight %}

Finally, the ```render``` method of the ```IRenderer``` interface, which will be called, whenever a renderer has been selected, is responsible for actually creating a object we call ```RenderDescription```. This object contains all relevant information to render a UI schema element, which are the following:
 *```type```: determines the type, which currently can be either ```Control``` or ```Layout```
 *```size```: a value ranging from 0 - 99 that determines how much horizontal space this widget should occupy, where ```99``` determines all available space
 *```template``` or ```templateUrl```: the actual template HTML string to be rendered or a relative path to the file containing it. Templates are just regular ```HTML```, but need to be wrapped in a ```&lt;control&gt;``` or ```&lt;layout&gt;``` element, depending on the type of the rendered element.

For controls (type ```Control```), you need to set some more properties:
 *```instance```: the instance to be rendered
 *```schemaPath```: the schema path to the property which should be rendered. This will hence point to a specific property of the ```instance```.
 *```schema```: the overall schema

Because it seems likely to forget one of these properties when creating a control, JSON Forms also provides helper classes which do most of the initialization themselfes. Below is an example that is taken from the implementation of the ```IntegerControl```. Note also, that the ```render``` method is passed the complete schema and not the sub schema as it is the case with ```isApplicable```. Also, it features a parameter of type ```IDataProvider```. We'll won't go into detail about data provider in this article, so it's enough to know for now that it provides the current instance via its ```data``` property.

{% highlight coffee %}
render(element:jsonforms.services.UISchemaElement, schema:SchemaElement, schemaPath:string, dataProvider:jsonforms.services.IDataProvider) {
    var control = new JSONForms.ControlRenderDescription(dataProvider.data, schemaPath);
    control['template'] =
        '<control><input type="number" step="1" id="${schemaPath}"' +
        'class="form-control jsf-control jsf-control-integer" data-jsonforms-validation data-jsonforms-model/></control>';
    return control;
}
{% endhighlight %}

As you can see you only need to set the ```template``` property and you are good to go. The rest will be handled by the instantiated ```ControlRenderDescription```.

While reading through the template you might have noticed the ```data-jsonforms-validation``` and ```data-jsonforms-model``` attributes which you’ll need to add if you want validation support and databinding to work ouf-of-the-box. Basically these are just shortcuts to set up databinding and the validation change listener that is triggered whenever the model is changed.

RenderService
-------------
The ```RenderService``` is a registry for all available renderers within JSON Forms. Hence, when you provide a custom renderer, you'll also need register it with the RenderService. Furthermore it also acts as the entry point for any ```render``` calls within the framework itself. This is of interest in case you want to provide your own layout, since you'd then need to utilize the ```RenderService``` in order to retrieve ```IRenderDescription``` for all contained children of the layout.

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

Let’s now create a custom control for the ```name``` property of a user. First we’ll need to execute ```run``` in order to register our control at the ```RenderService``` while the application is bootstrapping:

{% highlight js %}
app.run(['RenderService', function(RenderService) {
    // TODO
}]);
{% endhighlight %}

We inject the ```RenderService``` which we'll need to register our control. Next we define the outline of the control and register it at the RenderService:

{% highlight js %}
app.run(['RenderService', function (RenderService) {
    function MyControl() {
        return {
            priority: 100,
            render: function (element, schema, schemaPath, dataProvider) {/*...*/},
            isApplicable: function (element, subSchema, schemaPath) {/*...*/}
        }
    }

    RenderService.register(new MyControl());
}]);
{% endhighlight %}

Since multiple controls will be applicable (the ```StringControl``` will also come in question), we need to set a higher priority than default control. User-defined controls should have set a priority >= 100, since 0 - 99 are reserved for the framework itself.

Let’s implement the last missing bits:
{% highlight js %}
{
    isApplicable: function (element, subSchema, schemaPath) {
        // check whether the schema path contains name
        return element.type == "Control" && schemaPath != undefined && schemaPath.indexOf("name") > -1;
    }

    render: function (element, schema, schemaPath, dataProvider) {
        var control = new JSONForms.ControlRenderDescription(dataProvider.data, schemaPath);
        control['template'] =
            '<control><input type="text" style="background-color: #3278b3; color: #8dd0ff"' +
            'class="form-control" data-jsonforms-model data-jsonforms-validation /></control>';
        return control;
    }
}
{% endhighlight %}

The ```isApplicable``` method checks whether the UI schema element is of type ```Control``` and whether the ```schemaPath``` contains ```"name"```  as a fragment. If it does we know that the control is responsible for display a user's name.

The ```render``` method is pretty standard and is actually based on the default ```StringControl``` The only aspect that differs from the default implementation are additional style attributes that set a background and foreground color.

That's basically it. Open the ```index.html``` of the jsonforms-seed project and you should see your custom control in action.
