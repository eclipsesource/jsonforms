---
layout: doc
---
Custom renderers with Typescript
================================

Even if the controls that are created by the default renderers of JSON Forms are probably a good fit 
for several scenarios, you may still want to customize the rendered forms in certain situations.
This can be done by registering a custom renderer that produces a different UI control. 
On this page, you will learn how to create and register a custom renderer in an application that uses *Typescript*. 
Please note, there are separate articles for Javascript [ES5](#/docs/customrenderer-es5) and [ES6](#/docs/customrenderer-es6).

In this article, we will replace the default renderer for integer values (see screenshot below)

{% 
   include image.html url="images/docs/customrenderer.ts.previewbefore.png" 
   description="The default rating control" 
%}   

so that it will use a *rating control* as shown below instead.

{% 
   include image.html url="images/docs/customrenderer.ts.preview.png" 
   description="The custom rating control" 
%}

Running the Typescript seed project
-----------------------------------

To get started quickly, JSON Forms provides project seeds of different flavors. In this article, we'll use this Typescript seed. Clone this project seed in order to have a ready-to-use AngularJS application that uses JSON Forms and install all relevant dependencies using the following command:

* `git clone https://github.com/eclipsesource/jsonforms-typescript-seed.git`
* `cd jsonforms-typescript-seed`
* `npm install`
* `npm start`

Once the dependencies are installed and the local server started, you should see the following web page at [localhost:8080](http://localhost:8080).

{% 
   include image.html url="images/docs/customrenderer.ts.initialform.png" 
   description="The initial form" 
%}

The most important files in this project seed are the following:

* `src/index.html` is the main HTML file and contains the JSON Forms directive to render a form. The data as well as the data schema is obtained from `MyController`.
* `src/schema.ts` contains the data schema.
* `src/ui-schema.ts` contains the UI schema.
* `src/app.ts` contains the implementation of `MyController`, which imports the data and UI schema in order to provide them to the JSON Forms directive in `src/index.html`. Moreover, this controller provides a simple data object.

Having a closer look at `src/index.html`, we see that `MyController` provides the input to the JSON Forms 
directive in order to render a form for the data object and the data schema.

The data schema in `src/schema.ts` defines three properties: `name` and `description` of 
type `string`, as well as `done` of type `boolean`.

<pre nag-prism class="language-typescript" source="export const Schema = {
  'type': 'object',
  'properties': {
    'name': {
      'type': 'string'
    },
    'description': {
      'type': 'string'
    },
    'done': {
      'type': 'boolean'
    }
  },
  'required': ['name']
}"/>


The UI schema in `src/ui-schema.ts` specifies a control for each of those three properties and puts them into a vertical layout.

<pre nag-prism class="language-typescript" source="export const UISchema = {
  'type': 'VerticalLayout',
  'elements': [
    {
      'type': 'Control',
      'label': 'Name',
      'scope': {
        '$ref': '#/properties/name'
      }
    },
    {
      'type': 'Control',
      'label': 'Description',
      'scope': {
        '$ref': '#/properties/description'
      },
      'options': {
        'multi': true
      }
    },
    {
      'type': 'Control',
      'label': 'Done?',
      'scope': {
        '$ref': '#/properties/done'
      }
    }
  ]
}"/>

Finally, `src/app.ts` imports the schemata and introduces a data object, 
all of which are provided as fields `schema`, `uischema`, and `data`.

<pre nag-prism class="language-typescript" source="
import {Schema} from  './schema.ts';
import {UISchema} from './ui-schema';

class MyController {
  schema = Schema;
  uischema = UISchema;
  data = {
    'name': 'Send email to Adriana',
    'description': 'Confirm if you have passed the subject',
    'done': true
  };
}

angular.module('app', ['jsonforms'])
  .controller('MyController', MyController);
}"/>

Finally, these fields are used in the JSON Forms directive in `src/index.html` to render the form.

<pre nag-prism class="language-html" source="
<body ng-app='app' ng-controller='MyController as my'>
  <jsonforms schema='my.schema' uischema='my.uischema' data='my.data'></jsonforms>
</body>
"/>

Preparations for creating the custom rating control
---------------------------------------------------

To implement the rating control as seen here

{% 
   include image.html url="images/docs/customrenderer.ts.preview.png" 
   description="The custom control we want to implement" 
%}   

we use `ui-bootstrap`. We can add the rating control to the `src/index.html` in order to test that we 
have all of the dependencies. Let us put the following tag into `index.html`:

<pre nag-prism class="language-html" source="
<body ng-app='app' ng-controller='MyController as my'>
  <jsonforms schema='my.schema' uischema='my.uischema' data='my.data'></jsonforms>
  <uib-rating ng-model='2' max='5'></uib-rating>
</body>
"/>

Now we should see the following:

{% 
   include image.html url="images/docs/customrenderer.ts.formwithuibrating.png" 
   description="The rendered form together with the additional UI Bootstrap control" 
%}   

As you can see, we are able to use the ui-bootstrap control in our HTML code. 
So it is now time to use it in a custom JSON Forms renderer. 
But let us remove the tag `<uib-rating ng-model="2" max="5"></uib-rating>` from `src/index.html`, 
as we just added it to test `ui-bootstrap`.

Let us now add a new property to the data schema and add a new control for it in the UI schema. Therefore, we add the property `rating` of type `integer` with a maximum value of `5` to `src/schema.ts`.

