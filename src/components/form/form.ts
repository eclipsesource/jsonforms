
import * as angular from 'angular';
import rendererService from '../renderers/renderer.service';
import pathResolver from '../ng-services/path-resolver/path-resolver.service';
import uiSchemaRegistry from '../ng-services/ui-schema-registry/ui-schema-registry.service';
import rootDataService from '../ng-services/data/data.service';
import generators from '../generators/generators';
import uiSchemaGenerator from '../generators/ui-schema-gen.service';
import schemaGenerator from '../generators/schema-gen.service';

import layoutDirective from '../renderers/layouts/layout.directive';
import controlDirective from '../renderers/controls/control.directive';

import categorizationDirective from '../renderers/layouts/categories/categorization.directive';

import verticalLayoutDirective from '../renderers/layouts/vertical/vertical.directive';
import horizontalLayoutDirective from '../renderers/layouts/horizontal/horizontal.directive';
import masterDetailDirectives from '../renderers/layouts/masterdetail/masterdetail.directives';
import groupLayoutDirective from '../renderers/layouts/group/group.directive';

import labelDirective from '../renderers/extras/label/label.directive';

import stringControlDirective from '../renderers/controls/string/string.directive';
import integerControlDirective from '../renderers/controls/integer/integer.directive';
import numberControlDirective from '../renderers/controls/number/number.directive';
import booleanControlDirective from '../renderers/controls/boolean/boolean.directive';
import arrayControlDirective from '../renderers/controls/array/array.directive';
import referenceControlDirective from '../renderers/controls/reference/reference.directive';
import datetimeControlDirective from '../renderers/controls/datetime/datetime.directive';
import enumControlDirective from '../renderers/controls/enum/enum.directive';
import formsDirective from '../form/form.directive';

import baseControl from '../renderers/controls/abstract-control';

import testers from '../renderers/testers';

import norendererDirective from '../renderers/norenderer-directive';

export default angular
    .module('jsonforms.form', [
        rendererService,
        pathResolver,
        uiSchemaRegistry,
        rootDataService,
        generators,
        uiSchemaGenerator,
        schemaGenerator,

        formsDirective,

        controlDirective,
        layoutDirective,
        norendererDirective,
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

        baseControl,
        testers
    ])
    .name;
