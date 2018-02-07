import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { Actions, JsonFormsState } from '@jsonforms/core';
import { AppComponent } from './app.component';
import { JsonFormsModule } from '@jsonforms/angular';
import { JsonFormsAngularMaterialModule } from '../../src/module';

import { data, schema, store, uischema } from './store';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    JsonFormsModule,
    JsonFormsAngularMaterialModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(ngRedux: NgRedux<JsonFormsState>) {
    ngRedux.provideStore(store);
    ngRedux.dispatch(Actions.init(
      data,
      schema,
      uischema
    ));
  }
}

/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
