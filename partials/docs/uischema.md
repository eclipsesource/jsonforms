---
layout: doc
---
# UI SCHEMA

The UI schema, which is passed into the `jsonforms` directive describes
the general layout of a form and is just a regular JSON object.
It describes the form by means of different elements, which can be
categorized into `Control`s and `Layout`s. The type of an element
 can be specified via the `type` property.
In this section, we provide a detailed look about the currently available
UI schema elements.

## Controls
The most important UI schema element is `Control`. A `Control` is
specified with the `Control` value.

#### Scope
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

The most basic UI schema would be the following:

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

### Read-only

Controls support a read-only state, which can be enabled with the `readOnly` property within the UI schema. The value of the `readOnly` property is a boolean.

```
var uiSchema = {
  'type': 'Control',
  'readOnly': true,
  'scope': { '$ref': '#/properties/name' }
};
```

![Control with Read-only enabled](./images/docs/uischema.control-readonly.png){:.img-responsive}


### Options
Certain renderers support additional configuration options which are
only available for certain renderers. Those options should be put
into a `options` property. We'll describe all available `options` in
the following section.

## Enum controls
A `enum` property within a JSON schema will be rendered with a dropdown
 menu by default. Here's an example schema and UI schema:

```
   var schema = {
         'properties': {
             'some': {
                 'type': 'string',
                 'enum': ['foo', 'bar']
             }
         }
   };
   var uischema = {
         'type': 'Control',
         'scope': {'$ref': '#/properties/some'}
   };

```

The rendered form looks as follows:
![Rendered enum control](./images/docs/uischema.control.enum.png){:.img-responsive}


## Array controls
Controls binding to arrays support different types of rendering modes.
We'll use the following schema an UI schema to demonstrate the different modes:

```
var schema = {
            'properties': {
                'comments': {
                    'type': 'array',
                    'items': {
                        'properties': {
                            'message': {'type': 'string'}
                        }
                    }
                }
            }
        }
var uischema = {
  'type': 'Control',
  'scope': { '$ref': '#/properties/comments' }
};

```

The rendered result is displayed below:
![Rendered array control](./images/docs/uischema.control.array.png){:.img-responsive}

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

![Array control without submit option](./images/docs/uischema.control.array.nosubmit.png){:.img-responsive}

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
