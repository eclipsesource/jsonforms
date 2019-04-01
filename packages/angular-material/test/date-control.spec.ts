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
import { NgRedux } from '@angular-redux/store';
import { MockNgRedux } from '@angular-redux/store/testing';
import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  TestBed
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatDatepicker,
  MatDatepickerModule,
  MatError,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorTestExpectation } from '@jsonforms/angular-test';
import { ControlElement, JsonSchema } from '@jsonforms/core';
import { DateControlRenderer, DateControlRendererTester } from '../src';
import { FlexLayoutModule } from '@angular/flex-layout';

const data = { foo: '2018-01-01' };
const schema: JsonSchema = {
  type: 'object',
  properties: {
    foo: {
      type: 'string',
      format: 'date'
    }
  }
};
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo'
};

describe('Material boolean field tester', () => {
  it('should succeed', () => {
    expect(DateControlRendererTester(uischema, schema)).toBe(2);
  });
});
const imports = [
  MatDatepickerModule,
  MatInputModule,
  MatNativeDateModule,
  MatFormFieldModule,
  NoopAnimationsModule,
  ReactiveFormsModule,
  FlexLayoutModule
];
const providers = [{ provide: NgRedux, useFactory: MockNgRedux.getInstance }];
const componentUT: any = DateControlRenderer;
const errorTest: ErrorTestExpectation = {
  errorInstance: MatError,
  numberOfElements: 1,
  indexOfElement: 0
};

describe('Date control Base Tests', () => {
  let fixture: ComponentFixture<DateControlRenderer>;
  let component: DateControlRenderer;
  let inputElement: HTMLInputElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [componentUT],
      imports: imports,
      providers: providers
    }).compileComponents();

    MockNgRedux.reset();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(componentUT);
    component = fixture.componentInstance;

    inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('should render', () => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema;

    mockSubStore.next({
      jsonforms: {
        core: {
          data: data,
          schema: schema
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.data).toBe('2018-01-01');
    // auto? shown with US layout
    expect(inputElement.value).toBe('1/1/2018');
    expect(inputElement.disabled).toBe(false);
    // the component is wrapped in a div
    expect(fixture.nativeElement.children[0].style.display).not.toBe('none');
  });

  it('should support updating the state', () => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema;

    mockSubStore.next({
      jsonforms: {
        core: {
          data: data,
          schema: schema
        }
      }
    });
    fixture.detectChanges();
    component.ngOnInit();

    mockSubStore.next({
      jsonforms: {
        core: {
          data: { foo: '2018-03-03' },
          schema: schema
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    expect(component.data).toBe('2018-03-03');
    expect(inputElement.value).toBe('3/3/2018');
  });
  it('should update with undefined value', () => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema;

    mockSubStore.next({
      jsonforms: {
        core: {
          data: data,
          schema: schema
        }
      }
    });
    fixture.detectChanges();
    component.ngOnInit();

    mockSubStore.next({
      jsonforms: {
        core: {
          data: { foo: undefined },
          schema: schema
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    expect(component.data).toBe(undefined);
    expect(inputElement.value).toBe('');
  });
  it('should update with null value', () => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema;

    mockSubStore.next({
      jsonforms: {
        core: {
          data: data,
          schema: schema
        }
      }
    });
    fixture.detectChanges();
    component.ngOnInit();

    mockSubStore.next({
      jsonforms: {
        core: {
          data: { foo: null },
          schema: schema
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    expect(component.data).toBe(null);
    expect(inputElement.value).toBe('');
  });
  it('should not update with wrong ref', () => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema;

    mockSubStore.next({
      jsonforms: {
        core: {
          data: data,
          schema: schema
        }
      }
    });
    fixture.detectChanges();
    component.ngOnInit();

    mockSubStore.next({
      jsonforms: {
        core: {
          data: { foo: '2018-01-01', bar: '2018-03-03' },
          schema: schema
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    expect(component.data).toBe('2018-01-01');
    expect(inputElement.value).toBe('1/1/2018');
  });
  // store needed as we evaluate the calculated enabled value to disable/enable the control
  it('can be disabled', () => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema;
    component.disabled = true;

    mockSubStore.next({
      jsonforms: {
        core: {
          data: data,
          schema: schema
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    component.ngOnInit();
    expect(inputElement.disabled).toBe(true);
  });
  // store needed as we evaluate the calculated enabled value to disable/enable the control
  it('can be disabled', () => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema;
    component.visible = false;

    mockSubStore.next({
      jsonforms: {
        core: {
          data: data,
          schema: schema
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    component.ngOnInit();
    // the component is wrapped in a div
    expect(fixture.nativeElement.children[0].style.display).toBe('none');
  });
  it('id should be present in output', () => {
    component.uischema = uischema;
    component.id = 'myId';

    fixture.detectChanges();
    component.ngOnInit();
    expect(inputElement.id).toBe('myId');
  });
});
describe('Date control Input Event Tests', () => {
  let fixture: ComponentFixture<DateControlRenderer>;
  let component: DateControlRenderer;
  let inputElement: HTMLInputElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [componentUT],
      imports: imports,
      providers: providers
    }).compileComponents();

    MockNgRedux.reset();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(componentUT);
    component = fixture.componentInstance;

    inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
  });
  it('should update via input event', fakeAsync(() => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema;

    mockSubStore.next({
      jsonforms: {
        core: {
          data: data,
          schema: schema
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    component.ngOnInit();

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
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [componentUT],
      imports: imports,
      providers: providers
    }).compileComponents();

    MockNgRedux.reset();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(componentUT);
    component = fixture.componentInstance;
  });
  it('should display errors', () => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema;

    mockSubStore.next({
      jsonforms: {
        core: {
          data: data,
          schema: schema,
          errors: [
            {
              dataPath: 'foo',
              message: 'Hi, this is me, test error!'
            }
          ]
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    component.ngOnInit();
    const debugErrors: DebugElement[] = fixture.debugElement.queryAll(
      By.directive(errorTest.errorInstance)
    );
    expect(debugErrors.length).toBe(errorTest.numberOfElements);
    expect(
      debugErrors[errorTest.indexOfElement].nativeElement.textContent
    ).toBe('Hi, this is me, test error!');
  });
});
