import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { ControlElement, Generate, INIT,
    JsonForms, jsonformsReducer, JsonFormsState, JsonFormsStore, VALIDATE } from '@jsonforms/core';
import { AppComponent } from './app.component';
import { JsonFormsModule } from '../../src';
import { TextControlRenderer } from './text.renderer';
import { VerticalLayoutRenderer } from './vetical-layout.renderer';

import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

export const schema = {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 5
      },
      description: {
        type: 'string'
      },
      done: {
        type: 'boolean'
      }
    },
    required: ['name']
  };

export const uischema: ControlElement = undefined;

export const data = {
    name: 'Send email to Adrian',
    description: 'Confirm if you have passed the subject\nHereby ...',
    done: true,
  };

export const store: JsonFormsStore = createStore(
    jsonformsReducer(),
    {
      jsonforms: {
        common: {
          data: data,
          schema: schema,
          uischema: uischema
        },
        renderers: JsonForms.renderers,
        fields: JsonForms.fields
      }
    },
    applyMiddleware(thunk)
  );

@NgModule({
  declarations: [
    AppComponent, TextControlRenderer, VerticalLayoutRenderer
  ],
  imports: [
    BrowserModule,
    JsonFormsModule
  ],
  entryComponents: [
    TextControlRenderer, VerticalLayoutRenderer
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(ngRedux: NgRedux<JsonFormsState>) {
    ngRedux.provideStore(store);
    ngRedux.dispatch({
      type: INIT,
      data,
      schema,
      uischema: uischema || Generate.uiSchema(schema)
    });
    ngRedux.dispatch({
      type: VALIDATE,
      data
    });
  }
}

/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
