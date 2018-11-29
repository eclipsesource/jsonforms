import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { IonicSelectableModule } from 'ionic-selectable';
import { JsonFormsModule } from '@jsonforms/angular';
import {
  L10nConfig,
  LocaleValidationModule,
  LocalizationModule,
  TranslationModule
} from 'angular-l10n';

import { BooleanCheckboxControlRenderer } from './controls/boolean/boolean-checkbox-control';
import { BooleanToggleControlRenderer } from './controls/boolean/boolean-toggle-control';
import { StringControlRenderer } from './controls/string/string-control';
import { MultilineControlRenderer } from './controls/string/multiline-control';
import { NumberControlRenderer } from './controls/number/number-control';
import { DateControlRenderer } from './controls/date/date-control';
import { EnumControlRenderer } from './controls/enum/enum-control';
import { RangeControlRenderer } from './controls/range/range-control';

import { HorizontalLayoutRenderer } from './layouts/horizontal/horizontal-layout';
import { VerticalLayoutRenderer } from './layouts/vertical/vertical-layout';
import { CategorizationMenuLayoutRenderer } from './layouts/categorization/categorization-menu-layout';
import { CategoryRenderer } from './layouts/categorization/category/category';
import { GroupLayoutRenderer } from './layouts/group/group-layout';

import { ListWithDetailControl } from './other/list-with-detail/list-with-detail-control';
import { MasterPage } from './other/list-with-detail/pages/master/master';
import { DetailPage } from './other/list-with-detail/pages/detail/detail';
import { LabelRenderer } from './other/label/label';
import { CategorizationTabLayoutRenderer } from './layouts/categorization/categorization-tab-layout';
import { AutoCompleteControlRenderer } from './controls/enum/autocomplete-control';
import { ObjectControlRenderer } from './controls/object/object.control';

const emptyL10NConfig: L10nConfig = {};

@NgModule({
  declarations: [
    // controls
    BooleanCheckboxControlRenderer,
    BooleanToggleControlRenderer,
    StringControlRenderer,
    MultilineControlRenderer,
    NumberControlRenderer,
    DateControlRenderer,
    EnumControlRenderer,
    RangeControlRenderer,
    AutoCompleteControlRenderer,
    ObjectControlRenderer,

    // layouts
    HorizontalLayoutRenderer,
    VerticalLayoutRenderer,
    CategorizationTabLayoutRenderer,
    CategorizationMenuLayoutRenderer,
    CategoryRenderer,
    GroupLayoutRenderer,

    // ListWithDetail components
    ListWithDetailControl,
    MasterPage,
    DetailPage,

    // other
    LabelRenderer
  ],
  imports: [
    IonicModule,
    IonicSelectableModule,
    JsonFormsModule,
    LocalizationModule,
    LocaleValidationModule.forRoot(),
    TranslationModule.forRoot(emptyL10NConfig)
  ],
  exports: [
    IonicModule,
    IonicSelectableModule,
    JsonFormsModule,
    LocalizationModule,
    LocaleValidationModule,
    TranslationModule
  ],
  entryComponents: [
    // controls
    BooleanCheckboxControlRenderer,
    BooleanToggleControlRenderer,
    StringControlRenderer,
    MultilineControlRenderer,
    NumberControlRenderer,
    DateControlRenderer,
    EnumControlRenderer,
    RangeControlRenderer,
    AutoCompleteControlRenderer,
    ObjectControlRenderer,

    // layouts
    HorizontalLayoutRenderer,
    VerticalLayoutRenderer,
    CategorizationMenuLayoutRenderer,
    CategorizationTabLayoutRenderer,
    CategoryRenderer,
    GroupLayoutRenderer,

    // ListWithDetail components
    ListWithDetailControl,
    MasterPage,
    DetailPage,

    // other
    LabelRenderer
  ],
  providers: []
})
export class JsonFormsIonicModule {}