<pre nag-prism class="language-typescript" source="
export const Schema = {
  'type': 'object',
  'properties': {
    'name': {
      'type': 'string'
    },
    'description': {
      'type': 'string'
    },
    'rating': {
      'type': 'integer',
      'maximum': 5
    },
    'done': {
      'type': 'boolean'
    }
  },
  'required': ['name']
}"/>

In `src/ui-schema.ts`, we only have to add a new control for the property `rating` to the form.

<pre nag-prism class="language-typescript" source="
export const UISchema = {
  'type': 'VerticalLayout',
  'elements': [
    {
      'type': 'Control',
      'label': 'Name',
      'scope': {
        '$ref': '#/properties/name'
      }
    },
    {
      'type': 'Control',
      'label': 'Description',
      'scope': {
        '$ref': '#/properties/description'
      },
      'options': {
        'multi': true
      }
    },
    {
      'type': 'Control',
      'label': 'Rating',
      'scope': {
        '$ref': '#/properties/rating'
      }
    },
    {
      'type': 'Control',
      'label': 'Done?',
      'scope': {
        '$ref': '#/properties/done'
      }
    }
  ]
}"/>

The default renderer will show an integer text field for the property `rating`.

{% 
   include image.html url="images/docs/customrenderer.ts.previewbefore.png" 
   description="The default renderer for an integer property" 
%}

In the next section, we will add a custom renderer to change this text field with a more appropriate control for assigning a rating.

{% 
   include image.html url="images/docs/customrenderer.ts.preview.png" 
   description="The customized renderer for an integer property" 
%}

Defining your custom renderer
-----------------------------

To create a custom renderer, we have to do three steps.

1. Create an Angular directive
2. Provide a controller for the directive
3. Register a new renderer that uses the created directive

Let us create the new Typescript file `src/rating-control.ts` that will contain those three things 
and import it in `src/index.ts` by adding `import "./rating-control.ts";`.

<pre nag-prism class="language-typescript" source="
import './app';
import './rating-control';
"/>

### Create an Angular directive

In order to create an Angular directive, we add the code below to `src/rating-control.ts`.

<pre nag-prism class="language-typescript" source="
import {AbstractControl, Testers, schemaTypeIs, schemaPropertyName, PathResolver} from 'jsonforms';

class RatingControlDirective implements ng.IDirective {
  template = `
    <jsonforms-control>
      <uib-rating
        id='{{vm.id}}'
        readonly='vm.uiSchema.readOnly'
        ng-model='vm.resolvedData[vm.fragment]'
        max='vm.max()'></uib-rating>
      </uib-rating>
    </jsonforms-control>`;
  controller = RatingControl;
  controllerAs = 'vm';
}"/>

As you can see above, we created a new Angular directive, which provides a template and a controller. 
The template introduces the tag `jsonforms-control`, which contains the `uib-rating` tag from ui-bootstrap. 
As parameters of this tag, we use values provided from a controller `RatingControl`, which we still must implement.
However, we can already see that we set the `readonly` flag as specified in the respective UI schema and bind the value 
of this control to a specific data value. Moreover, we configure the parameter `max`, which indicates the 
maximum number of stars a user may give in the control, to a value that is computed in a function of `RatingControl`.

### Provide a controller for the directive

Let us now implement the `RatingControl` by adding the following code to `src/rating-control.ts`.

<pre nag-prism class="language-typescript" source="
class RatingControl extends AbstractControl {
  static $inject = ['$scope'];
  constructor(scope: ng.IScope) {
    super(scope);
  }

  max(): number {
    if (resolvedSchema['maximum'] !== undefined) {
      return <number>resolvedSchema['maximum'];
    } else {
      return 5;
    }
  }
}"/>

The `RatingControl` subclasses `AbstractControl`, a class in JSON Forms providing the base functionality for controls. Besides the constructor, which only forwards the `$scope` to the superclass, this class provides the function `max()`, which we already used when defining the directive to specify the maximum number of stars we would like to see in the control. In the function `max()`, we want to obtain the maximum value as specified in the data schema.

```Javascript
"rating": {
  "type": "integer",
  "maximum": 5 // <- this is the value we want to obtain
}
```


As we subclassed `AbstractControl`, we can retrieved the respective schema element with the `resolvedSchema` property.

We then check whether the `resolvedSchema` has a property `maximum`. If so, we will return its value; otherwise, we return a default maximum value of `5`.

### Register a new renderer that uses the created directive

Finally, the only thing that is left to do is to register the created directive and specify when we want to use our custom renderer. Therefore, we add the following code to `src/rating-control.ts`.

<pre nag-prism class="language-typescript" source="
angular
  .module('app')
  .directive('ratingControl', () => new RatingControlDirective())
  .run(['RendererService', RendererService =>
  RendererService.register('rating-control',
    Testers.and(
      schemaTypeIs('integer'),
      schemaPropertyName('rating')
      ), 101)
]);"/>

With this code, we tell Angular about our new directive `ratingControl` and register it at the `RendererService`. 
Therefore, we specify its name `rating-control`, which should correspond to the name in the 
template of the directive declaration, and we define when our renderer should be activated. 
For defining when the renderer should be activated, JSON Forms provides `Testers`. 
These testers check whether the schema element is of type `integer` and the property name is `rating`. 
Thus, our new renderer will only be activated for one particular property.

After we registered the new renderer, we can refresh the browser and should see our new renderer in action.

{% 
   include image.html url="images/docs/customrenderer.ts.finalform.png" 
   description="The finished form" 
%}

You can checkout the final state of the code of this article at [https://github.com/eclipsesource/jsonforms-typescript-seed/tree/custom-control](https://github.com/eclipsesource/jsonforms-typescript-seed/tree/custom-control).
