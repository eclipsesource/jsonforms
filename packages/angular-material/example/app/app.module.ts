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
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { Actions, UISchemaTester } from '@jsonforms/core';
import { LocaleValidationModule, TranslationModule } from 'angular-l10n';
import { AppComponent } from './app.component';
import { JsonFormsAngularMaterialModule } from '../../src/module';

import { initialState } from './store';
import { JsonFormsAngularService } from '@jsonforms/angular';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    JsonFormsAngularMaterialModule,
    TranslationModule.forRoot({}),
    LocaleValidationModule.forRoot()
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  constructor(jsonformsService: JsonFormsAngularService) {
    jsonformsService.init(initialState.jsonforms);
    const example = initialState.examples.data[0];
    jsonformsService.updateCore(
      Actions.init(example.data, example.schema, example.uischema)
    );

    const uiSchema = {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/buyer/properties/email'
        },
        {
          type: 'Control',
          scope: '#/properties/status'
        }
      ]
    };
    const itemTester: UISchemaTester = (_schema, schemaPath, _path) => {
      if (schemaPath === '#/properties/warehouseitems/items') {
        return 10;
      }
      return -1;
    };
    jsonformsService.updateUiSchema(
      Actions.registerUISchema(itemTester, uiSchema)
    );
  }
}

/*
Copyright 2017-2018 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
