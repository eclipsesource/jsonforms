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
import { initAndExpect } from '@jsonforms/angular-test';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule, Label, Platform } from 'ionic-angular';
import { By } from '@angular/platform-browser';
import { JsonSchema, LabelElement } from '@jsonforms/core';
import { LabelRenderer, labelTester } from '../src';
import { PlatformMock } from '../test-config/mocks-ionic';

const data = {};
const schema: JsonSchema = {
  type: 'object',
  properties: {
    foo: {
      type: 'string'
    }
  }
};
const uischema: LabelElement = {
  type: 'Label',
  text: 'FooBar'
};

describe('Ionic label field tester', () => {
  it('should succeed', () => {
    expect(labelTester(uischema, schema)).toBe(4);
  });
});

describe('Ionic label base tests', () => {
  let fixture: ComponentFixture<LabelRenderer>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabelRenderer],
      imports: [IonicModule.forRoot(LabelRenderer)],
      providers: [
        { provide: Platform, useClass: PlatformMock },
        { provide: NgRedux, useFactory: MockNgRedux.getInstance }
      ]
    }).compileComponents();

    MockNgRedux.reset();
    fixture = TestBed.createComponent(LabelRenderer);
  });

  it('should render', () => {
    initAndExpect(fixture, { uischema, schema, data }, () => {
      expect(
        fixture.debugElement
          .query(By.directive(Label))
          .nativeElement.innerText.trim()
      ).toBe('FooBar');
    });
  });
});
