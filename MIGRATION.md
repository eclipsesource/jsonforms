# Migrating from JSON Forms 1 (AngluarJS)
The complexity of the migration of an existing JSON Forms 1 application, which is based on AngularJS, to JSON Forms 2 depends on the feature set you use.

## Main Features of JSON Forms 2
There are two big changes between JSON Forms 1 and JSON Forms 2 you need to understand when migrating your existing application.

1. Since JSON Forms 2 maintains its internal state via [redux](https://redux.js.org/), you will need to add it as a dependency to your application.

2. JSON Forms 2 does not rely on any specific UI framework [or library]. The `2.0.0` initial release features renderers based on [React](https://reactjs.org). An [Angular](https://angular.io) based renderer set will be be released with `2.1.0`.

## Breaking changes for declarative files
The UISchema for controls was simplified and the unneeded `ref` object inside `scope` was removed.
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
Otherwise all elements were kept and work as they used to in JSON Forms 1.

## Migrating Custom Renderers
Any custom renderer need to be re-implemented. You can find instructions how to implement Custom controls based on React here.
You can find the react based tutorial [here](http://jsonforms.io/docs/custom-renderers).

## Using JSON Forms 2
As JSON Forms 2 does not rely on any specific UI framework or library you can use it either natively, as shown for React in the [Tutorial](http://jsonforms.io/docs/tutorial), or you can use the [WebComponent](https://www.webcomponents.org/introduction) wrapper that is provided. 

1. Please first check the [Breaking changes for declarative files](#breaking-changes-for-declarative-files) before continuing.
2. Now you can use the JSON Forms 2 Webcomponent `json-forms` and pass in your data, JSON Schema and UI Schema as part of a  [Redux Store](https://redux.js.org/docs/api/Store.html).
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
