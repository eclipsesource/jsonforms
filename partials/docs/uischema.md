# UI schema

The UI schema, which is passed into the `jsonforms` directive describes
the general layout of a form and is just a regular JSON object.
It describes the form by means of different elements, which can be 
categorized into `Control`s and `Layout`s. The type of an element
 can be specified via the `type` property.
In this section, we provide a detailed look about the currently available
UI schema elements.

## Control
The most important UI schema element is `Control`. A `Control` is 
specified with the `Control` value. 

## Scope
Furthermore, it must specify a `scope` property, which tells the 
`Control` to which property of the JSON schema it should bind.

For instance, if we have a minimal JSON schema like this:

```
var schema = {
  'properties': { 
    'name': {  'type': 'string' }
   }
};
```

the most basic UI schema would be the following:

```
var uiSchema = {
  'type': 'Control',
  'scope': { '$ref': '#/properties/name' }
};
```

The format of the `scope` property must be an object with a single
property `$ref`, which must be a [JSON Pointer](https://tools.ietf.org/html/rfc6901). 
You can read more about `$refs` [here](https://spacetelescope.github.io/understanding-json-schema/structuring.html).

In the example above, we want the control to bind against the single `name`
property. Below is an example of a rendered control.

![Basic control](./images/docs/uischema.control.png){:.img-responsive}

## Read-only
 
 Controls support a read-only state, which can be enabled with the `readOnly` 
 property within the UI schema. The value of the `readOnly` property
  is a boolean.
 
 ```
 var uiSchema = {
   'type': 'Control',
   'readOnly': true,
   'scope': { '$ref': '#/properties/name' }
 };
 ```
 
 ![Control with Read-only enabled](./images/docs/uischema.control-readonly.png){:.img-responsive}
 


