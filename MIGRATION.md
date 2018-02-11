# Migrating from JSONForms 1 (AngluarJS)
The complexity of the migration of an existing JSONForms 1 application, which is based on AngularJS, to JSONForms 2 depends on the feature set you use.

## Main Features of JSONForms 2
There are two big changes between JSONForms 1 and JSONForms 2 you need to understand when migrating your existing application.

1. JSONForms 2 uses [redux](https://redux.js.org/) in order to maintain the state. Your application will need to add redux as a dependency.

2. JSONForms 2 does not rely on any specific ui framework. The `2.0.0` release only provides renderers based on [React](https://reactjs.org) but we are working on an [Angular](https://angular.io) renderer-set for `2.1.0`.

## Breaking changes for declarative files
The UISchema for controls was simplified and the unneeded `ref` object inside `scope` was removed.
So instead of:
```ts
const uischema = {
    type: 'Control',
    scope: {
        $ref: '#/properties/name'
    }
}
```
the UISchema is now:
```ts
const uischema = {
    type: 'Control',
    scope: '#/properties/name'
}
```
Otherwise all elements were kept and work as they used to in JSONForms 1.

## Migrating Custom Renderers
If you have custom renderers then you will have to reimplement them.
You can find the react based tutorial [here](http://jsonforms.io/docs/custom-renderers).

## Using JSONForms 2
As JSONForms 2 does not rely on any specific ui framework you can use it either nativily, as shown for React in the [Tutorial](http://jsonforms.io/docs/tutorial), or you can use the [WebComponent](https://www.webcomponents.org/introduction) that is provided. 

1. Please first check the [Breaking changes for declarative files](#breaking-changes-for-declarative-files) before continuing.
2. Now you can simply use the JSONForms 2 Webcomponent `json-forms` and pass in your data, JsonSchema and UISchema.
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

This snippet instantiates the JSONForms WebComponent and passes in the redux store which consists of the jsonformsReducer and the initial state with the default Material renderers.

Custom renderers can be added either through the initial state or registered explicitly as shown in the [Day 6 example](packages/examples/src/day6.ts).