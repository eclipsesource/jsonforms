import { MockNgRedux } from '@angular-redux/store/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { JsonFormsControl } from '@jsonforms/angular';
import { ControlElement, JsonSchema } from '@jsonforms/core';
import { baseSetup, ErrorTestExpectation, TestConfig, TestData } from './util';

interface ComponentResult<C extends JsonFormsControl> {
    fixture: ComponentFixture<any>;
    component: C;
    textElement?: DebugElement;
    textNativeElement?: any;
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
        const textElement = fixture.debugElement.query(By.css(instance));
        const textNativeElement = elementToUse(textElement);
        result.textElement = textElement;
        result.textNativeElement = textNativeElement;
    }

    return result;
};
const defaultData = { foo: 'foo' };
const defaultSchema: JsonSchema = {
    type: 'object',
    properties: {
        foo: {
            type: 'string'
        }
    }
};
const defaultUischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo'
};
const defaultTestData: TestData = {
    data: defaultData,
    schema: defaultSchema,
    uischema: defaultUischema
};
export const textBaseTest = <C extends JsonFormsControl>(
    testConfig: TestConfig<C>,
    instance: string,
    elementToUse: (element: DebugElement) => any,
    testData: TestData = defaultTestData  ) => () => {
        let fixture: ComponentFixture<any>;
        let textElement: DebugElement;
        let textNativeElement: any;
        let component: C;

        baseSetup(testConfig);

        beforeEach(() => {
            const preparedComponents = prepareComponent(testConfig, instance, elementToUse);
            fixture = preparedComponents.fixture;
            textNativeElement = preparedComponents.textNativeElement;
            textElement = preparedComponents.textElement;
            component = preparedComponents.component;
        });

        it('should render', () => {
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
            expect(component.data).toBe('foo');
            expect(textNativeElement.value).toBe('foo');
            expect(textNativeElement.disabled).toBe(false);
        });

        it('should support updating the state', () => {
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
            fixture.detectChanges();
            component.ngOnInit();

            mockSubStore.next({
                jsonforms: {
                    core: {
                        data: { foo: 'bar' },
                        schema: testData.schema,
                    }
                }
            });
            mockSubStore.complete();
            fixture.detectChanges();
            expect(component.data).toBe('bar');
            expect(textNativeElement.value).toBe('bar');
        });
        it('should update with undefined value', () => {
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
            fixture.detectChanges();
            component.ngOnInit();

            mockSubStore.next({
                jsonforms: {
                    core: {
                        data: { foo: undefined },
                        schema: testData.schema,
                    }
                }
            });
            mockSubStore.complete();
            fixture.detectChanges();
            expect(component.data).toBe(undefined);
            expect(textNativeElement.value).toBe('');
        });
        it('should update with null value', () => {
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
            fixture.detectChanges();
            component.ngOnInit();

            mockSubStore.next({
                jsonforms: {
                    core: {
                        data: { foo: null },
                        schema: testData.schema,
                    }
                }
            });
            mockSubStore.complete();
            fixture.detectChanges();
            expect(component.data).toBe(null);
            expect(textNativeElement.value).toBe('');
        });
        it('should not update with wrong ref', () => {
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
            fixture.detectChanges();
            component.ngOnInit();

            mockSubStore.next({
                jsonforms: {
                    core: {
                        data: { foo: 'foo', bar: 'bar' },
                        schema: testData.schema,
                    }
                }
            });
            mockSubStore.complete();
            fixture.detectChanges();
            expect(component.data).toBe('foo');
            expect(textNativeElement.value).toBe('foo');
        });
        // store needed as we evaluate the calculated enabled value to disable/enable the control
        it('can be disabled', () => {
            const mockSubStore = MockNgRedux.getSelectorStub();
            component.uischema = testData.uischema;
            component.disabled = true;

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
            expect(textNativeElement.disabled).toBe(true);

        });
        it('id should be present in output', () => {
            component.uischema = testData.uischema;
            component.id = 'myId';

            fixture.detectChanges();
            component.ngOnInit();
            expect(textElement.nativeElement.id).toBe('myId');

        });
    };
