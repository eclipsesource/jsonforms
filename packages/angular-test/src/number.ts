import { MockNgRedux } from '@angular-redux/store/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { JsonFormsControl } from '@jsonforms/angular';
import { ControlElement, JsonSchema } from '@jsonforms/core';
import { Subject } from 'rxjs';
import {
  baseSetup,
  canBeDisabled,
  canBeHidden,
  ErrorTestExpectation,
  initAndExpect,
  initComponent,
  mustHaveId,
  setupMockStore,
  showErrors,
  TestConfig,
  TestData,
  updateWithNull,
  updateWithUndefined
} from './util';

interface ComponentResult<C extends JsonFormsControl> {
  fixture: ComponentFixture<any>;
  component: C;
  numberElement?: DebugElement;
  numberNativeElement?: any;
}

const prepareComponent = <C extends JsonFormsControl>(
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
      type: 'number'
    }
  }
};
const defaultUischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo'
};
export const defaultNumberTestData: TestData<ControlElement> = {
  data: defaultData,
  schema: defaultSchema,
  uischema: defaultUischema
};

export const updateFloatState = <C extends JsonFormsControl>(
  fixture: ComponentFixture<C>,
  testData: TestData<ControlElement>,
  expectations: () => any
) => {
  const mockSubStore: Subject<any> = setupMockStore(fixture, testData);
  mockSubStore.next({
    jsonforms: {
      core: {
        data: { foo: 456.456 },
        schema: testData.schema
      }
    }
  });
  initComponent(fixture, mockSubStore);

  expectations();
};

export const updateWithSiblingNumberValue = <C extends JsonFormsControl>(
  fixture: ComponentFixture<C>,
  testData: TestData<ControlElement>,
  expectations: () => any
) => {
  const mockSubStore = setupMockStore(fixture, testData);
  mockSubStore.next({
    jsonforms: {
      core: {
        data: { foo: 123.123, bar: 456.456 },
        schema: testData.schema
      }
    }
  });
  initComponent(fixture, mockSubStore);
  expectations();
};

export const numberBaseTest = <C extends JsonFormsControl>(
  testConfig: TestConfig<C>,
  instance: string,
  elementToUse: (element: DebugElement) => any,
  testData: TestData<ControlElement> = defaultNumberTestData
) => () => {
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
    initAndExpect(fixture, testData, () => {
      expect(component.data).toBe(123.123);
      expect(numberNativeElement.value).toBe('123.123');
      // step is of type string
      expect(numberNativeElement.step).toBe('0.1');
      expect(numberNativeElement.disabled).toBe(false);
      // the component is wrapped in a div
      expect(fixture.nativeElement.children[0].style.display).not.toBe('none');
    });
  });

  it('should render integers', () => {
    initAndExpect(
      fixture,
      {
        data: { foo: 123 },
        schema: {
          type: 'object',
          properties: {
            foo: { type: 'integer' }
          }
        },
        uischema: testData.uischema
      },
      () => {
        expect(component.data).toBe(123);
        expect(numberNativeElement.value).toBe('123');
        // step is of type string
        expect(numberNativeElement.step).toBe('1');
        expect(numberNativeElement.disabled).toBe(false);
        // the component is wrapped in a div
        expect(fixture.nativeElement.children[0].style.display).not.toBe(
          'none'
        );
      }
    );
  });

  it('should support updating the state', () => {
    updateFloatState(fixture, testData, () => {
      expect(component.data).toBe(456.456);
      expect(Number(numberNativeElement.value)).toBe(456.456);
    });
  });

  it('should update with undefined value', () => {
    updateWithUndefined(fixture, testData, () => {
      expect(component.data).toBe(undefined);
      expect(numberNativeElement.value).toBe('');
    });
  });

  it('should update with null value', () => {
    updateWithNull(fixture, testData, () => {
      expect(component.data).toBe(null);
      expect(numberNativeElement.value).toBe('');
    });
  });

  it('should not update with wrong ref', () => {
    updateWithSiblingNumberValue(fixture, testData, () => {
      expect(component.data).toBe(123.123);
      expect(Number(numberNativeElement.value)).toBe(123.123);
    });
  });

  // store needed as we evaluate the calculated enabled value to disable/enable the control
  it('can be disabled', () => {
    canBeDisabled(fixture, testData, () => {
      expect(numberNativeElement.disabled).toBe(true);
    });
  });
  // store needed as we evaluate the calculated enabled value to disable/enable the control
  it('can be hidden', () => {
    canBeHidden(fixture, testData, () => {
      // the component is wrapped in a div
      expect(fixture.nativeElement.children[0].style.display).toBe('none');
    });
  });

  it('id should be present in output', () => {
    mustHaveId(fixture, () => {
      expect(numberElement.nativeElement.id).toBe('myId');
    });
  });
};
export const numberInputEventTest = <C extends JsonFormsControl>(
  testConfig: TestConfig<C>,
  instance: string,
  elementToUse: (element: DebugElement) => any,
  testData: TestData<ControlElement> = defaultNumberTestData
) => () => {
  let fixture: ComponentFixture<any>;
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
    component = preparedComponents.component;
  });

  it('should update via input event', () => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = testData.uischema as ControlElement;

    mockSubStore.next({
      jsonforms: {
        core: {
          data: testData.data,
          schema: testData.schema
        }
      }
    });
    mockSubStore.complete();
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
export const numberErrorTest = <C extends JsonFormsControl>(
  testConfig: TestConfig<C>,
  errorTestInformation: ErrorTestExpectation,
  testData: TestData<ControlElement> = defaultNumberTestData
) => () => {
  let fixture: ComponentFixture<any>;

  baseSetup(testConfig);

  beforeEach(() => {
    const preparedComponents = prepareComponent(testConfig);
    fixture = preparedComponents.fixture;
  });

  it('should display errors', () => {
    showErrors(fixture, testData, () => {
      const debugErrors: DebugElement[] = fixture.debugElement.queryAll(
        By.directive(errorTestInformation.errorInstance)
      );
      expect(debugErrors.length).toBe(errorTestInformation.numberOfElements);
      expect(
        debugErrors[errorTestInformation.indexOfElement].nativeElement
          .textContent
      ).toBe('Hi, this is me, test error!');
    });
  });
};

const additionalSchema: JsonSchema = {
  type: 'object',
  properties: {
    foo: {
      type: 'number',
      minimum: -42.42,
      maximum: 42,
      multipleOf: 3
    }
  }
};
export const additionalTestData: TestData<ControlElement> = {
  data: defaultData,
  schema: additionalSchema,
  uischema: defaultUischema
};

export const numberAdditionalPropsTest = <C extends JsonFormsControl>(
  testConfig: TestConfig<C>,
  instance: string,
  elementToUse: (element: DebugElement) => any,
  testData: TestData<ControlElement> = additionalTestData
) => () => {
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
    initAndExpect(fixture, testData, () => {
      // step, min and max are of type string on an input control
      expect(numberNativeElement.step).toBe('3');
      expect(numberNativeElement.min).toBe('-42.42');
      expect(numberNativeElement.max).toBe('42');
    });
  });
};
