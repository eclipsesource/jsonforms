# Migrating from JSON Forms 1.x (AngluarJS)
The complexity of the migration of an existing JSON Forms 1.x application, which is based on AngularJS, to JSON Forms 2.x depends on the feature set you use.

## Architectural changes in JSON Forms 2.x
There are two big changes between JSON Forms 1 and JSON Forms 2 you need to understand when migrating your existing application.

1. JSON Forms 2.x does not rely on any specific UI framework [or library]. The `2.0.0` initial release features renderers based on [React](https://reactjs.org). An [Angular](https://angular.io) based renderer set will be be released with `2.1.0`.

2. Since JSON Forms 2.x maintains its internal state via [redux](https://redux.js.org/), you will need to add it as a dependency to your application.

## Steps for upgrading your application to JSON Forms 2.x

### Step 1: Update your UI schemata
There is only one minor change in the UI schemata. The UI Schema for controls was simplified and the bulky `ref` object inside `scope` was removed.

Instead of:
```ts
const uischema = {
    type: 'Control',
    scope: {
        $ref: '#/properties/name'
    }
}
```
simply write:
```ts
const uischema = {
    type: 'Control',
    scope: '#/properties/name'
}
```
Otherwise the UI schema remains unchanged and works like in JSON Forms 1.x.

### Step 2: Use JSON Forms 2.x in your application
As JSON Forms 2 does not rely on any specific UI framework or library you can use it either natively or you can use it as a [WebComponent](https://www.webcomponents.org/introduction). 

#### Native use with React
Please refer to the React [Tutorial](http://jsonforms.io/docs/tutorial).

#### WebComponent use
You can use the [WebComponent](https://www.webcomponents.org/introduction) wrapper that is provided by JSON Forms 2.x. The Webcomponent will supply the `json-forms` tag and needs to be supplied with your data, JSON Schema and UI Schema as part of a  [Redux Store](https://redux.js.org/docs/api/Store.html):
```ts
import { combineReducers, createStore } from 'redux';
import { JsonFormsElement } from '@jsonforms/webcomponent';
import { jsonformsReducer } from '@jsonforms/core';
import { materialFields, materialRenderers } from '@jsonforms/material';
const jsonForms = document.createElement('json-forms') as JsonFormsElement;
jsonForms.store = createStore(
    combineReducers({
        jsonforms: jsonformsReducer()
    }),
    {
        jsonforms: {
            core: {
                data,
                schema,
                uischema
            },
            materialRenderers,
            materialFields
        }
    }
);
body.appendChild(jsonForms);
```
This snippet instantiates the JSON Forms WebComponent and passes in the redux store which consists of the jsonformsReducer and the initial state with the default Material renderers.

Custom renderers can be added either through the initial state or registered explicitly as shown in the [Day 6 example](packages/examples/src/day6.ts).

## Step 3: Migrate Custom Renderers
Any custom renderer need to be re-factored to conform to the new custom renderer style in JSON Forms 2.x. You can find instructions how to implement Custom controls based on React [here](http://jsonforms.io/docs/custom-renderers). While you need to change a lot except for the template, the good news it that writing custom renderers became much simpler in JSON Forms 2 since the framework will trigger rendering and re-rendering in case of changes to the data or other state. In many cases this means you will be able to streamline your code for custom renderers significantly.
