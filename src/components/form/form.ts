
import * as angular from 'angular'
import renderServices from '../renderers/renderers-service'
import pathResolver from '../ng-services/pathresolver/pathresolver-service'
import generators from '../generators/generators'
import uiSchemaGenerator from '../generators/jsonforms-uischemagenerator'
import schemaGenerator from '../generators/jsonforms-schemagenerator'

import renderersDirective from '../renderers/renderers-directive'
import layoutDirective from '../renderers/layouts/layout-directive'
import controlDirective from '../renderers/controls/controls-directive'

import categories from '../renderers/layouts/categories/categories'
import categorization from '../renderers/layouts/categories/categorization/categorization-renderer'
import category from '../renderers/layouts/categories/category/category-renderer'
import categorizationDirective from '../renderers/layouts/categories/categorization/categorization-directive'

import verticalLayout from '../renderers/layouts/vertical/vertical-renderer'
import verticalLayoutDirective from '../renderers/layouts/vertical/vertical-directive'
import horizontalLayout from '../renderers/layouts/horizontal/horizontal-renderer'
import horizontalLayoutDirective from '../renderers/layouts/horizontal/horizontal-directive'
import masterDetailDirectives from '../renderers/layouts/masterdetail/masterdetail-directives'
import masterDetailLayout from '../renderers/layouts/masterdetail/masterdetail-renderer'
import groupLayout from '../renderers/layouts/group/group-renderer'
import groupLayoutDirective from '../renderers/layouts/group/group-directive'

import label from '../renderers/extras/label/label-renderer'
import labelDirective from '../renderers/extras/label/label-directive';

import stringControl from '../renderers/controls/string/string-renderer'
import stringControlDirective from '../renderers/controls/string/string-directive'
import integerControl from '../renderers/controls/integer/integer-renderer'
import integerControlDirective from '../renderers/controls/integer/integer-directive'
import numberControl from '../renderers/controls/number/number-renderer'
import numberControlDirective from '../renderers/controls/number/number-directive'
import booleanControl from '../renderers/controls/boolean/boolean-renderer'
import booleanControlDirective from '../renderers/controls/boolean/boolean-directive'
import arrayControl from '../renderers/controls/array/array-renderer'
import arrayControlDirective from '../renderers/controls/array/array-directive'
import referenceControl from '../renderers/controls/reference/reference-renderer'
import referenceControlDirective from '../renderers/controls/reference/reference-directive'
import datetimeControl from '../renderers/controls/datetime/datetime-renderer'
import datetimeControlDirective from '../renderers/controls/datetime/datetime-directive'
import enumControl from '../renderers/controls/enum/enum-renderer'
import enumControlDirective from '../renderers/controls/enum/enum-directive';

import {JsonFormsDirective,JsonFormsInnerDirective} from "./form-directive";

export default angular
    .module('jsonforms.form', [
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
        enumControl,
        referenceControl,
        datetimeControl,

        label,

        groupLayout,
        verticalLayout,
        horizontalLayout,
        categories,
        categorization,
        category,
        masterDetailDirectives,
        masterDetailLayout,

        verticalLayoutDirective,
        stringControlDirective,
        integerControlDirective,
        numberControlDirective,
        enumControlDirective,
        booleanControlDirective,
        datetimeControlDirective,
        labelDirective,
        referenceControlDirective,
        arrayControlDirective,
        horizontalLayoutDirective,
        groupLayoutDirective,
        categorizationDirective
    ])
    .directive('jsonforms',() => new JsonFormsDirective())
    .directive('jsonformsInner',() => new JsonFormsInnerDirective())
    .name;
