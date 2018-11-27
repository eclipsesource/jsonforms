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
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatTabsModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JsonFormsModule } from '@jsonforms/angular';
import {
  L10nConfig,
  LocaleValidationModule,
  LocalizationModule,
  TranslationModule
} from 'angular-l10n';
import {
  AutocompleteControlRenderer,
  BooleanControlRenderer,
  DateControlRenderer,
  NumberControlRenderer,
  RangeControlRenderer,
  TextAreaRenderer,
  TextControlRenderer,
  ToggleControlRenderer
} from './controls';
import {
  JsonFormsDetailComponent,
  LabelRenderer,
  MasterListComponent,
  ObjectControlRenderer
} from './other';
import {
  CategorizationTabLayoutRenderer,
  GroupLayoutRenderer,
  HorizontalLayoutRenderer,
  VerticalLayoutRenderer
} from './layouts';

const emptyL10NConfig: L10nConfig = {};

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
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    LocalizationModule,
    LocaleValidationModule.forRoot(),
    TranslationModule.forRoot(emptyL10NConfig)
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
    AutocompleteControlRenderer
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
    AutocompleteControlRenderer
  ],
  exports: [
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
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    LocalizationModule,
    LocaleValidationModule,
    TranslationModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: []
})
export class JsonFormsAngularMaterialModule {
}