export const textInputEventTest = <C extends JsonFormsControl>(
    testConfig: TestConfig<C>,
    instance: string,
    elementToUse: (element: DebugElement) => any,
    testData: TestData = defaultTestData) => () => {
        let fixture: ComponentFixture<any>;
        let textNativeElement;
        let component: C;

        baseSetup(testConfig);

        beforeEach(() => {
            const preparedComponents = prepareComponent(testConfig, instance, elementToUse);
            fixture = preparedComponents.fixture;
            textNativeElement = preparedComponents.textNativeElement;
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
            textNativeElement.value = 'bar';
            if (textNativeElement.dispatchEvent) {
                textNativeElement.dispatchEvent(new Event('change'));
            }
            // trigger change detection
            fixture.detectChanges();
            expect(spy).toHaveBeenCalled();
            expect(textNativeElement.value).toBe('bar');
        });
    };
export const textErrorTest = <C extends JsonFormsControl>(
    testConfig: TestConfig<C>,
    errorTestInformation: ErrorTestExpectation,
    testData: TestData = defaultTestData) => () => {
        let fixture: ComponentFixture<any>;
        let component: C;

        baseSetup(testConfig);

        beforeEach(() => {
            const preparedComponents = prepareComponent(testConfig);
            fixture = preparedComponents.fixture;
            component = preparedComponents.component;
        });
        it('should display errors', () => {
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
            const debugErrors: DebugElement[] =
                fixture.debugElement.queryAll(By.directive(errorTestInformation.errorInstance));
            expect(debugErrors.length).toBe(errorTestInformation.numberOfElements);
            expect(debugErrors[errorTestInformation.indexOfElement].nativeElement.textContent)
                .toBe('Hi, this is me, test error!');
        });
    };
export const textTypeTest = <C extends JsonFormsControl>(
    testConfig: TestConfig<C>,
    instance: string,
    elementToUse: (element: DebugElement) => any,
    testData: TestData = defaultTestData) => () => {
        let fixture: ComponentFixture<any>;
        let component: C;
        let textNativeElement;

        baseSetup(testConfig);

        beforeEach(() => {
            const preparedComponents = prepareComponent(testConfig, instance, elementToUse);
            fixture = preparedComponents.fixture;
            component = preparedComponents.component;
            textNativeElement = preparedComponents.textNativeElement;
        });
        it('should show password independent of schema', () => {
            const uischema = JSON.parse(JSON.stringify(testData.uischema));
            uischema.options = {format: 'password'};
            const schema = JSON.parse(JSON.stringify(testData.schema));
            schema.properties.foo.format = 'email';

            const mockSubStore = MockNgRedux.getSelectorStub();
            component.uischema = uischema;
            component.schema = schema;

            mockSubStore.next({
                jsonforms: {
                    core: {
                        data: testData.data,
                        schema: schema
                    }
                },
            });
            mockSubStore.complete();
            fixture.detectChanges();
            component.ngOnInit();
            expect(textNativeElement.type).toBe('password');
        });
        it('should show email', () => {
            const schema = JSON.parse(JSON.stringify(testData.schema));
            schema.properties.foo.format = 'email';

            const mockSubStore = MockNgRedux.getSelectorStub();
            component.uischema = testData.uischema;
            component.schema = schema;

            mockSubStore.next({
                jsonforms: {
                    core: {
                        data: testData.data,
                        schema: schema
                    }
                },
            });
            mockSubStore.complete();
            component.ngOnInit();
            fixture.detectChanges();
            expect(textNativeElement.type).toBe('email');
        });
        it('should show tel', () => {
            const schema = JSON.parse(JSON.stringify(testData.schema));
            schema.properties.foo.format = 'tel';

            const mockSubStore = MockNgRedux.getSelectorStub();
            component.uischema = testData.uischema;
            component.schema = schema;

            mockSubStore.next({
                jsonforms: {
                    core: {
                        data: testData.data,
                        schema: schema
                    }
                },
            });
            mockSubStore.complete();
            fixture.detectChanges();
            component.ngOnInit();
            expect(textNativeElement.type).toBe('tel');
        });
        it('should fallback to text', () => {
            const schema = JSON.parse(JSON.stringify(testData.schema));
            schema.properties.foo.format = 'foo';

            const mockSubStore = MockNgRedux.getSelectorStub();
            component.uischema = testData.uischema;
            component.schema = schema;

            mockSubStore.next({
                jsonforms: {
                    core: {
                        data: testData.data,
                        schema: schema
                    }
                },
            });
            mockSubStore.complete();
            fixture.detectChanges();
            component.ngOnInit();
            expect(textNativeElement.type).toBe('text');
        });
    };
