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
import { NgRedux } from '@angular-redux/store';
import { MockNgRedux } from '@angular-redux/store/testing';
import { booleanTest } from '@jsonforms/angular-test';
import { Checkbox, IonicModule, Label, Platform } from 'ionic-angular';
import { BooleanControlRenderer } from '../src';
import { PlatformMock } from '../test-config/mocks-ionic';

const imports = [IonicModule.forRoot(BooleanControlRenderer)];
const providers = [
    { provide: Platform, useClass: PlatformMock },
    { provide: NgRedux, useFactory: MockNgRedux.getInstance }
];
const componentUT: any = BooleanControlRenderer;
const errorTest = {errorInstance: Label, numberOfElements: 2, indexOfElement: 1};

describe('Boolean control',
         booleanTest(imports, providers, componentUT, Checkbox, errorTest, 'button'));
