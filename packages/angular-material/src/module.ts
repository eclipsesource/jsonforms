import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsonFormsModule } from '@jsonforms/angular';

import { TextControlRenderer } from './controls/text.renderer';
import { VerticalLayoutRenderer } from './layouts/vertical-layout.renderer';
@NgModule({
  imports: [
    CommonModule, JsonFormsModule
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
