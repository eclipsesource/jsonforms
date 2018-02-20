import { NgModule } from '@angular/core';
import { NgReduxModule } from '@angular-redux/store';

import { JsonFormsOutlet } from './jsonforms.component';
import { UnknownRenderer } from './unknown.component';
@NgModule({
  declarations: [
    JsonFormsOutlet, UnknownRenderer
  ],
  entryComponents: [
    UnknownRenderer
  ],
  imports: [NgReduxModule],
  exports: [JsonFormsOutlet],
  providers: [],
})
export class JsonFormsModule {
}
