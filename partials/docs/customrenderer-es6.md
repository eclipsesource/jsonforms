---
layout: doc
---
CUSTOM RENDERER TUTORIAL (ES 6)
===============================

Even if the default controls that are created by the default renderers of JSON Forms are probably a good fit for several scenarios, you may still want to customize the rendered forms in certain situations.
This can be done by registering a custom renderer that produces a different UI control.
On this page, you will learn how to create and register a custom renderer in an application that uses *Javascript (ES 6)*.
Please note that there are separate guides for [ES5](#/docs/customrenderer-es5) and [Typescript](#/docs/customrenderer-ts).

In this guide, we will replace the default renderer for integer values (see schreenshot below)

![Default Integer Control](images/docs/customrenderer.ts.previewbefore.png){:.img-responsive .docimg}

so that it will use a *rating control* as shown below instead.

![Custom Rating Control](images/docs/customrenderer.ts.preview.png){:.img-responsive .docimg}

Running the ES6 seed project
-----------------------------------

To get started quickly, JSON Forms provides project seeds of different flavors. In this guide, we'll use this ES6 seed. Clone this project seed in order to have a ready-to-use AngularJS application that uses JSON Forms and install all relevant dependencies using the following command:

* `git clone https://github.com/eclipsesource/jsonforms-es6-seed.git`
* `cd jsonforms-es6-seed`
* `npm install`
* `npm start`

Once the dependencies are installed and the local server started, you should see the following web page at [localhost:8080](http://localhost:8080).

![Initial form](images/docs/customrenderer.ts.initialform.png){:.img-responsive .docimg}

The most important files in this project seed are the following:

* `src/index.html` is the main HTML file and contains the JSON Forms directive to render a form. The data as well as the data schema is obtained from `MyController`.
* `src/schema.js` contains the data schema.
* `src/ui-schema.js` contains the UI schema.
* `src/app.js` contains the implementation of `MyController`, which imports the data and UI schema in order to provide them to the JSON Forms directive in `src/index.html`. Moreover, this controller provides a simple data object.

Having a closer look at `src/index.html`, we see that we use `MyController` to provide the input to the JSON Forms directive in order to render a form for the data object and the data schema.

The data schema in `src/schema.js` defines three properties: `name` and `description` of type `string`, as well as `done` of type `boolean`.

```
export const Schema = {
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "done": {
      "type": "boolean"
    }
  },
  "required": ["name"]
}
```

The UI schema in `src/ui-schema.js` specifies a control for each of those three properties and puts them into a vertical layout.

```
export const UISchema = {
  "type": "VerticalLayout",
  "elements": [
    {
      "type": "Control",
      "label": "Name",
      "scope": {
        "$ref": "#/properties/name"
      }
    },
    {
      "type": "Control",
      "label": "Description",
      "scope": {
        "$ref": "#/properties/description"
      },
      "options": {
        "multi": true
      }
    },
    {
      "type": "Control",
      "label": "Done?",
      "scope": {
        "$ref": "#/properties/done"
      }
    }
  ]
}
```

Finally, `src/app.js` imports the schemata and introduces a data object, which are provided as fields `schema`, `uiSchema`, and `data`.

```Javascript
import './init';
import angular from 'angular';
import Schema from './schema';
import UISchema from './ui-schema';
import 'jsonforms';


angular.module('jsonforms-seed').controller('MyController', ['$scope', function($scope) {
    $scope.schema = Schema;
    $scope.uiSchema = UISchema;
    $scope.data = {
        "name": "Send email to Adriana",
        "description": "Confirm if you have passed the subject",
        "done": true
    };
}]);
```

Finally, these fields are used in the JSON Forms directive in `src/index.html` to render the form.

```HTML
<body ng-controller="MyController">
<jsonforms schema="schema" uischema="uiSchema"  data="data"></jsonforms>
</body>
```

Preparations for creating the custom rating control
---------------------------------------------------

To implement the rating control like below
![Custom Rating Control](./images/docs/customrenderer.ts.preview.png){:.img-responsive .docimg}
we use `ui-bootstrap`. We can add the rating control to the `src/index.html` in order to test that we have all dependencies. Let us put the following tag into `index.html`:

```
<body ng-controller="MyController">
  <jsonforms schema="schema" uischema="uiSchema"  data="data"></jsonforms>
  <uib-rating ng-model="2" max="5"></uib-rating>
</body>
```

We should now see the following:
![Default form with rating control](./images/docs/customrenderer.ts.formwithuibrating.png){:.img-responsive .docimg}

As you can see, we are able to use the ui-bootstrap control in our HTML code. So it is time now to use it in a custom JSON Forms renderer. But let us remove the tag `<uib-rating ng-model="2" max="5"></uib-rating>` from `src/index.html`, as we just added it there to test `ui-bootstrap`.

Let us now add a new property to the data schema and add a new control for it in the UI schema. Therefore, we add the property `rating` of type `integer` with a maximum value of `5` to `src/schema.js`.

```
export default {
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "description": {
      "type": "string"
    },
    "rating": {
      "type": "integer",
      "maximum": 5
    },
    "done": {
      "type": "boolean"
    }
  },
  "required": ["name"]
}
```

In `src/ui-schema.js`, we only have to add a new control for the property `rating` to the form.

```
export default {
  "type": "VerticalLayout",
  "elements": [
    {
      "type": "Control",
      "label": "Name",
      "scope": {
        "$ref": "#/properties/name"
      }
    },
    {
      "type": "Control",
      "label": "Description",
      "scope": {
        "$ref": "#/properties/description"
      },
      "options": {
        "multi": true
      }
    },
    {
      "type": "Control",
      "label": "Rating",
      "scope": {
        "$ref": "#/properties/rating"
      }
    },
    {
      "type": "Control",
      "label": "Done?",
      "scope": {
        "$ref": "#/properties/done"
      }
    }
  ]
}
```

The default renderer will now show an integer text field for the property `rating`.

![Default Integer Control](images/docs/customrenderer.ts.previewbefore.png){:.img-responsive .docimg}

In the next section, we will add a custom renderer to change this text field with a more appropriate control for assigning a rating.

![Custom Rating Control](images/docs/customrenderer.ts.preview.png){:.img-responsive .docimg}

Defining your custom renderer
-----------------------------

To create a custom renderer, we have to do three steps.

1. Create an Angular directive
2. Provide a controller for the directive
3. Register a new renderer that uses the created directive

Let us create the new Javascript file `src/rating-control.js` that will contain those three things mentioned above and import it in `src/app.js` by adding `import "./rating-control.js";`.

### Create an Angular directive

In order to create an Angular directive, we add the code below to `src/rating-control.js`.

```
class RatingControlDirective {
    constructor(){
        this.template = `
            <jsonforms-control>
              <uib-rating
                id="{{vm.id}}"
                readonly="vm.uiSchema.readOnly"
                ng-model="vm.resolvedData[vm.fragment]"
                max="vm.max()"></uib-rating>
              </uib-rating>
            </jsonforms-control>`;

        this.controller = RatingControl;
        this.controllerAs = 'vm';
    }
}
```

As you can see above, we created a new Angular directive, which provides a template and a controller. The template introduces the tag `jsonforms-control`, which contains the `uib-rating` tag from ui-bootstrap. As parameters of this tag, we use values provided from a controller `RatingControl`, which we still need to implement, but we can already see that we set the `readonly` flag as specified in the respective UI schema and bind the value of this control to a specific data value. Moreover, we configure the parameter `max`, which indicates the maximum number of stars a user may give in the control, to a value that is computed in a function of `RatingControl`.

### Provide a controller for the directive

Let us now implement the `RatingControl` by adding the following code to `src/rating-control.js`.

```
import {AbstractControl, PathResolver} from "jsonforms";

class RatingControl extends AbstractControl {
    constructor(scope) {
        super(scope);
    }

    max() {
        const schemaElement = PathResolver.resolveSchema(this.schema, this.schemaPath);
        if (schemaElement['maximum'] !== undefined) {
            return schemaElement['maximum'];
        } else {
            return 5;
        }
    }
}
RatingControl.$inject = ['$scope'];
```

The `RatingControl` subclasses `AbstractControl`, a class in JSON Forms providing the base functionality for controls. Besides the constructor, which only forwards the `$scope` to the superclass, this class provides the function `max()`, which we already used when defining the directive to specify the maximum number of stars we would like to see in the control. In the function `max()`, we want to obtain the maximum value as specified in the data schema.

```
"rating": {
  "type": "integer",
  "maximum": 5 // <- this is the value we want to obtain
}
```

Therefore, we first resolve the data schema element for which this renderer should render a UI control. As we subclassed `AbstractControl`, we may access the current schema using `this.schema` and the path to the current element in this schema using `this.schemaPath`. To resolve the actual schema element, we use the `PathResolver`, a helper class of JSON Forms, to resolve the actual schema element from the current schema.

```
const schemaElement = PathResolver.resolveSchema(this.schema, this.schemaPath);
```

Now, we can check whether `schemaElement` has a property `maximum`. If so, we will return its value; otherwise, we return a default maximum value of `5`.

### Register a new renderer that uses the created directive

Finally, the only thing that is left to do is to register the created directive and specify when we want to use our custom renderer. Therefore, we add the following code to `src/rating-control.js`.

```
import {AbstractControl, Testers, schemaTypeIs, schemaPropertyName, PathResolver} from "jsonforms";

...

export default angular
    .module('jsonforms-seed')
    .directive('ratingControl', () => new RatingControlDirective())
    .run(['RendererService', RendererService =>
        RendererService.register('rating-control',
            Testers.and(
                schemaTypeIs('integer'),
                schemaPropertyName('rating')
            ), 101)
    ]).name;
```

With this code, we tell Angular about our new directive `ratingControl` and register it at the `RendererService`. Therefore, we specify its name `rating-control`, which should correspond to the name in the template of the directive declaration, and define when our renderer should be activated. For defining when the renderer should be activated, JSON Forms provides `Testers`. These testers check whether the schema element is of type `integer` and the property name is `rating`. Thus, our new renderer will only be activated for one particular property.

After we registered the new renderer, we can refresh the browser and should see our new renderer in action.

![Final form with custom rating control](images/docs/customrenderer.ts.finalform.png){:.img-responsive .docimg}

You can checkout the final state of the code of this tutorial at [https://github.com/eclipsesource/jsonforms-es6-seed/tree/custom-control](https://github.com/eclipsesource/jsonforms-es6-seed/tree/custom-control).
