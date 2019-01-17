import { DebugElement, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockNgRedux } from '@angular-redux/store/testing';

import { JsonFormsControl } from '@jsonforms/angular';
import {
  baseSetup,
  ErrorTestExpectation,
  initComponent,
  setupMockStore,
  TestConfig,
  TestData
} from './util';
import { ControlElement, JsonSchema } from '@jsonforms/core';

interface ComponentResult<C extends JsonFormsControl> {
  fixture: ComponentFixture<any>;
  component: C;
  rangeElement: DebugElement;
}

const prepareComponent = <C extends JsonFormsControl, I>(
  testConfig: TestConfig<C>,
  instance: Type<I>
): ComponentResult<C> => {
  const fixture = TestBed.createComponent(testConfig.componentUT);
  const component = fixture.componentInstance;
  const rangeElement = fixture.debugElement.query(By.directive(instance));
  const result: ComponentResult<C> = { fixture, component, rangeElement };
  return result;
};
export const rangeDefaultData = { foo: 1.234 };
export const rangeDefaultSchema: JsonSchema = {
  type: 'object',
  properties: {
    foo: {
      type: 'number',
      minimum: -42.42,
      maximum: 42.42,
      default: 0.42
    }
  }
};
export const rangeDefaultUischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo',
  options: { slider: true }
};
export const rangeDefaultTestData: TestData<ControlElement> = {
  data: rangeDefaultData,
  schema: rangeDefaultSchema,
  uischema: rangeDefaultUischema
};

