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
import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  ErrorTestExpectation,
  getJsonFormsService,
  setupMockStore,
} from './common';
import {
  Actions,
  ControlElement,
  EnumOption,
  JsonFormsCore,
  JsonSchema,
} from '@jsonforms/core';
import { OneOfEnumControlRenderer } from '../src';
import { JsonFormsAngularService } from '@jsonforms/angular';
import { ErrorObject } from 'ajv';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatAutocompleteHarness } from '@angular/material/autocomplete/testing';

const data = {
  oneOfEnum: 'foo',
};
const schema: JsonSchema = {
  type: 'object',
  properties: {
    oneOfEnum: {
      type: 'string',
      oneOf: [
        {
          const: 'foo',
          title: 'Foo',
        },
        {
          const: 'bar',
          title: 'Bar',
        },
        {
          const: 'foobar',
          title: 'FooBar',
        },
      ],
    },
  },
};
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/oneOfEnum',
};

const imports = [
  MatAutocompleteModule,
  MatInputModule,
  MatFormFieldModule,
  NoopAnimationsModule,
  ReactiveFormsModule,
];
const providers = [JsonFormsAngularService];
const componentUT: any = OneOfEnumControlRenderer;
const errorTest: ErrorTestExpectation = {
  errorInstance: MatError,
  numberOfElements: 1,
  indexOfElement: 0,
};

describe('OneOfEnum control Base Tests', () => {
  let fixture: ComponentFixture<OneOfEnumControlRenderer>;
  let component: OneOfEnumControlRenderer;
  let inputElement: HTMLInputElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [componentUT, ...imports],
      providers: providers,
    }).compileComponents();
  }));

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
    expect(component.data).toEqual('foo');
    expect(inputElement.value).toBe('Foo');
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
    getJsonFormsService(component).updateCore(
      Actions.update('oneOfEnum', () => 'bar')
    );
    tick();
    fixture.detectChanges();
    expect(component.data).toEqual('bar');
    expect(inputElement.value).toBe('Bar');
  }));

  it('should update with undefined value', () => {
    setupMockStore(fixture, { uischema, schema, data });
    getJsonFormsService(component).updateCore(
      Actions.init(data, schema, uischema)
    );
    component.ngOnInit();
    fixture.detectChanges();

    getJsonFormsService(component).updateCore(
      Actions.update('oneOfEnum', () => undefined)
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
      Actions.update('oneOfEnum', () => null)
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
    getJsonFormsService(component).updateCore(
      Actions.update('oneOfEnum', () => 'foo')
    );
    getJsonFormsService(component).updateCore(
      Actions.update('plainEnum', () => 'bar')
    );
    fixture.detectChanges();
    tick();
    expect(component.data).toEqual('foo');
    expect(inputElement.value).toBe('Foo');
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

describe('OneOfEnum control Input Event Tests', () => {
  let fixture: ComponentFixture<OneOfEnumControlRenderer>;
  let component: OneOfEnumControlRenderer;
  let loader: HarnessLoader;
  let inputElement: HTMLInputElement;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [componentUT, ...imports],
      providers: [...providers],
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(componentUT);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);

    inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
  }));

  it('should update via input event', fakeAsync(async () => {
    setupMockStore(fixture, { uischema, schema, data });
    getJsonFormsService(component).updateCore(
      Actions.init(data, schema, uischema)
    );

    component.ngOnInit();
    fixture.detectChanges();

    const spy = spyOn(component, 'onSelect');

    await (await loader.getHarness(MatAutocompleteHarness)).focus();
    fixture.detectChanges();

    await (
      await loader.getHarness(MatAutocompleteHarness)
    ).selectOption({ text: 'Bar' });
    tick();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
    const event = spy.calls.mostRecent()
      .args[0] as MatAutocompleteSelectedEvent;

    expect(event.option.value).toEqual({
      label: 'Bar',
      value: 'bar',
    } satisfies EnumOption);
    expect(inputElement.value).toBe('Bar');
  }));

  it('options should prefer own props', fakeAsync(async () => {
    setupMockStore(fixture, { uischema, schema, data });
    getJsonFormsService(component).updateCore(
      Actions.init(data, schema, uischema)
    );
    component.options = [
      {
        label: 'X',
        value: 'x',
      },
      {
        label: 'Y',
        value: 'y',
      },
      {
        label: 'Z',
        value: 'z',
      },
    ];

    component.ngOnInit();
    fixture.detectChanges();
    const spy = spyOn(component, 'onSelect');

    await (await loader.getHarness(MatAutocompleteHarness)).focus();
    fixture.detectChanges();

    await (
      await loader.getHarness(MatAutocompleteHarness)
    ).selectOption({ text: 'Y' });
    fixture.detectChanges();
    tick();

    const event = spy.calls.mostRecent()
      .args[0] as MatAutocompleteSelectedEvent;
    expect(event.option.value).toEqual({
      label: 'Y',
      value: 'y',
    } satisfies EnumOption);
    expect(inputElement.value).toBe('Y');
  }));

  it('should render translated enum correctly', fakeAsync(async () => {
    setupMockStore(fixture, { uischema, schema, data });
    const state: JsonFormsCore = {
      data,
      schema,
      uischema,
    };
    getJsonFormsService(component).init({
      core: state,
      i18n: {
        translate: (key, defaultMessage) => {
          const translations: { [key: string]: string } = {
            'oneOfEnum.Foo': 'Translated Foo',
            'oneOfEnum.Bar': 'Translated Bar',
            'oneOfEnum.FooBar': 'Translated FooBar',
          };
          return translations[key] ?? defaultMessage;
        },
      },
    });
    getJsonFormsService(component).updateCore(
      Actions.init(data, schema, uischema)
    );
    component.ngOnInit();
    fixture.detectChanges();
    const spy = spyOn(component, 'onSelect');

    await (await loader.getHarness(MatAutocompleteHarness)).focus();
    fixture.detectChanges();

    await (
      await loader.getHarness(MatAutocompleteHarness)
    ).selectOption({
      text: 'Translated Bar',
    });
    fixture.detectChanges();
    tick();

    const event = spy.calls.mostRecent()
      .args[0] as MatAutocompleteSelectedEvent;
    expect(event.option.value).toEqual({
      label: 'Translated Bar',
      value: 'bar',
    } satisfies EnumOption);
    expect(inputElement.value).toBe('Translated Bar');
  }));
});

