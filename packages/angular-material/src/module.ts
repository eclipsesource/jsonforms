import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { JsonFormsModule } from '@jsonforms/angular';
import { TextControlRenderer } from './controls/text.renderer';
import { VerticalLayoutRenderer } from './layouts/vertical-layout.renderer';
@NgModule({
  imports: [
    CommonModule, JsonFormsModule, MatFormFieldModule, MatInputModule, BrowserAnimationsModule
  ],
  declarations: [
    TextControlRenderer, VerticalLayoutRenderer
  ],
  entryComponents: [
    TextControlRenderer, VerticalLayoutRenderer
  ]
})
export class JsonFormsAngularMaterialModule {
}
