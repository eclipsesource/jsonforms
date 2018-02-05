import { NgModule } from '@angular/core';

import { TextControlRenderer } from './text.renderer';
import { FORM_RENDERER, JsonFormsOutlet } from './jsonforms.component';
@NgModule({
  declarations: [
    JsonFormsOutlet
  ],
  imports: [
  ],
  exports: [],
  providers: [{provide: FORM_RENDERER, multi: true, useClass: TextControlRenderer }, ],
})
export class JsonFormsModule { }
