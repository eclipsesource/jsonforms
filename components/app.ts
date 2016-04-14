import * as angular from 'angular'

import '../node_modules/bootstrap/less/bootstrap.less'
import form from '../components/form/form'
require('angular-bootstrap');
//require('angular-ui-bootstrap');
require('angular-ui-validate');

declare var ON_TEST;
declare var require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};

if (ON_TEST) {
    require('angular-mocks/angular-mocks');
}

angular.module('jsonforms', [
    // TODO
    'ui.bootstrap',
    'ui.validate',
    form
    //'jsonforms.generators',
    //'jsonforms.generators.schema',
    //'jsonforms.generators.uischema',
    //'jsonforms.pathresolver',
    //'jsonforms.renderers',
    //'jsonforms.renderers.controls',
    //'jsonforms.renderers.controls.array',
    //'jsonforms.renderers.controls.integer',
    //'jsonforms.renderers.controls.boolean',
    //'jsonforms.renderers.controls.reference',
    //'jsonforms.renderers.controls.string',
    //'jsonforms.renderers.controls.number',
    //'jsonforms.renderers.controls.datetime',
    //'jsonforms.renderers.controls.enum',
    //'jsonforms.renderers.layouts',
    //'jsonforms.renderers.layouts.vertical',
    //'jsonforms.renderers.layouts.horizontal',
    //'jsonforms.renderers.layouts.categories',
    //'jsonforms.renderers.layouts.categories.categorization',
    //'jsonforms.renderers.layouts.categories.category',
    //'jsonforms.renderers.extras.label',
    //'jsonforms.renderers.layouts.masterdetail',
    //'jsonforms.filters.capitalize'
]);
