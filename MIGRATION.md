# Migrating from JSON Forms 1.x (AngularJS 1.x)
The complexity of the migration of an existing JSON Forms 1.x application, which is based on AngularJS, to JSON Forms 2.x depends on the feature set you use.

## Architectural changes in JSON Forms 2.x
There are two big changes between JSON Forms 1 and JSON Forms 2 you need to understand when migrating your existing application.

1. JSON Forms 2.x does not rely on any specific UI framework [or library]. The `2.0.0` initial release featured renderers based on [React](https://reactjs.org). An [Angular](https://angular.io) based renderer set was released with `2.1.0`.

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
As JSON Forms 2 does not rely on any specific UI framework or library you can choose which renderer set you want to use. The React Material renderer set is the most polished one at the moment, followed by Angular Material and the Vanilla renderer sets.

#### Use with React
Please refer to the React [Tutorial](http://jsonforms.io/docs/tutorial).

## Step 3: Migrate Custom Renderers
Any custom renderer needs to be re-factored to conform to the new custom renderer style in JSON Forms 2.x. You can find instructions how to implement Custom controls based on React [here](http://jsonforms.io/docs/custom-renderers). While you need to change a lot except for the template, the good news it that writing custom renderers became much simpler in JSON Forms 2 since the framework will trigger rendering and re-rendering in case of changes to the data or other state. In many cases this means you will be able to streamline your code for custom renderers significantly.
