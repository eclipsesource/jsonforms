/*
  The MIT License
  
  Copyright (c) 2018 EclipseSource Munich
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
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { JsonFormsModule } from '@jsonforms/angular';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatTabsModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  BooleanControlRenderer,
  DateControlRenderer,
  NumberControlRenderer,
  RangeControlRenderer,
  TextAreaRenderer,
  TextControlRenderer,
  ToggleControlRenderer
} from './controls';
import { LabelRenderer } from './other';
import {
  CategorizationTabLayoutRenderer,
  HorizontalLayoutRenderer,
  VerticalLayoutRenderer
} from './layouts';
import { MasterListComponent } from './other/master-detail/master';
import { JsonFormsDetailComponent } from './other/master-detail/detail';
import { GroupLayoutRenderer } from './layouts/group-layout.renderer';
import { MasterDetailService } from './other/master-detail/master-detail.service';

@NgModule({
  imports: [
    BrowserAnimationsModule,
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
    JsonFormsDetailComponent
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
    JsonFormsDetailComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    MasterDetailService
  ]
})
export class JsonFormsAngularMaterialModule {
}
