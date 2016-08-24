---
layout: doc
---
UI SCHEMA
========= 

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

<div ng-controller='UiSchemaController as vm' class='example' >
  <listing-control schema='vm.example1.schema' 
                   uischema='vm.example1.uischema' 
                   data='vm.example1.data'>
  </listing-control>
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

<div ng-controller='UiSchemaController as vm' class='example'>
  <listing-control schema='vm.example4.schema' 
                   uischema='vm.example4.uischema' 
                   data='vm.example4.data'>
  </listing-control>
</div>

The `simple` option can be used to display a very simple view of all entries
which does not allow submitting additional entries (so the `submit `option has no
effect if combined with `simple`).

<div ng-controller='UiSchemaController as vm' class='example'>
  <listing-control schema='vm.example5.schema' 
                   uischema='vm.example5.uischema' 
                   data='vm.example5.data'>
  </listing-control>
</div>

# Layouts
Layouts specify how multiple controls are arranged within a container
element. Therefore, layouts have an `elements` property that contains 
the different UI schema element that ought to be layout. 
Of course, Layouts can again contain other Layouts.
 
# Horizontal Layout 
 
A `HorizontalLayout` orders its children in a horizontal fashion, where
each child occupies the same amount of space, i.e. for *n* children
a child occupies *1/n* space.
 
A simple example for a `HorizontalLayout` with two children 
is given below:

<div ng-controller='UiSchemaController as vm' class='example'>
  <listing-control schema='vm.example6.schema' 
                   uischema='vm.example6.uischema' 
                   data='vm.example6.data'>
  </listing-control>
</div>
 
# Vertical
The `VerticalLayout` behaves analogously to th e`HorizontalLayout` but 
orders its children vertically, i.e. the elements will be placed beneath
each other, instead of side-by-side.

An example for a `VerticalLayout` is given below
 
<div ng-controller='UiSchemaController as vm' class='example'>
   <listing-control schema='vm.example7.schema' 
                    uischema='vm.example7.uischema' 
                    data='vm.example7.data'>
   </listing-control>
</div>
 
# Group
A `Group` behaves exactly like a `VerticalLayout`, i.e. its `elements`
will be lay out in a vertical fashion. The difference is, that the 
`Group` also features a `label` property that displays an label above
the elements contained by the Group.

A simple example of a `Group` featuring a `label` can be seen in the 
example below.

<div ng-controller='UiSchemaController as vm' class='example'>
  <listing-control schema='vm.example8.schema' 
                   uischema='vm.example8.uischema' 
                   data='vm.example8.data'>
  </listing-control>
</div>
 
# Categorization
The `Categorization` layout contains elements where each on of them 
specifies a category with the `type` property. A category itself again 
acts as a container, hence it also has an `elements` property. A simple 
example for a Categorization might look as follows.

<div ng-controller='UiSchemaController as vm' class='example'>
  <listing-control schema='vm.example9.schema' 
                   uischema='vm.example9.uischema' 
                   data='vm.example9.data'>
  </listing-control>
</div>

In this example we have two categories, one named 'Pets', the other one 
named 'Cars'. Both contain a single `Control`.
