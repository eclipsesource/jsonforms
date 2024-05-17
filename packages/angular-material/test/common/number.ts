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
import type { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import type { JsonFormsControl } from '@jsonforms/angular';
import { Actions, ControlElement, JsonSchema } from '@jsonforms/core';
import {
  baseSetup,
  ErrorTestExpectation,
  getJsonFormsService,
  setupMockStore,
  TestConfig,
  TestData,
} from './util';
import { ComponentFixture, TestBed } from '@angular/core/testing';

interface ComponentResult<C extends JsonFormsControl> {
  fixture: ComponentFixture<any>;
  component: C;
  numberElement?: DebugElement;
  numberNativeElement?: any;
}

export const prepareComponent = <C extends JsonFormsControl>(
  testConfig: TestConfig<C>,
  instance?: string,
  elementToUse?: (element: DebugElement) => any
): ComponentResult<C> => {
  const fixture = TestBed.createComponent(testConfig.componentUT);
  const component = fixture.componentInstance;
  const result: ComponentResult<C> = { fixture, component };
  if (instance && elementToUse) {
    const numberElement = fixture.debugElement.query(By.css(instance));
    const numberNativeElement = elementToUse(numberElement);
    result.numberElement = numberElement;
    result.numberNativeElement = numberNativeElement;
  }

  return result;
};
const defaultData = { foo: 123.123 };
const defaultSchema: JsonSchema = {
  type: 'object',
  properties: {
    foo: {
      type: 'number',
    },
  },
};
const defaultUischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo',
};
export const defaultNumberTestData: TestData<ControlElement> = {
  data: defaultData,
  schema: defaultSchema,
  uischema: defaultUischema,
};
export const updateWithSiblingNumberValue = <C extends JsonFormsControl>(
  fixture: ComponentFixture<C>,
  testData: TestData<ControlElement>,
  expectations: () => any
) => {
  setupMockStore(fixture, testData);
  getJsonFormsService(fixture.componentInstance).init({
    core: {
      data: { foo: 123.123, bar: 456.456 },
      schema: testData.schema,
      uischema: undefined,
    },
  });
  fixture.componentInstance.ngOnInit();
  fixture.detectChanges();
  expectations();
};

