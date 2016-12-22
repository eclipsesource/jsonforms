---
layout: doc
---
Getting started in 3 simple steps
=================================

1. Include JSON Forms as dependency:
  * Install JSON Forms via `npm install jsonforms`
  * Require JSON Forms via `require('jsonforms')` 
2. Add JSON Forms to your AngularJS app: 
  * Inject the dependency: `var myApp = angular.module('myApp', ['jsonforms', ...])`
  * Update your controller to expose the `schema`, `uiSchema` and `data`
3. Add JSON Forms to your HTML Template:
  * Add the JSON Forms tag and add a jsf class to the enclosing element:     
  * Add styling in the head section: 
  <pre nag-prism class="language-html" source='     
<div class="jsf" ng-controller="YourController as vm">
  <jsonforms schema="vm.schema" uischema="vm.uiSchema" data="vm.data"></jsonforms>
</div>
  '/>
  <pre nag-prism class="language-html" source='
<link rel="stylesheet" type="text/css" href="node_modules/jsonforms/dist/jsonforms.css">  
  '/>

Instead of including JSON Forms in your own app you can also look at a pre-configured sample app we offer. 
In this case please have a look [here](http://github.eclipsesource.com/jsonforms/#/docs/setup) at this article.



