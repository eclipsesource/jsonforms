
import * as angular from 'angular';
import rendererService from '../renderers/renderer-service';
import templateService from '../renderers/template-service';
import pathResolver from '../ng-services/pathresolver/pathresolver-service';
import generators from '../generators/generators';
import uiSchemaGenerator from '../generators/jsonforms-uischemagenerator';
import schemaGenerator from '../generators/jsonforms-schemagenerator';

import layoutDirective from '../renderers/layouts/layout-directive';
import controlDirective from '../renderers/controls/controls-directive';

import categorizationDirective from '../renderers/layouts/categories/categorization-directive';

import verticalLayoutDirective from '../renderers/layouts/vertical/vertical-directive';
import horizontalLayoutDirective from '../renderers/layouts/horizontal/horizontal-directive';
import masterDetailDirectives from '../renderers/layouts/masterdetail/masterdetail-directives';
import groupLayoutDirective from '../renderers/layouts/group/group-directive';

import labelDirective from '../renderers/extras/label/label-directive';

import stringControlDirective from '../renderers/controls/string/string-directive';
import integerControlDirective from '../renderers/controls/integer/integer-directive';
import numberControlDirective from '../renderers/controls/number/number-directive';
import booleanControlDirective from '../renderers/controls/boolean/boolean-directive';
import arrayControlDirective from '../renderers/controls/array/array-directive';
import referenceControlDirective from '../renderers/controls/reference/reference-directive';
import datetimeControlDirective from '../renderers/controls/datetime/datetime-directive';
import enumControlDirective from '../renderers/controls/enum/enum-directive';

import {JsonFormsDirective, JsonFormsInnerDirective} from './form-directive';

export default angular
    .module('jsonforms.form', [
        rendererService,
        templateService,
        pathResolver,
        generators,
        uiSchemaGenerator,
        schemaGenerator,

        controlDirective,
        layoutDirective,

        arrayControlDirective,
        stringControlDirective,
        integerControlDirective,
        numberControlDirective,
        booleanControlDirective,
        enumControlDirective,
        referenceControlDirective,
        datetimeControlDirective,

        labelDirective,

        groupLayoutDirective,
        verticalLayoutDirective,
        horizontalLayoutDirective,
        categorizationDirective,
        masterDetailDirectives,

    ])
    .directive('jsonforms', () => new JsonFormsDirective())
    .directive('jsonformsInner', () => new JsonFormsInnerDirective())
    .name;
