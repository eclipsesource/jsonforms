/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { JsonFormsModule } from '@jsonforms/angular';
import { AutocompleteControlRenderer } from './controls/autocomplete.renderer';
import { BooleanControlRenderer } from './controls/boolean.renderer';
import { DateControlRenderer } from './controls/date.renderer';
import { NumberControlRenderer } from './controls/number.renderer';
import { RangeControlRenderer } from './controls/range.renderer';
import { TextAreaRenderer } from './controls/textarea.renderer';
import { TextControlRenderer } from './controls/text.renderer';
import { ToggleControlRenderer } from './controls/toggle.renderer';
import { LabelRenderer } from './other/label.renderer';
import { JsonFormsDetailComponent } from './other/master-detail/detail';
import { MasterListComponent } from './other/master-detail/master';
import { ObjectControlRenderer } from './other/object.renderer';
import { TableRenderer } from './other/table.renderer';
import { CategorizationTabLayoutRenderer } from './layouts/categorization-layout.renderer';
import { GroupLayoutRenderer } from './layouts/group-layout.renderer';
import { HorizontalLayoutRenderer } from './layouts/horizontal-layout.renderer';
import { VerticalLayoutRenderer } from './layouts/vertical-layout.renderer';
import { ArrayLayoutRenderer } from './layouts/array-layout.renderer';
import { LayoutChildrenRenderPropsPipe } from './layouts';

@NgModule({
  imports: [
    CommonModule,
    JsonFormsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatTabsModule,
    MatSidenavModule,
    MatListModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    MatTableModule,
    MatToolbarModule,
    MatTooltipModule,
    MatBadgeModule,
  ],
  declarations: [
    BooleanControlRenderer,
    TextAreaRenderer,
    TextControlRenderer,
    NumberControlRenderer,
    RangeControlRenderer,
    DateControlRenderer,
    ToggleControlRenderer,
    VerticalLayoutRenderer,
    HorizontalLayoutRenderer,
    CategorizationTabLayoutRenderer,
    GroupLayoutRenderer,
    LabelRenderer,
    MasterListComponent,
    JsonFormsDetailComponent,
    ObjectControlRenderer,
    AutocompleteControlRenderer,
    TableRenderer,
    ArrayLayoutRenderer,
    LayoutChildrenRenderPropsPipe,
  ],
  entryComponents: [
    BooleanControlRenderer,
    TextAreaRenderer,
    TextControlRenderer,
    NumberControlRenderer,
    RangeControlRenderer,
    DateControlRenderer,
    ToggleControlRenderer,
    VerticalLayoutRenderer,
    HorizontalLayoutRenderer,
    GroupLayoutRenderer,
    LabelRenderer,
    CategorizationTabLayoutRenderer,
    MasterListComponent,
    JsonFormsDetailComponent,
    ObjectControlRenderer,
    AutocompleteControlRenderer,
    TableRenderer,
    ArrayLayoutRenderer,
  ],
  exports: [
    CommonModule,
    JsonFormsModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatInputModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatTabsModule,
    MatSidenavModule,
    MatListModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
})
export class JsonFormsAngularMaterialModule {}
