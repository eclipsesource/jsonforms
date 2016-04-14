///<reference path="../references.ts"/>

import * as angular from 'angular'
import renderServices from '../renderers/renderers-service'
import pathResolver from '../ng-services/pathresolver/pathresolver-service'
import generators from '../generators/generators'
import uiSchemaGenerator from '../generators/uischema/uischema-service'
import schemaGenerator from '../generators/schema/schema-service'

import renderersDirective from '../renderers/renderers-directive'
import layoutDirective from '../renderers/layouts/layout-directive'
import controlDirective from '../renderers/controls/controls-directive'

import categories from '../renderers/layouts/categories/categories'
import categorization from '../renderers/layouts/categories/categorization/categorization-renderer'
import category from '../renderers/layouts/categories/category/category-renderer'
import verticalLayout from '../renderers/layouts/vertical/vertical-renderer'
import horizontalLayout from '../renderers/layouts/horizontal/horizontal-renderer'
import masterDetail from '../renderers/layouts/masterdetail/masterdetail'
import masterDetailDirectives from '../renderers/layouts/masterdetail/masterdetail-directives'
import masterDetailLayout from '../renderers/layouts/masterdetail/masterdetail-renderer'
import groupLayout from '../renderers/layouts/group/group-renderer'

import label from '../renderers/extras/label/label-renderer'

import stringControl from '../renderers/controls/string/string-renderer'
import integerControl from '../renderers/controls/integer/integer-renderer'
import numberControl from '../renderers/controls/number/number-renderer'
import booleanControl from '../renderers/controls/boolean/boolean-renderer'
import arrayControl from '../renderers/controls/array/array-renderer'

import {JsonFormsDirective} from "./form-directive";

export default angular.module('jsonforms.form', [
    renderServices,
    pathResolver,
    generators,
    uiSchemaGenerator,
    schemaGenerator,

    renderersDirective,
    controlDirective,
    layoutDirective,

    arrayControl,
    stringControl,
    integerControl,
    numberControl,
    booleanControl,

    label,

    groupLayout,
    verticalLayout,
    horizontalLayout,
    categories,
    categorization,
    category,
    masterDetail,
    masterDetailDirectives,
    masterDetailLayout


    //'jsonforms.generators.schema',
    //'jsonforms.generators.uischema',
    //'jsonforms.pathresolver',
    //'jsonforms.renderers',
    //'jsonforms.renderers.controls',
    //'jsonforms.renderers.controls.array',
    //'jsonforms.renderers.controls.integer',
    //'jsonforms.renderers.controls.boolean',
    //'jsonforms.renderers.controls.string',
    //'jsonforms.renderers.controls.number',
    //'jsonforms.renderers.controls.datetime',
    //'jsonforms.renderers.controls.enum',
    //'jsonforms.renderers.layouts',
    //'jsonforms.renderers.layouts.group',
    //'jsonforms.renderers.layouts.horizontal',
    //'jsonforms.renderers.layouts.categories',
    //'jsonforms.renderers.layouts.categories.categorization',
    //'jsonforms.renderers.layouts.categories.category',
    //'jsonforms.renderers.extras.label'
]).directive('jsonforms', () => new JsonFormsDirective())
    .name;
