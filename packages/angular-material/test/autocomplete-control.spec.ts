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
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
  MatError,
  MatFormFieldModule,
  MatInputModule
} from '@angular/material';
import { NgRedux } from '@angular-redux/store';
import { OverlayContainer } from '@angular/cdk/overlay';
import { DebugElement, NgZone } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MockNgRedux } from '@angular-redux/store/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorTestExpectation } from '@jsonforms/angular-test';
import { ControlElement, JsonSchema } from '@jsonforms/core';
import { MockNgZone } from './mock-ng-zone';
import { AutocompleteControlRenderer } from '../src';

const data = { foo: 'A' };
const schema: JsonSchema = {
  type: 'object',
  properties: {
    foo: {
      type: 'string',
      enum: ['A', 'B', 'C']
    }
  }
};
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo'
};

const imports = [
  MatAutocompleteModule,
  MatInputModule,
  MatFormFieldModule,
  NoopAnimationsModule,
  ReactiveFormsModule
];
const providers = [{ provide: NgRedux, useFactory: MockNgRedux.getInstance }];
const componentUT: any = AutocompleteControlRenderer;
const errorTest: ErrorTestExpectation = {
  errorInstance: MatError,
  numberOfElements: 1,
  indexOfElement: 0
};

describe('Autocomplete control Base Tests', () => {
  let fixture: ComponentFixture<AutocompleteControlRenderer>;
  let component: AutocompleteControlRenderer;
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

  it('should render', fakeAsync(() => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema;
    component.schema = schema;
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
    tick();
    expect(component.data).toBe('A');
    expect(inputElement.value).toBe('A');
    expect(inputElement.disabled).toBe(false);
  }));

  it('should support updating the state', fakeAsync(() => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema;
    component.schema = schema;

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
    tick();
    mockSubStore.next({
      jsonforms: {
        core: {
          data: { foo: 'B' },
          schema: schema
        }
      }
    });
    mockSubStore.complete();
    tick();
    fixture.detectChanges();
    expect(component.data).toBe('B');
    expect(inputElement.value).toBe('B');
  }));

  it('should update with undefined value', () => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema;
    component.schema = schema;

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
    component.schema = schema;

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
  it('should not update with wrong ref', fakeAsync(() => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema;
    component.schema = schema;

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
    tick();
    mockSubStore.next({
      jsonforms: {
        core: {
          data: { foo: 'A', bar: 'B' },
          schema: schema
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    tick();
    expect(component.data).toBe('A');
    expect(inputElement.value).toBe('A');
  }));
  // store needed as we evaluate the calculated enabled value to disable/enable the control
  it('can be disabled', () => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema;
    component.schema = schema;
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
  it('id should be present in output', () => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema;
    component.schema = schema;
    component.id = 'myId';

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
    expect(inputElement.id).toBe('myId');
  });
});
describe('AutoComplete control Input Event Tests', () => {
  let fixture: ComponentFixture<AutocompleteControlRenderer>;
  let component: AutocompleteControlRenderer;
  let inputElement: HTMLInputElement;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let zone: MockNgZone;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [componentUT],
      imports: imports,
      providers: [
        ...providers,
        { provide: NgZone, useFactory: () => (zone = new MockNgZone()) }
      ]
    }).compileComponents();

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();
    MockNgRedux.reset();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(componentUT);
    component = fixture.componentInstance;

    inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  afterEach(inject(
    [OverlayContainer],
    (currentOverlayContainer: OverlayContainer) => {
      // Since we're resetting the testing module in some of the tests,
      // we can potentially have multiple overlay containers.
      currentOverlayContainer.ngOnDestroy();
      overlayContainer.ngOnDestroy();
    }
  ));
  it('should update via input event', fakeAsync(() => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema;
    component.schema = schema;

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

    const spy = spyOn(component, 'onSelect');

    inputElement.focus();
    zone.simulateZoneExit();
    fixture.detectChanges();

    const options = overlayContainerElement.querySelectorAll(
      'mat-option'
    ) as NodeListOf<HTMLElement>;
    options[1].click();
    tick();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
    const event = spy.calls.mostRecent()
      .args[0] as MatAutocompleteSelectedEvent;

    expect(event.option.value).toBe('B');
  }));
  it('options should prefer own props', fakeAsync(() => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = uischema;
    component.schema = schema;
    component.options = ['X', 'Y', 'Z'];

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

    const spy = spyOn(component, 'onSelect');

    inputElement.focus();
    zone.simulateZoneExit();
    fixture.detectChanges();

    const options = overlayContainerElement.querySelectorAll(
      'mat-option'
    ) as NodeListOf<HTMLElement>;
    options[0].click();
    tick();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
    const event = spy.calls.mostRecent()
      .args[0] as MatAutocompleteSelectedEvent;

    expect(event.option.value).toBe('X');
  }));
});
describe('AutoComplete control Error Tests', () => {
  let fixture: ComponentFixture<AutocompleteControlRenderer>;
  let component: AutocompleteControlRenderer;
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
    component.schema = schema;

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
