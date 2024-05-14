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
import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  ErrorTestExpectation,
  getJsonFormsService,
  setupMockStore,
} from './common';
import { Actions, ControlElement, JsonSchema } from '@jsonforms/core';
import { DateControlRenderer, DateControlRendererTester } from '../src';
import { JsonFormsAngularService } from '@jsonforms/angular';
import { createTesterContext } from './util';
import { initTestEnvironment } from './test';

const data = { foo: '2018-01-01' };
const schema: JsonSchema = {
  type: 'object',
  properties: {
    foo: {
      type: 'string',
      format: 'date',
    },
  },
};
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo',
};

initTestEnvironment();

describe('Material boolean field tester', () => {
  it('should succeed', () => {
    expect(
      DateControlRendererTester(uischema, schema, createTesterContext(schema))
    ).toBe(2);
  });
});
const imports = [
  MatDatepickerModule,
  MatInputModule,
  MatNativeDateModule,
  MatFormFieldModule,
  NoopAnimationsModule,
  ReactiveFormsModule,
];
const providers = [JsonFormsAngularService];
const componentUT: any = DateControlRenderer;
const errorTest: ErrorTestExpectation = {
  errorInstance: MatError,
  numberOfElements: 1,
  indexOfElement: 0,
};

describe('Date control Base Tests', () => {
  let fixture: ComponentFixture<DateControlRenderer>;
  let component: DateControlRenderer;
  let inputElement: HTMLInputElement;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [componentUT],
      imports: imports,
      providers: providers,
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(componentUT);
    component = fixture.componentInstance;

    inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('should render', () => {
    setupMockStore(fixture, { uischema, schema, data });
    getJsonFormsService(component).updateCore(
      Actions.init(data, schema, uischema)
    );
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.data.toString()).toEqual(
      new Date('2018-01-01T00:00').toString()
    );
    // auto? shown with US layout
    expect(inputElement.value).toBe('1/1/2018');
    expect(inputElement.disabled).toBe(false);
    // the component is wrapped in a div
    expect(fixture.nativeElement.children[0].style.display).not.toBe('none');
  });

  it('should support updating the state', () => {
    setupMockStore(fixture, { uischema, schema, data });
    getJsonFormsService(component).updateCore(
      Actions.init(data, schema, uischema)
    );
    component.ngOnInit();
    fixture.detectChanges();

    getJsonFormsService(component).updateCore(
      Actions.update('foo', () => '2018-03-03')
    );
    fixture.detectChanges();
    expect(component.data.toString()).toEqual(
      new Date('2018-03-03T00:00').toString()
    );
    expect(inputElement.value).toBe('3/3/2018');
  });
  it('should update with undefined value', () => {
    setupMockStore(fixture, { uischema, schema, data });
    getJsonFormsService(component).updateCore(
      Actions.init(data, schema, uischema)
    );
    component.ngOnInit();
    fixture.detectChanges();

    getJsonFormsService(component).updateCore(
      Actions.update('foo', () => undefined)
    );
    fixture.detectChanges();
    expect(component.data).toBe(null);
    expect(inputElement.value).toBe('');
  });
  it('should update with null value', () => {
    setupMockStore(fixture, { uischema, schema, data });
    getJsonFormsService(component).updateCore(
      Actions.init(data, schema, uischema)
    );
    component.ngOnInit();
    fixture.detectChanges();

    getJsonFormsService(component).updateCore(
      Actions.update('foo', () => null)
    );
    fixture.detectChanges();
    expect(component.data).toBe(null);
    expect(inputElement.value).toBe('');
  });
  it('should not update with wrong ref', () => {
    setupMockStore(fixture, { uischema, schema, data });
    getJsonFormsService(component).updateCore(
      Actions.init(data, schema, uischema)
    );
    component.ngOnInit();
    fixture.detectChanges();

    getJsonFormsService(component).updateCore(
      Actions.update('foo', () => '2018-01-01')
    );
    getJsonFormsService(component).updateCore(
      Actions.update('bar', () => '2018-03-03')
    );
    fixture.detectChanges();
    expect(component.data.toString()).toEqual(
      new Date('2018-01-01T00:00').toString()
    );
    expect(inputElement.value).toEqual('1/1/2018');
  });
  // store needed as we evaluate the calculated enabled value to disable/enable the control
  it('can be disabled', () => {
    setupMockStore(fixture, { uischema, schema, data });
    component.disabled = true;
    getJsonFormsService(component).updateCore(
      Actions.init(data, schema, uischema)
    );

    component.ngOnInit();
    fixture.detectChanges();
    expect(inputElement.disabled).toBe(true);
  });
  // store needed as we evaluate the calculated enabled value to disable/enable the control
  it('can be hidden', () => {
    setupMockStore(fixture, { uischema, schema, data });
    component.visible = false;
    getJsonFormsService(component).updateCore(
      Actions.init(data, schema, uischema)
    );

    component.ngOnInit();
    fixture.detectChanges();
    // the component is wrapped in a div
    expect(fixture.nativeElement.children[0].style.display).toBe('none');
  });
  it('id should be present in output', () => {
    component.uischema = uischema;
    component.id = 'myId';
    getJsonFormsService(component).init({
      core: { data: data, schema: schema, uischema: uischema },
    });

    component.ngOnInit();
    fixture.detectChanges();
    expect(inputElement.id).toBe('myId');
  });
});
describe('Date control Input Event Tests', () => {
  let fixture: ComponentFixture<DateControlRenderer>;
  let component: DateControlRenderer;
  let inputElement: HTMLInputElement;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [componentUT],
      imports: imports,
      providers: providers,
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(componentUT);
    component = fixture.componentInstance;

    inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
  });
  it('should update via input event', fakeAsync(() => {
    setupMockStore(fixture, { uischema, schema, data });
    getJsonFormsService(component).updateCore(
      Actions.init(data, schema, uischema)
    );
    component.ngOnInit();
    fixture.detectChanges();

    const spy = spyOn(component, 'onChange');

    fixture.debugElement
      .query(By.directive(MatDatepicker))
      .componentInstance.open();
    fixture.detectChanges();
    flush();

    const cells = document.querySelectorAll('.mat-calendar-body-cell');
    const firstCell: HTMLElement = cells[1] as HTMLElement;
    firstCell.click();
    fixture.detectChanges();
    flush();

    inputElement.dispatchEvent(new Event('change'));
    // trigger change detection
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    expect(inputElement.value).toBe('1/2/2018');
  }));
});
describe('Date control Error Tests', () => {
  let fixture: ComponentFixture<DateControlRenderer>;
  let component: DateControlRenderer;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [componentUT],
      imports: imports,
      providers: providers,
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(componentUT);
    component = fixture.componentInstance;
  });
  it('should display errors', () => {
    setupMockStore(fixture, {
      uischema,
      schema,
      data,
    });
    const formsService = getJsonFormsService(component);
    formsService.updateCore(
      Actions.updateErrors([
        {
          instancePath: '/foo',
          message: 'Hi, this is me, test error!',
          params: {},
          keyword: '',
          schemaPath: '',
        },
      ])
    );
    formsService.refresh();

    component.ngOnInit();
    fixture.detectChanges();
    const debugErrors: DebugElement[] = fixture.debugElement.queryAll(
      By.directive(errorTest.errorInstance)
    );
    expect(debugErrors.length).toBe(errorTest.numberOfElements);
    expect(
      debugErrors[errorTest.indexOfElement].nativeElement.textContent
    ).toBe('Hi, this is me, test error!');
  });
});
