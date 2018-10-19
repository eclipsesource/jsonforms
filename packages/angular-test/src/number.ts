import { MockNgRedux } from '@angular-redux/store/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { JsonFormsControl } from '@jsonforms/angular';
import { ControlElement, JsonSchema } from '@jsonforms/core';
import { Subject } from 'rxjs';
import { baseSetup, ErrorTestExpectation, TestConfig, TestData } from './util';

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
    const result: ComponentResult<C> =  { fixture, component};
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
export const defaultTestData: TestData = {
    data: defaultData,
    schema: defaultSchema,
    uischema: defaultUischema
};

export const setupMockStore =
    (fixture: ComponentFixture<any>, testData: TestData): Subject<any> => {
        const mockSubStore = MockNgRedux.getSelectorStub();
        const component = fixture.componentInstance;
        component.uischema = testData.uischema;
        component.schema = testData.schema;

        mockSubStore.next({
            jsonforms: {
                core: {
                    data: testData.data,
                    schema: testData.schema,
                }
            }
        });
        fixture.detectChanges();
        return mockSubStore;
    };

export const renderFloat = <C extends JsonFormsControl>(
    fixture: ComponentFixture<C>,
    testData: TestData,
    expectations: () => any
) => {
    const mockSubStore: Subject<any> = setupMockStore(fixture, testData);
    mockSubStore.complete();
    fixture.componentInstance.ngOnInit();
    expectations();
};

export const renderInteger = <C extends JsonFormsControl>(
    fixture: ComponentFixture<C>,
    testData: TestData,
    expectations: () => any
) => {
    const mockSubStore: Subject<any> = setupMockStore(fixture, testData);
    fixture.componentInstance.ngOnInit();
    mockSubStore.complete();
    expectations();
};

export const updateFloatState = <C extends JsonFormsControl>(
    fixture: ComponentFixture<C>,
    testData: TestData,
    expectations: () => any
) => {
    const mockSubStore: Subject<any> = setupMockStore(fixture, testData);
    mockSubStore.next({
        jsonforms: {
            core: {
                data: { foo: 456.456 },
                schema: testData.schema,
            }
        }
    });
    fixture.componentInstance.ngOnInit();
    mockSubStore.complete();
    fixture.detectChanges();

    expectations();
};

export const updateWithUndefined = <C extends JsonFormsControl>(
    fixture: ComponentFixture<C>,
    testData: TestData,
    expectations: () => any
) => {
    const mockSubStore: Subject<any> = setupMockStore(fixture, testData);
    mockSubStore.next({
        jsonforms: {
            core: {
                data: { foo: undefined },
                schema: testData.schema,
            }
        }
    });
    fixture.componentInstance.ngOnInit();
    mockSubStore.complete();
    fixture.detectChanges();
    expectations();
};

export const updateWithNull = <C extends JsonFormsControl>(
    fixture: ComponentFixture<C>,
    testData: TestData,
    expectations: () => any
) => {
    const mockSubStore: Subject<any> = setupMockStore(fixture, testData);
    mockSubStore.next({
        jsonforms: {
            core: {
                data: { foo: null },
                schema: testData.schema,
            }
        }
    });
    fixture.componentInstance.ngOnInit();
    mockSubStore.complete();
    fixture.detectChanges();
    expectations();
};

export const updateWithSiblingValue = <C extends JsonFormsControl>(
    fixture: ComponentFixture<C>,
    testData: TestData,
    expectations: () => any
) => {
    const mockSubStore = setupMockStore(fixture, testData);
    mockSubStore.next({
        jsonforms: {
            core: {
                data: { foo: 123.123, bar: 456.456 },
                schema: testData.schema,
            }
        }
    });
    fixture.componentInstance.ngOnInit();
    mockSubStore.complete();
    expectations();
};

export const canBeDisabled = <C extends JsonFormsControl>(
    fixture: ComponentFixture<C>,
    testData: TestData,
    expectations: () => any
) => {
    const mockSubStore: Subject<any> = setupMockStore(fixture, testData);
    const component = fixture.componentInstance;
    component.disabled = true;
    component.ngOnInit();
    mockSubStore.complete();
    fixture.detectChanges();
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
    testData: TestData,
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
                errors: [{
                    dataPath: 'foo',
                    message: 'Hi, this is me, test error!'
                }]
            }
        },
    });
    mockSubStore.complete();
    fixture.detectChanges();
    component.ngOnInit();
    expectations();
};

export const additionalProps = <C extends JsonFormsControl>(
    fixture: ComponentFixture<C>,
    testData: TestData,
    expectations: () => any
) => {
    const mockSubStore = setupMockStore(fixture, testData);
    mockSubStore.complete();
    fixture.componentInstance.ngOnInit();
    expectations();
};

