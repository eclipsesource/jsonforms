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
} from '@angular/material/autocomplete';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { OverlayContainer } from '@angular/cdk/overlay';
import { DebugElement, NgZone } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  ErrorTestExpectation,
  setupMockStore,
  getJsonFormsService,
} from '@jsonforms/angular-test';
import { ControlElement, JsonSchema, Actions } from '@jsonforms/core';
import { AutocompleteControlRenderer } from '../src';
import { JsonFormsAngularService } from '@jsonforms/angular';
import { ErrorObject } from 'ajv';
import { FlexLayoutModule } from '@angular/flex-layout';

const data = { foo: 'A' };
const schema: JsonSchema = {
  type: 'object',
  properties: {
    foo: {
      type: 'string',
      enum: ['A', 'B', 'C'],
    },
  },
};
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo',
};

const imports = [
  MatAutocompleteModule,
  MatInputModule,
  MatFormFieldModule,
  NoopAnimationsModule,
  ReactiveFormsModule,
  FlexLayoutModule,
];
const providers = [JsonFormsAngularService];
const componentUT: any = AutocompleteControlRenderer;
const errorTest: ErrorTestExpectation = {
  errorInstance: MatError,
  numberOfElements: 1,
  indexOfElement: 0,
};

describe('Autocomplete control Base Tests', () => {
  let fixture: ComponentFixture<AutocompleteControlRenderer>;
  let component: AutocompleteControlRenderer;
  let inputElement: HTMLInputElement;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [componentUT],
      imports: imports,
      providers: providers,
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(componentUT);
    component = fixture.componentInstance;

    inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
  });

  it('should render', fakeAsync(() => {
    setupMockStore(fixture, { uischema, schema, data });
    getJsonFormsService(component).updateCore(
      Actions.init(data, schema, uischema)
    );
    component.ngOnInit();
    fixture.detectChanges();
    tick();
    expect(component.data).toBe('A');
    expect(inputElement.value).toBe('A');
    expect(inputElement.disabled).toBe(false);
  }));

  it('should support updating the state', fakeAsync(() => {
    setupMockStore(fixture, { uischema, schema, data });
    getJsonFormsService(component).updateCore(
      Actions.init(data, schema, uischema)
    );
    component.ngOnInit();
    fixture.detectChanges();
    tick();
    getJsonFormsService(component).updateCore(Actions.update('foo', () => 'B'));
    tick();
    fixture.detectChanges();
    expect(component.data).toBe('B');
    expect(inputElement.value).toBe('B');
  }));

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
    expect(component.data).toBe(undefined);
    expect(inputElement.value).toBe('');
  });
  it('should update with null value', () => {
    setupMockStore(fixture, { uischema, schema, data });
    getJsonFormsService(component).updateCore(
      Actions.init(data, schema, uischema)
    );
    fixture.detectChanges();
    component.ngOnInit();

    getJsonFormsService(component).updateCore(
      Actions.update('foo', () => null)
    );
    fixture.detectChanges();
    expect(component.data).toBe(null);
    expect(inputElement.value).toBe('');
  });
  it('should not update with wrong ref', fakeAsync(() => {
    setupMockStore(fixture, { uischema, schema, data });
    getJsonFormsService(component).updateCore(
      Actions.init(data, schema, uischema)
    );
    component.ngOnInit();
    fixture.detectChanges();
    tick();
    getJsonFormsService(component).updateCore(Actions.update('foo', () => 'A'));
    getJsonFormsService(component).updateCore(Actions.update('bar', () => 'B'));
    fixture.detectChanges();
    tick();
    expect(component.data).toBe('A');
    expect(inputElement.value).toBe('A');
  }));
  // store needed as we evaluate the calculated enabled value to disable/enable the control
  it('can be disabled', () => {
    setupMockStore(fixture, { uischema, schema, data });
    getJsonFormsService(component).updateCore(
      Actions.init(data, schema, uischema)
    );
    component.disabled = true;
    component.ngOnInit();
    fixture.detectChanges();
    expect(inputElement.disabled).toBe(true);
  });
  it('can be hidden', () => {
    setupMockStore(fixture, { uischema, schema, data });
    getJsonFormsService(component).updateCore(
      Actions.init(data, schema, uischema)
    );
    component.visible = false;
    component.ngOnInit();
    fixture.detectChanges();
    const hasDisplayNone =
      'none' === fixture.nativeElement.children[0].style.display;
    const hasHidden = fixture.nativeElement.children[0].hidden;
    expect(hasDisplayNone || hasHidden).toBeTruthy();
  });

  it('id should be present in output', () => {
    setupMockStore(fixture, { uischema, schema, data });
    component.id = 'myId';
    getJsonFormsService(component).updateCore(
      Actions.init(data, schema, uischema)
    );

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
  let zone: NgZone;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [componentUT],
      imports: imports,
      providers: [...providers],
    }).compileComponents();

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(componentUT);
    component = fixture.componentInstance;
    zone = TestBed.inject(NgZone);
    spyOn(zone, 'runOutsideAngular').and.callFake((fn: () => any) => fn());
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
    setupMockStore(fixture, { uischema, schema, data });
    getJsonFormsService(component).updateCore(
      Actions.init(data, schema, uischema)
    );

    component.ngOnInit();
    fixture.detectChanges();

    const spy = spyOn(component, 'onSelect');

    inputElement.focus();
    zone.runOutsideAngular(() => zone.onStable.emit(null));
    fixture.detectChanges();

    const options = overlayContainerElement.querySelectorAll(
      'mat-option'
    ) as NodeListOf<HTMLElement>;
    options.item(1).click();
    tick();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
    const event = spy.calls.mostRecent()
      .args[0] as MatAutocompleteSelectedEvent;

    expect(event.option.value).toBe('B');
  }));
  it('options should prefer own props', fakeAsync(() => {
    setupMockStore(fixture, { uischema, schema, data });
    getJsonFormsService(component).updateCore(
      Actions.init(data, schema, uischema)
    );
    component.options = ['X', 'Y', 'Z'];

    component.ngOnInit();
    fixture.detectChanges();
    const spy = spyOn(component, 'onSelect');

    inputElement.focus();
    zone.runOutsideAngular(() => zone.onStable.emit(null));
    fixture.detectChanges();

    const options = overlayContainerElement.querySelectorAll(
      'mat-option'
    ) as NodeListOf<HTMLElement>;
    options.item(0).click();
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
      providers: providers,
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(componentUT);
    component = fixture.componentInstance;
  });
  it('should display errors', () => {
    const errors: ErrorObject[] = [
      {
        instancePath: '/foo',
        message: 'Hi, this is me, test error!',
        params: {},
        keyword: '',
        schemaPath: '',
      },
    ];
    setupMockStore(fixture, {
      uischema,
      schema,
      data,
    });
    const formsService = getJsonFormsService(component);
    formsService.updateCore(Actions.updateErrors(errors));
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