describe('OneOfEnum control Error Tests', () => {
  let fixture: ComponentFixture<OneOfEnumControlRenderer>;
  let component: OneOfEnumControlRenderer;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [componentUT, ...imports],
      providers: providers,
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(componentUT);
    component = fixture.componentInstance;
  });

  it('should display errors', () => {
    const errors: ErrorObject[] = [
      {
        instancePath: '/oneOfEnum',
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

describe('OneOfEnum control updateFilter function', () => {
  let fixture: ComponentFixture<OneOfEnumControlRenderer>;
  let component: OneOfEnumControlRenderer;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [componentUT, ...imports],
      providers: providers,
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(componentUT);
    component = fixture.componentInstance;
  });

  it('should not filter options on ENTER key press', () => {
    component.shouldFilter = false;
    component.options = [
      {
        label: 'X',
        value: 'x',
      },
      {
        label: 'Y',
        value: 'y',
      },
      {
        label: 'Z',
        value: 'z',
      },
    ];
    setupMockStore(fixture, { uischema, schema, data });
    getJsonFormsService(component).updateCore(
      Actions.init(data, schema, uischema)
    );
    component.ngOnInit();
    fixture.detectChanges();
    component.updateFilter({ keyCode: 13 });
    fixture.detectChanges();
    expect(component.shouldFilter).toBe(false);
  });

  it('should filter options when a key other than ENTER is pressed', () => {
    component.shouldFilter = false;
    component.options = [
      {
        label: 'X',
        value: 'x',
      },
      {
        label: 'Y',
        value: 'y',
      },
      {
        label: 'Z',
        value: 'z',
      },
    ];
    setupMockStore(fixture, { uischema, schema, data });
    getJsonFormsService(component).updateCore(
      Actions.init(data, schema, uischema)
    );
    component.ngOnInit();
    fixture.detectChanges();

    component.updateFilter({ keyCode: 65 });
    fixture.detectChanges();

    expect(component.shouldFilter).toBe(true);
  });
});
