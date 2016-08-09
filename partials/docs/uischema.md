---
layout: doc
---
# UI SCHEMA

The UI schema, which is passed into the `jsonforms` directive, describes
the general layout of a form and is just a regular JSON object.
It describes the form by means of different elements, which can be 
categorized into `Control`s and `Layout`s. The type of an element
 can be specified via the `type` property.
In this section, we provide a detailed overview about the currently 
available UI schema elements.

## Controls

### Type
The most important UI schema element is Control. A Control is 
specified with the `Control` value for the `type` keyword. 

### Scope
Furthermore, it must specify a `scope` property, which tells the 
`Control` to which property of the JSON schema it should bind.

For instance, if we have a minimal JSON schema like this:
<pre>
<code class="language-typescript">
var schema = {
  'properties': { 
    'name': {  'type': 'string' }
   }
};
</code>
</pre>
the most basic UI schema would be the following displaying a `Control` 
would be
<pre>
<code class="language-typescript">
var uiSchema = {
  'type': 'Control',
  'scope': { '$ref': '#/properties/name' }
};
</code>
</pre>

The format of the `scope` property must be an object with a single
property `$ref`, which must be a [JSON Pointer](https://tools.ietf.org/html/rfc6901). 
You can read more about `$refs` [here](https://spacetelescope.github.io/understanding-json-schema/structuring.html).

In the example above, we want the control to bind against the single `name`
property. Below is an example of a rendered control.

<div ng-controller='UiSchemaController as vm' class='example'>
  <listing-control schema='vm.example1.schema' uischema='vm.example1.uischema' data='vm.example1.data'></listing-control>
</div>

### Read-only
 
Controls support a read-only state, which can be enabled with the `readOnly` 
property within the UI schema. The value of the `readOnly` property
is a boolean.
 
<div ng-controller='UiSchemaController as vm' class='example'>
  <listing-control schema='vm.example2.schema' 
                   uischema='vm.example2.uischema' 
                   data='vm.example2.data'>
  </listing-control>
</div> 
 
### Options
Certain renderers support additional configuration options. 
Those options should be put into a `options` property. 
We'll describe the most important `options` when looking at renderers
that support certain options.

## Enum controls
A `enum` property within a JSON schema will be rendered with a dropdown
 menu by default. Here's an example:
 
<div ng-controller='UiSchemaController as vm' class='example'>
  <listing-control schema='vm.example3.schema' 
                   uischema='vm.example3.uischema' 
                   data='vm.example3.data'>
  </listing-control>
</div>  

## Array controls
Controls binding to arrays support different types of rendering modes.
The default render mode is to render form fields for each item within
array.

<div ng-controller='UiSchemaController as vm' class='example'>
  <listing-control schema='vm.example4.schema' 
                   uischema='vm.example4.uischema' 
                   data='vm.example4.data'>
  </listing-control>
</div>

The default renderer supports a couple of `options`. The `submit` property
disables adding new entries to an array.

```
var uischema = {
  'type': 'Control',
  'scope': { '$ref': '#/properties/comments' },
  'options': {
    'submit': false
  }
};

```

![Array control without submit option](./images/docs/uischema.control.array.nosubmit.png){:.img-responsive .docimg}

The `simple` option can be used to display a very simple view of all entries
which does not allow submitting additional entries (so the `submit `option has no
effect if combined with `simple`).

With the data displayed belows the rendered form looks like this:



```
data = {
    "comments": [
      { "message": "Say Hello"          },
      { "message": "Put your hands up " },
      { "message": "In the air"         },
      { "message": "My dog likes cats"  },
    ]
  }
```

![Array control with simple option set](./images/docs/uischema.control.array.simple.png){:.img-responsive}


# Layouts
Layouts specify how multiple controls are arranged within the UI. Therefore,
Layouts have an `elements` property that contains the different UI schema 
 element that ought to be layout. Of course, Layouts can again contain 
 other Layouts.
 
# Horizontal 
 
A `HorizontalLayout` orders its children in a horizontal fashion, where
each child occupies the same amount of space, i.e. for *n* children
a child occupies *1/n* space.
 
A simple example for a `HorizontalLayout` with two children 
is given below:
```
schema = {
            'properties': {
                'foo': { 'type': 'string' },
                'bar': { 'type': 'string' }
            }
        };        
var uiSchema = {
            'type': 'HorizontalLayout',
            'elements': [
                {
                    'type': 'Control',
                    'label': true,
                    'scope': { '$ref': '#/properties/foo' }
                },
                {
                    'type': 'Control',
                    'label': false,
                    'scope': { '$ref': '#/properties/bar' }
                }
            ]
        };
```
 
# Vertical
The `VerticalLayout` behaves analogously to th e`HorizontalLayout` but 
orders its children vertically, i.e. the elements will be placed beneath
each other, instead of side-by-side.

An example for a `VerticalLayout` looks as follows
```
var uiSchema = {
            'type': 'VerticalLayout',
            'elements': [
                {
                    'type': 'Control',
                    'label': true,
                    'scope': { '$ref': '#/properties/foo' }
                },
                {
                    'type': 'Control',
                    'label': false,
                    'scope': { '$ref': '#/properties/bar' }
                }
            ]
        };
```
 
# Group
A `Group` behaves exactly like a `VerticalLayout`, i.e. its `elements`
will be lay out in a vertical fashion. The difference is, that the 
`Group` also features a `label`` property that display an label above
the `elements`.

A simple example of a `Group` featuring a `label` can be seen in the 
example below:

```
var uiSchema = {
            'type': 'Group',
            'label': 'Some title'
            'elements': [
                {
                    'type': 'Control',
                    'label': true,
                    'scope': { '$ref': '#/properties/foo' }
                },
                {
                    'type': 'Control',
                    'label': false,
                    'scope': { '$ref': '#/properties/bar' }
                }
            ]
        };
```
 
 # Categorization
The `Categorization` layout contains elements where each on of them 
specifies a category with the `type` property. A category itself again 
acts as a container, hence it also has an `elements` property. A simple 
example for a Categorization might look as follows:
  
```
var uiSchema = {
            'type': 'Categorization',
            'elements': [
                {
                    'type': 'Category',
                    'label': 'Pets',
                    'elements': [
                        {
                            'type': 'Control',
                            'scope': {
                                '$ref': '#/properties/pets'
                            }
                        },
                    ]
                },
                {
                    'type': 'Category',
                    'label': 'Cars',
                    'elements': [
                        {
                            'type': 'Control',
                            'scope': {
                                '$ref': '#/properties/cars'
                            }
                        },
                    ]
                },
            ]
        };
  
```

In this example we have two categories, one named 'Pets', the other one 
named 'Cars'. Both contain a single `Control`.

The default renderer renders categories as tabs. but other implementations
might be based on a tree.




