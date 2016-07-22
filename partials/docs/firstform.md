---
layout: doc
---
DEFINE YOUR FIRST FORM
======================

In this first part of the tutorial, we describe how to create a simple form from scratch using JSON Forms. For the tutorial, we use the [JSON Forms Editor](#/docs/jsonformseditor) for creating the data schema and the UI schema. Note that this could also be done by manually writing the underlying JSON files. Therefore, we always show both representations in the course of this tutorial. This section describes how to create the initial state of our example application. If you haven’t set up your environment and obtained the example code yet, please refer to the [tutorial setup guide](#/docs/setup).

The example used along this tutorial is called "Make It Happen" and creates a simple task tracker. The first goal is to create a form for entering "Tasks". This form contains three input fields as shown in the following screenshot. As you can see, the form has one simple String control called "Name", a multi-line String control called "Description" and a Boolean checkbox control indicating whether the task is done.

![Example form](images/docs/firstform.form.png){:.img-responsive .docimg}

The first step to create such a form is to define the underlying data schema. This schema defines the data object underneath a form. Technically, the underlying data is a JSON object, which is bound to the form during runtime. JSON Forms partially derives the UI from this data schema, so defining the data is typically already most of the work.

Data schemata are defined using JSON Schema. In the following, we define a [JSON Schema](http://spacetelescope.github.io/understanding-json-schema), which contains three attributes for the example entity "Task": "name" (String), "description" (String) and "done" (boolean). The following screenshot shows the data schema in the JSON Forms Editor on the left-hand side and the corresponding data schema in the underlzing JSON representation on the right-hand side.

<div class="row">
<div class="col-sm-2">
<img src="./images/docs/firstform.dataschema.png" alt="Data schema" class="img-responsive docimg">
</div>
<div class="col-sm-10">
<pre class="highlight">
<code>{
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
    }
  }
}</code>
</pre>
</div>
</div>

Based on the data schema, you can now define a UI schema showing all of the defined properties. In this simple example, we do not consider any advanced features, such as layout or visibility rules yet, but rather just show all three attributes in a vertical layout.

Therefore, a UI schema needs to be created. It describes which properties of the data schema are to be rendered as controls. Every visible property of the data schema is represented as an element “control” in the UI schema. Controls directly reference the data schema, so that the specification of data properties, such as their data type, does not have to be replicated. The UI schema describes only UI relevant properties, such as the order of attributes, the label of controls, or whether a field is multi-line or not.

As before, there are two ways of creating and modifying a UI schema, the JSON Forms Editor and directly writing the underlying JSON file. When using the JSON Forms Editor, you can drag and drop properties from the data schema into the UI schema to create controls. So creating a simple form with controls is basically just one drag-and-drop operation. The following screenshot shows the UI schema for the example containing three controls on the left-hand side and the corresponding UI schema in the JSON representation on the right-hand side.

<div class="row">
<div class="col-sm-2">
<img src="./images/docs/firstform.uischema.png" alt="UI schema" class="img-responsive docimg">
</div>
<div class="col-sm-10">
<pre class="highlight">
<code>{
     "type": "VerticalLayout",
     "elements": [
         {
             "type": "Control",
             "scope": {
                 "$ref": "#/properties/name"
             },
             "readOnly": false
         },
         {
             "type": "Control",
             "scope": {
                 "$ref": "#/properties/description"
             },
             "readOnly": false
         },
         {
             "type": "Control",
             "label": "Done?",
             "scope": {
                 "$ref": "#/properties/done?"
             },
             "readOnly": false
         }
     ]
 }</code>
</pre>
</div>
</div>

 Once controls have been created, their properties can optionally be modified. In the simple example above, we have set the "description" control to be multi-line and changed the label of the "done" control to "done?". Please note that you only need to specify properties, which cannot directly be derived from the data schema and hence only concern pure UI aspects.

 With this simple data and UI schema, JSON Forms can already render a fully functional form, which allows you to enter the specified data (see screenshot below). When using the JSON Forms Editor, this form can already be tested using the preview feature.

 ![UI schema preview](images/docs/firstform.preview.png){:.img-responsive .docimg}

This form also provides some advanced features, which can be derived from the data schema. First, it provides bi-directional data binding of the UI to an underlying JSON object. Therefore, existing data can be simply loaded into the form and the data entered in the form can simply be submitted or stored. Second, it validates the data against the defined data schema. So for example, we could specify a minimum length constraint for the property “name” in the data schema as follows.

```javascript
{
  "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "minLength": 3 // <- new constraint
      },
      // …
}
```

If now a user does not enter a value with a minimum length of three characters for that property in a JSON form UI, the UI will report a validation error.

![UI schema preview with validation error](images/docs/firstform.validationerror.png){:.img-responsive .docimg}

The created data schema and UI schema can directly be used to create a form, which can be simply embedded into any web application and bound to data from any source (e.g. a REST service).

To embed the form, JSON Forms provides a dedicated AngularJS directive `jsonforms`. As parameters of this directive, you need to point to the data schema, the UI schema, and a JSON object containing the data to be displayed. In an AngularJS application, those values are typically provided by a controller. Thus, all you need to do to render a form for given data object at a specific place in your web application is to add the tag below. In this example, we have a `TaskController`, which provides access to the data object `tc.taskData`, the data schema `tc.taskSchema`, and the UI schema `tc.taskUISchema`.

```javascript
<... ng-controller="TasksController as tc">
 <jsonforms schema="tc.taskSchema" ui-schema="tc.taskUISchema" data="tc.taskData"></jsonforms>
<.../>
```

The complete sources are listed below and you can also find them in the [example application](#/docs/setup) (initial state). Once you have embedded the form into your application, it will bind the data and show live validation.

#### tasks.controller.js

```javascript
angular.module('MiHexample', ['jsonforms-bootstrap'])
.controller('TasksController',['Schema','UISchema','Task', function(Schema,UISchema,Task) {
    var vm = this;
    vm.taskSchema = Schema;
    vm.taskUISchema = UISchema;
    vm.taskData=Task;
}]);
```

#### index.html

```html
<!doctype html>
<html lang="en" ng-app="MiHexample">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title>Make It Happen</title>
        <link rel="stylesheet" type="text/css" href="css/app.css">
        <link rel="stylesheet" type="text/css" href="node_modules/jsonforms/dist/jsonforms-bootstrap.css">
        <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.css"/>

        <script src="node_modules/jsonforms/dist/jsonforms-bootstrap.js"></script>

        <script src="tasks.controller.js"></script>
        <script src="task_data.js"></script>
        <script src="task_schema.js"></script>
        <script src="task_uischema.js"></script>
    </head>
    <body style="max-width:1200px; margin:1vw auto;" ng-controller="TasksController as tc">
        <div class="panel panel-primary">
            <div class="panel-heading">
                <h3 class="panel-title">
                    <strong>Make it happen Example</strong>
                </h3>
            </div>
            <div class="panel-body jsf" style="line-height: 2.0">
                <jsonforms schema="tc.taskSchema" ui-schema="tc.taskUISchema" data="tc.taskData"></jsonforms>
            </div>
        </div>
    </body>
</html>
```