export const rangeBaseTest = <C extends JsonFormsControl, I>(
  testConfig: TestConfig<C>,
  instance: Type<I>
) => () => {
  let fixture: ComponentFixture<any>;
  let rangeElement: DebugElement;
  let component: C;

  baseSetup(testConfig);

  beforeEach(() => {
    const preparedComponents = prepareComponent(testConfig, instance);
    fixture = preparedComponents.fixture;
    rangeElement = preparedComponents.rangeElement;
    component = preparedComponents.component;
  });

  it('should render floats', () => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = rangeDefaultTestData.uischema;
    component.schema = rangeDefaultTestData.schema;

    mockSubStore.next({
      jsonforms: {
        core: {
          data: rangeDefaultTestData.data,
          schema: rangeDefaultTestData.schema
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.data).toBe(1.234);
    expect(rangeElement.componentInstance.value).toBe(1.234);
    // step is of type string
    expect(rangeElement.componentInstance.step).toBe(1);
    expect(rangeElement.componentInstance.min).toBe(-42.42);
    expect(rangeElement.componentInstance.max).toBe(42.42);
    expect(rangeElement.componentInstance.disabled).toBe(false);
    expect(fixture.nativeElement.children[0].style.display).not.toBe('none');
  });

  it('should render integer', () => {
    component.uischema = rangeDefaultTestData.uischema;
    const schema = JSON.parse(JSON.stringify(rangeDefaultTestData.schema));
    schema.properties.foo.type = 'integer';
    schema.properties.foo.minimum = -42;
    schema.properties.foo.maximum = 42;
    schema.properties.foo.default = 1;
    initComponent(
      fixture,
      setupMockStore(fixture, {
        uischema: rangeDefaultTestData.uischema,
        schema,
        data: { foo: 12 }
      })
    );
    expect(component.data).toBe(12);
    expect(rangeElement.componentInstance.value).toBe(12);
    // step is of type string
    expect(rangeElement.componentInstance.step).toBe(1);
    expect(rangeElement.componentInstance.min).toBe(-42);
    expect(rangeElement.componentInstance.max).toBe(42);
    expect(rangeElement.componentInstance.disabled).toBe(false);
    // the component is wrapped in a div
    expect(fixture.nativeElement.children[0].style.display).not.toBe('none');
  });

  it('should support updating the state', () => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = rangeDefaultTestData.uischema;
    component.schema = rangeDefaultTestData.schema;

    mockSubStore.next({
      jsonforms: {
        core: {
          data: rangeDefaultTestData.data,
          schema: rangeDefaultTestData.schema
        }
      }
    });
    fixture.detectChanges();
    component.ngOnInit();

    mockSubStore.next({
      jsonforms: {
        core: {
          data: { foo: 4.56 },
          schema: rangeDefaultTestData.schema
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    expect(component.data).toBe(4.56);
    expect(rangeElement.componentInstance.value).toBe(4.56);
  });
  it('should update with undefined value', () => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = rangeDefaultTestData.uischema;
    component.schema = rangeDefaultTestData.schema;

    mockSubStore.next({
      jsonforms: {
        core: {
          data: rangeDefaultTestData.data,
          schema: rangeDefaultTestData.schema
        }
      }
    });
    fixture.detectChanges();
    component.ngOnInit();

    mockSubStore.next({
      jsonforms: {
        core: {
          data: { foo: undefined },
          schema: rangeDefaultTestData.schema
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    expect(component.data).toBe(undefined);
    expect(rangeElement.componentInstance.value).toBe(0.42);
  });
  it('should update with null value', () => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = rangeDefaultTestData.uischema;
    component.schema = rangeDefaultTestData.schema;

    mockSubStore.next({
      jsonforms: {
        core: {
          data: rangeDefaultTestData.data,
          schema: rangeDefaultTestData.schema
        }
      }
    });
    fixture.detectChanges();
    component.ngOnInit();

    mockSubStore.next({
      jsonforms: {
        core: {
          data: { foo: null },
          schema: rangeDefaultTestData.schema
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    expect(component.data).toBe(null);
    expect(rangeElement.componentInstance.value).toBe(0.42);
  });
  it('should not update with wrong ref', () => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = rangeDefaultTestData.uischema;
    component.schema = rangeDefaultTestData.schema;

    mockSubStore.next({
      jsonforms: {
        core: {
          data: rangeDefaultTestData.data,
          schema: rangeDefaultTestData.schema
        }
      }
    });
    fixture.detectChanges();
    component.ngOnInit();

    mockSubStore.next({
      jsonforms: {
        core: {
          data: { foo: 1.234, bar: 456.456 },
          schema: rangeDefaultTestData.schema
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    expect(component.data).toBe(1.234);
    expect(rangeElement.componentInstance.value).toBe(1.234);
  });
  // store needed as we evaluate the calculated enabled value to disable/enable the control
  it('can be disabled', () => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = rangeDefaultTestData.uischema;
    component.schema = rangeDefaultTestData.schema;
    component.disabled = true;

    mockSubStore.next({
      jsonforms: {
        core: {
          data: rangeDefaultTestData.data,
          schema: rangeDefaultTestData.schema
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    component.ngOnInit();
    expect(rangeElement.componentInstance.disabled).toBe(true);
  });
  it('can be hidden', () => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = rangeDefaultTestData.uischema;
    component.schema = rangeDefaultTestData.schema;
    component.visible = false;

    mockSubStore.next({
      jsonforms: {
        core: {
          data: rangeDefaultTestData.data,
          schema: rangeDefaultTestData.schema
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    component.ngOnInit();
    expect(fixture.nativeElement.children[0].style.display).toBe('none');
  });
  it('id should be present in output', () => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = rangeDefaultTestData.uischema;
    component.schema = rangeDefaultTestData.schema;
    component.id = 'myId';
    mockSubStore.next({
      jsonforms: {
        core: {
          data: rangeDefaultTestData.data,
          schema: rangeDefaultTestData.schema
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    component.ngOnInit();
    expect(rangeElement.nativeElement.id).toBe('myId');
  });
};
export const rangeInputEventTest = <C extends JsonFormsControl, I>(
  testConfig: TestConfig<C>,
  instance: Type<I>
) => () => {
  let fixture: ComponentFixture<any>;
  let component: C;

  baseSetup(testConfig);

  beforeEach(() => {
    const preparedComponents = prepareComponent(testConfig, instance);
    fixture = preparedComponents.fixture;
    component = preparedComponents.component;
  });

  it('should update via input event', () => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = rangeDefaultTestData.uischema;
    component.schema = rangeDefaultTestData.schema;

    mockSubStore.next({
      jsonforms: {
        core: {
          data: rangeDefaultTestData.data,
          schema: rangeDefaultTestData.schema
        }
      }
    });
    mockSubStore.complete();
    fixture.detectChanges();
    component.ngOnInit();

    const spy = spyOn(component, 'onChange');

    fixture.debugElement
      .query(By.css('.mat-slider-wrapper'))
      .nativeElement.click();

    // trigger change detection
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  });
};
export const rangeErrorTest = <C extends JsonFormsControl, I>(
  testConfig: TestConfig<C>,
  instance: Type<I>,
  errorTestInformation: ErrorTestExpectation
) => () => {
  let fixture: ComponentFixture<any>;
  let component: C;

  baseSetup(testConfig);

  beforeEach(() => {
    const preparedComponents = prepareComponent(testConfig, instance);
    fixture = preparedComponents.fixture;
    component = preparedComponents.component;
  });
  it('should display errors', () => {
    const mockSubStore = MockNgRedux.getSelectorStub();
    component.uischema = rangeDefaultTestData.uischema;
    component.schema = rangeDefaultTestData.schema;

    mockSubStore.next({
      jsonforms: {
        core: {
          data: rangeDefaultTestData.data,
          schema: rangeDefaultTestData.schema,
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
      By.directive(errorTestInformation.errorInstance)
    );
    expect(debugErrors.length).toBe(errorTestInformation.numberOfElements);
    expect(
      debugErrors[errorTestInformation.indexOfElement].nativeElement.textContent
    ).toBe('Hi, this is me, test error!');
  });
};
