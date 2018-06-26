import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { JsonFormsModule } from '@jsonforms/angular';

import { BooleanControlRenderer } from './controls/boolean/boolean-control';
import { StringControlRenderer } from './controls/string/string-control';
import { NumberControlRenderer } from './controls/number/number-control';
import { DateControlRenderer } from './controls/date/date-control';
import { EnumControlRenderer } from './controls/enum/enum-control';

import { HorizontalLayoutRenderer } from './layouts/horizontal/horizontal-layout';
import { VerticalLayoutRenderer } from './layouts/vertical/vertical-layout';
import { CategorizationLayoutRenderer } from './layouts/categorization/categorization-layout';
import { CategoryRenderer } from './layouts/categorization/category/category';
import { GroupLayoutRenderer } from './layouts/group/group-layout';

import { MasterDetailComponent } from './other/master-detail/master-detail';
import { PlaceholderPage } from './other/master-detail/pages/placeholder/placeholder';
import { MasterPage } from './other/master-detail/pages/master/master';
import { DetailPage } from './other/master-detail/pages/detail/detail';
import { LabelRenderer } from './other/label/label';

@NgModule({
  declarations: [
    // controls
    BooleanControlRenderer,
    StringControlRenderer,
    NumberControlRenderer,
    DateControlRenderer,
    EnumControlRenderer,

    // layouts
    HorizontalLayoutRenderer,
    VerticalLayoutRenderer,
    CategorizationLayoutRenderer,
    CategoryRenderer,
    GroupLayoutRenderer,

    // Master Detail components
    MasterDetailComponent,
    PlaceholderPage,
    MasterPage,
    DetailPage,

    // other
    LabelRenderer
  ],
  imports: [
    IonicModule,
    JsonFormsModule
  ],
  exports: [

    // controls
    StringControlRenderer,
    NumberControlRenderer,
    DateControlRenderer,
    EnumControlRenderer,

    // layouts
    HorizontalLayoutRenderer,
    VerticalLayoutRenderer,
    CategorizationLayoutRenderer,
    CategoryRenderer
  ],
  entryComponents: [
    // controls
    BooleanControlRenderer,
    StringControlRenderer,
    NumberControlRenderer,
    DateControlRenderer,
    EnumControlRenderer,

    // layouts
    HorizontalLayoutRenderer,
    VerticalLayoutRenderer,
    CategorizationLayoutRenderer,
    CategoryRenderer,
    GroupLayoutRenderer,

    // Master Detail components
    MasterDetailComponent,
    PlaceholderPage,
    MasterPage,
    DetailPage,

    // other
    LabelRenderer
  ],
  providers: [
  ]
})
export class JsonFormsIonicModule {}
