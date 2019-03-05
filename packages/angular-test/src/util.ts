import { Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockNgRedux } from '@angular-redux/store/testing';
import { JsonFormsControl } from '@jsonforms/angular';
import { ControlElement, JsonSchema, UISchemaElement } from '@jsonforms/core';
import { Subject } from 'rxjs';

export interface ErrorTestExpectation {
  errorInstance: Type<any>;
  numberOfElements: number;
  indexOfElement: number;
}
export interface TestConfig<C extends JsonFormsControl> {
  imports: any[];
  providers: any[];
  componentUT: Type<C>;
}

export const baseSetup = <C extends JsonFormsControl>(
  testConfig: TestConfig<C>
) => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [testConfig.componentUT],
      imports: testConfig.imports,
      providers: testConfig.providers
    }).compileComponents();

    MockNgRedux.reset();
  });
};

export interface TestData<T extends UISchemaElement> {
  data: any;
  schema: JsonSchema;
  uischema: T;
}

export const setupMockStore = (
  fixture: ComponentFixture<any>,
  testData: TestData<UISchemaElement>
): Subject<any> => {
  const mockSubStore = MockNgRedux.getSelectorStub();
  const component = fixture.componentInstance;
  component.uischema = testData.uischema;
  component.schema = testData.schema;

  mockSubStore.next({
    jsonforms: {
      core: {
        data: testData.data,
        schema: testData.schema
      }
    }
  });
  return mockSubStore;
};

export const initComponent = (
  fixture: ComponentFixture<any>,
  mockSubStore: Subject<any>
) => {
  mockSubStore.complete();
  fixture.componentInstance.ngOnInit();
  fixture.detectChanges();
};

export const initAndExpect = <C>(
  fixture: ComponentFixture<C>,
  testData: TestData<UISchemaElement>,
  expectations: () => any
) => {
  initComponent(fixture, setupMockStore(fixture, testData));
  expectations();
};

export const updateWithUndefined = <C extends JsonFormsControl>(
  fixture: ComponentFixture<C>,
  testData: TestData<ControlElement>,
  expectations: () => any
) => {
  const mockSubStore: Subject<any> = setupMockStore(fixture, testData);
  mockSubStore.next({
    jsonforms: {
      core: {
        data: { foo: undefined },
        schema: testData.schema
      }
    }
  });
  initComponent(fixture, mockSubStore);
  expectations();
};

export const updateWithNull = <C extends JsonFormsControl>(
  fixture: ComponentFixture<C>,
  testData: TestData<ControlElement>,
  expectations: () => any
) => {
  const mockSubStore: Subject<any> = setupMockStore(fixture, testData);
  mockSubStore.next({
    jsonforms: {
      core: {
        data: { foo: null },
        schema: testData.schema
      }
    }
  });
  initComponent(fixture, mockSubStore);
  expectations();
};

export const canBeDisabled = <C extends JsonFormsControl>(
  fixture: ComponentFixture<C>,
  testData: TestData<ControlElement>,
  expectations: () => any
) => {
  const mockSubStore: Subject<any> = setupMockStore(fixture, testData);
  const component = fixture.componentInstance;
  component.disabled = true;
  initComponent(fixture, mockSubStore);
  expectations();
};

export const canBeHidden = <C extends JsonFormsControl>(
  fixture: ComponentFixture<C>,
  testData: TestData<ControlElement>,
  expectations: () => any
) => {
  const mockSubStore: Subject<any> = setupMockStore(fixture, testData);
  const component = fixture.componentInstance;
  component.visible = false;
  initComponent(fixture, mockSubStore);
  expectations();
};

export const mustHaveId = <C extends JsonFormsControl>(
  fixture: ComponentFixture<C>,
  expectations: () => any
) => {
  const component = fixture.componentInstance;
  component.id = 'myId';
  component.ngOnInit();
  fixture.detectChanges();
  expectations();
};

export const showErrors = <C extends JsonFormsControl>(
  fixture: ComponentFixture<C>,
  testData: TestData<ControlElement>,
  expectations: () => any
) => {
  const component = fixture.componentInstance;
  const mockSubStore = MockNgRedux.getSelectorStub();
  component.uischema = testData.uischema;

  mockSubStore.next({
    jsonforms: {
      core: {
        data: testData.data,
        schema: testData.schema,
        errors: [
          {
            dataPath: 'foo',
            message: 'Hi, this is me, test error!'
          }
        ]
      }
    }
  });
  initComponent(fixture, mockSubStore);
  expectations();
};