export const numberBaseTest = <C extends JsonFormsControl>(
    testConfig: TestConfig<C>,
    instance: string,
    elementToUse: (element: DebugElement) => any,
    testData: TestData = defaultTestData
) => () => {
    let fixture: ComponentFixture<any>;
    let numberElement: DebugElement;
    let numberNativeElement: any;
    let component: C;

    baseSetup(testConfig);

    beforeEach(() => {
        const preparedComponents = prepareComponent(testConfig, instance, elementToUse);
        fixture = preparedComponents.fixture;
        numberNativeElement = preparedComponents.numberNativeElement;
        numberElement = preparedComponents.numberElement;
        component = preparedComponents.component;
    });

    it('should render floats', () => {
        renderFloat(fixture, testData, () => {
            expect(component.data).toBe(123.123);
            expect(numberNativeElement.valueAsNumber).toBe(123.123);
            // step is of type string
            expect(numberNativeElement.step).toBe('0.1');
            expect(numberNativeElement.disabled).toBe(false);
        });
    });

    it('should render integers', () => {
        renderInteger(
            fixture,
            {
                data: {foo: 123},
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
                expect(numberNativeElement.valueAsNumber).toBe(123);
                // step is of type string
                expect(numberNativeElement.step).toBe('1');
                expect(numberNativeElement.disabled).toBe(false);
            }
        );
    });

    it('should support updating the state', () => {
        updateFloatState(fixture, testData, () => {
            expect(component.data).toBe(456.456);
            expect(numberNativeElement.valueAsNumber).toBe(456.456);
        });
    });

    it('should update with undefined value', () => {
        updateWithUndefined(fixture, testData, () => {
            expect(component.data).toBe(undefined);
            expect(numberNativeElement.valueAsNumber).toBeNaN();
        });
    });

    it('should update with null value', () => {
        updateWithNull(fixture, testData, () => {
            expect(component.data).toBe(null);
            expect(numberNativeElement.valueAsNumber).toBeNaN();
        });
    });

    it('should not update with wrong ref', () => {
        updateWithSiblingValue(fixture, testData, () => {
            expect(component.data).toBe(123.123);
            expect(numberNativeElement.valueAsNumber).toBe(123.123);
        });
    });

    // store needed as we evaluate the calculated enabled value to disable/enable the control
    it('can be disabled', () => {
        canBeDisabled(fixture, testData, () => {
            expect(numberNativeElement.disabled).toBe(true);
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
    testData: TestData = defaultTestData) => () => {
    let fixture: ComponentFixture<any>;
    let numberNativeElement: any;
    let component: C;

    baseSetup(testConfig);

    beforeEach(() => {
        const preparedComponents = prepareComponent(testConfig, instance, elementToUse);
        fixture = preparedComponents.fixture;
        numberNativeElement = preparedComponents.numberNativeElement;
        component = preparedComponents.component;
    });

    it('should update via input event', () => {

        const mockSubStore = MockNgRedux.getSelectorStub();
        component.uischema = testData.uischema;

        mockSubStore.next({
            jsonforms: {
                core: {
                    data: testData.data,
                    schema: testData.schema,
                }
            }
        });
        mockSubStore.complete();
        fixture.detectChanges();
        component.ngOnInit();

        const spy = spyOn(component, 'onChange');
        numberNativeElement.valueAsNumber = 456.456;
        if (numberNativeElement.dispatchEvent) {
            numberNativeElement.dispatchEvent(new Event('change'));
        }
        // trigger change detection
        fixture.detectChanges();
        expect(spy).toHaveBeenCalled();
        expect(numberNativeElement.valueAsNumber).toBe(456.456);
    });
};
export const numberErrorTest = <C extends JsonFormsControl>(
    testConfig: TestConfig<C>,
    errorTestInformation: ErrorTestExpectation,
    testData: TestData = defaultTestData) => () => {

    let fixture: ComponentFixture<any>;

    baseSetup(testConfig);

    beforeEach(() => {
        const preparedComponents = prepareComponent(testConfig);
        fixture = preparedComponents.fixture;
    });

    it('should display errors', () => {
        showErrors(fixture, testData, () => {
            const debugErrors: DebugElement[] =
                fixture.debugElement.queryAll(By.directive(errorTestInformation.errorInstance));
            expect(debugErrors.length).toBe(errorTestInformation.numberOfElements);
            expect(debugErrors[errorTestInformation.indexOfElement].nativeElement.textContent)
                .toBe('Hi, this is me, test error!');
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
export const additionalTestData: TestData = {
    data: defaultData,
    schema: additionalSchema,
    uischema: defaultUischema
};

export const numberAdditionalPropsTest = <C extends JsonFormsControl>(
    testConfig: TestConfig<C>,
    instance: string,
    elementToUse: (element: DebugElement) => any,
    testData: TestData = additionalTestData
) => () => {
    let fixture: ComponentFixture<any>;
    let numberNativeElement: any;

    baseSetup(testConfig);

    beforeEach(() => {
        const preparedComponents = prepareComponent(testConfig, instance, elementToUse);
        fixture = preparedComponents.fixture;
        numberNativeElement = preparedComponents.numberNativeElement;
    });

    it('should respect min,max,multipleOf', () => {
        additionalProps(fixture, testData, () => {
            // step, min and max are of type string on an input control
            expect(numberNativeElement.step).toBe('3');
            expect(numberNativeElement.min).toBe('-42.42');
            expect(numberNativeElement.max).toBe('42');
        });
    });
};
