///<reference path="./references.ts"/>

angular.module('jsonforms-material', [
    'jsonforms',
    'jsonforms.renderers',
    'jsonforms-material.renderers.layouts',
    'jsonforms-material.renderers.layouts.categories',
    'jsonforms-material.renderers.layouts.categories.categorization',
    'jsonforms-material.renderers.layouts.categories.category',
    'jsonforms-material.renderers.layouts.group',
    'jsonforms-material.renderers.layouts.vertical',
    'jsonforms-material.renderers.layouts.horizontal',
    'jsonforms-material.renderers.controls',
    //'jsonforms-material.renderers.controls.array',
    'jsonforms-material.renderers.controls.boolean',
    'jsonforms-material.renderers.controls.datetime',
    'jsonforms-material.renderers.controls.enum',
    'jsonforms-material.renderers.controls.integer',
    'jsonforms-material.renderers.controls.number',
    //'jsonforms-material.renderers.controls.reference',
    'jsonforms-material.renderers.controls.string',
]);