export const numberBaseTest =
  <C extends JsonFormsControl>(
    testConfig: TestConfig<C>,
    instance: string,
    elementToUse: (element: DebugElement) => any,
    testData: TestData<ControlElement> = defaultNumberTestData
  ) =>
  () => {
    let fixture: ComponentFixture<any>;
    let numberElement: DebugElement;
    let numberNativeElement: any;
    let component: C;

    baseSetup(testConfig);

    beforeEach(() => {
      const preparedComponents = prepareComponent(
        testConfig,
        instance,
        elementToUse
      );
      fixture = preparedComponents.fixture;
      numberNativeElement = preparedComponents.numberNativeElement;
      numberElement = preparedComponents.numberElement;
      component = preparedComponents.component;
    });

    it('should render floats', () => {
      component.uischema = testData.uischema;
      getJsonFormsService(component).init({ core: testData });
      getJsonFormsService(component).updateCore(
        Actions.init(testData.data, testData.schema)
      );
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.data).toBe(123.123);
      expect(numberNativeElement.value).toBe('123.123');
      // step is of type string
      expect(numberNativeElement.step).toBe('0.1');
      expect(numberNativeElement.disabled).toBe(false);
      // the component is wrapped in a div
      expect(fixture.nativeElement.children[0].style.display).not.toBe('none');
    });

    it('should render integers', () => {
      const state = {
        data: { foo: 123 },
        schema: {
          type: 'object',
          properties: {
            foo: { type: 'integer' },
          },
        },
        uischema: testData.uischema,
      };
      component.uischema = testData.uischema;
      getJsonFormsService(component).init({ core: state });
      getJsonFormsService(component).updateCore(
        Actions.init(state.data, state.schema)
      );
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.data).toBe(123);
      expect(numberNativeElement.value).toBe('123');
      // step is of type string
      expect(numberNativeElement.step).toBe('1');
      expect(numberNativeElement.disabled).toBe(false);
      // the component is wrapped in a div
      expect(fixture.nativeElement.children[0].style.display).not.toBe('none');
    });

    it('should support updating the state', () => {
      component.uischema = testData.uischema;
      getJsonFormsService(component).init({ core: testData });
      getJsonFormsService(component).updateCore(
        Actions.init(testData.data, testData.schema)
      );
      component.ngOnInit();
      fixture.detectChanges();
      getJsonFormsService(fixture.componentInstance).updateCore(
        Actions.update('foo', () => 456.456)
      );
      fixture.detectChanges();
      expect(component.data).toBe(456.456);
      expect(Number(numberNativeElement.value)).toBe(456.456);
    });

    it('should update with undefined value', () => {
      component.uischema = testData.uischema;
      getJsonFormsService(component).init({ core: testData });
      getJsonFormsService(component).updateCore(
        Actions.init(testData.data, testData.schema)
      );
      component.ngOnInit();
      fixture.detectChanges();
      getJsonFormsService(fixture.componentInstance).updateCore(
        Actions.update('foo', () => undefined)
      );
      fixture.detectChanges();

      expect(component.data).toBe(undefined);
      expect(numberNativeElement.value).toBe('');
    });

    it('should update with null value', () => {
      component.uischema = testData.uischema;
      getJsonFormsService(component).init({ core: testData });
      getJsonFormsService(component).updateCore(
        Actions.init(testData.data, testData.schema)
      );
      component.ngOnInit();
      fixture.detectChanges();
      getJsonFormsService(fixture.componentInstance).updateCore(
        Actions.update('foo', () => null)
      );
      fixture.detectChanges();
      expect(component.data).toBe(null);
      expect(numberNativeElement.value).toBe('');
    });

    it('should not update with wrong ref', () => {
      component.uischema = testData.uischema;
      getJsonFormsService(component).init({ core: testData });
      getJsonFormsService(component).updateCore(
        Actions.init(testData.data, testData.schema)
      );
      component.ngOnInit();
      fixture.detectChanges();
      getJsonFormsService(fixture.componentInstance).updateCore(
        Actions.update('bar', () => 456.456)
      );
      fixture.detectChanges();
      expect(component.data).toBe(123.123);
      expect(Number(numberNativeElement.value)).toBe(123.123);
    });

    // store needed as we evaluate the calculated enabled value to disable/enable the control
    it('can be disabled', () => {
      component.uischema = testData.uischema;
      component.disabled = true;

      getJsonFormsService(component).init({
        core: {
          data: testData.data,
          schema: testData.schema,
          uischema: testData.uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();
      expect(numberNativeElement.disabled).toBe(true);
    });
    // store needed as we evaluate the calculated enabled value to disable/enable the control
    it('can be hidden', () => {
      component.uischema = testData.uischema;
      component.visible = false;

      getJsonFormsService(component).init({
        core: {
          data: testData.data,
          schema: testData.schema,
          uischema: testData.uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();
      const hasDisplayNone =
        'none' === fixture.nativeElement.children[0].style.display;
      const hasHidden = fixture.nativeElement.children[0].hidden;
      expect(hasDisplayNone || hasHidden).toBeTruthy();
    });

    it('id should be present in output', () => {
      component.uischema = testData.uischema;
      component.id = 'myId';
      getJsonFormsService(component).init({
        core: {
          data: testData.data,
          schema: testData.schema,
          uischema: testData.uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();
      expect(numberElement.nativeElement.id).toBe('myId');
    });
  };
export const numberInputEventTest =
  <C extends JsonFormsControl>(
    testConfig: TestConfig<C>,
    instance: string,
    elementToUse: (element: DebugElement) => any,
    testData: TestData<ControlElement> = defaultNumberTestData
  ) =>
  () => {
    let fixture: ComponentFixture<any>;
    let numberNativeElement: any;
    let component: C & { onChange(evt: string): void };

    baseSetup(testConfig);

    beforeEach(() => {
      const preparedComponents = prepareComponent(
        testConfig,
        instance,
        elementToUse
      );
      fixture = preparedComponents.fixture;
      numberNativeElement = preparedComponents.numberNativeElement;
      component = preparedComponents.component;
    });

    it('should update via input event', () => {
      component.uischema = testData.uischema as ControlElement;

      getJsonFormsService(component).init({
        core: {
          data: testData.data,
          schema: testData.schema,
          uischema: undefined,
        },
      });
      fixture.detectChanges();
      component.ngOnInit();

      const spy = spyOn(component, 'onChange');
      numberNativeElement.value = 456.456;
      if (numberNativeElement.dispatchEvent) {
        numberNativeElement.dispatchEvent(new Event('input'));
      }
      // trigger change detection
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
      expect(Number(numberNativeElement.value)).toBe(456.456);
    });
  };
export const numberErrorTest =
  <C extends JsonFormsControl>(
    testConfig: TestConfig<C>,
    errorTestInformation: ErrorTestExpectation,
    testData: TestData<ControlElement> = defaultNumberTestData
  ) =>
  () => {
    let fixture: ComponentFixture<any>;
    let component: C;

    baseSetup(testConfig);

    beforeEach(() => {
      const preparedComponents = prepareComponent(testConfig);
      fixture = preparedComponents.fixture;
      component = preparedComponents.component;
    });

    it('should display errors', () => {
      component.uischema = testData.uischema;

      const formsService = getJsonFormsService(component);
      formsService.init({
        core: {
          data: testData.data,
          schema: testData.schema,
          uischema: undefined,
        },
      });
      formsService.updateCore(
        Actions.updateErrors([
          {
            instancePath: '/foo',
            message: 'Hi, this is me, test error!',
            keyword: '',
            schemaPath: '',
            params: {},
          },
        ])
      );
      formsService.refresh();
      component.ngOnInit();
      fixture.detectChanges();
      const debugErrors: DebugElement[] = fixture.debugElement.queryAll(
        By.directive(errorTestInformation.errorInstance)
      );
      expect(debugErrors.length).toBe(errorTestInformation.numberOfElements);
      expect(
        debugErrors[errorTestInformation.indexOfElement].nativeElement
          .textContent
      ).toBe('Hi, this is me, test error!');
    });
  };

const additionalSchema: JsonSchema = {
  type: 'object',
  properties: {
    foo: {
      type: 'number',
      minimum: -42.42,
      maximum: 42,
      multipleOf: 3,
    },
  },
};
export const additionalTestData: TestData<ControlElement> = {
  data: defaultData,
  schema: additionalSchema,
  uischema: defaultUischema,
};

export const numberAdditionalPropsTest =
  <C extends JsonFormsControl>(
    testConfig: TestConfig<C>,
    instance: string,
    elementToUse: (element: DebugElement) => any,
    testData: TestData<ControlElement> = additionalTestData
  ) =>
  () => {
    let fixture: ComponentFixture<any>;
    let numberNativeElement: any;

    baseSetup(testConfig);

    beforeEach(() => {
      const preparedComponents = prepareComponent(
        testConfig,
        instance,
        elementToUse
      );
      fixture = preparedComponents.fixture;
      numberNativeElement = preparedComponents.numberNativeElement;
    });

    it('should respect min,max,multipleOf', () => {
      setupMockStore(fixture, testData);
      getJsonFormsService(fixture.componentInstance).updateCore(
        Actions.init(testData.data, testData.schema)
      );
      fixture.componentInstance.ngOnInit();
      fixture.detectChanges();

      // step, min and max are of type string on an input control
      expect(numberNativeElement.step).toBe('3');
      expect(numberNativeElement.min).toBe('-42.42');
      expect(numberNativeElement.max).toBe('42');
    });
  };
