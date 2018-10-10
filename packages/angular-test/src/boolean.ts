import { MockNgRedux } from '@angular-redux/store/testing';
import { DebugElement, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { JsonFormsControl } from '@jsonforms/angular';
import { ControlElement, JsonSchema } from '@jsonforms/core';
import { baseSetup, ErrorTestExpectation, TestConfig } from './util';

const prepareComponent = <C extends JsonFormsControl, I>
    (testConfig: TestConfig<C>, instance: Type<I>) => {
    const fixture = TestBed.createComponent(testConfig.componentUT);
    const component = fixture.componentInstance;
    const checkboxDebugElement = fixture.debugElement.query(By.directive(instance));
    const checkboxInstance = checkboxDebugElement.componentInstance;
    const checkboxNativeElement = checkboxDebugElement.nativeElement;

    return { fixture, component, checkboxInstance, checkboxNativeElement };
};

const data = { foo: true };
const schema: JsonSchema = {
    type: 'object',
    properties: {
        foo: {
            type: 'boolean'
        }
    }
};
const uischema: ControlElement = {
    type: 'Control',
    scope: '#/properties/foo'
};

export const booleanBaseTest = <C extends JsonFormsControl, I>
    (testConfig: TestConfig<C>, instance: Type<I>) => () => {
    let fixture: ComponentFixture<any>;
    let checkboxNativeElement: HTMLElement;
    let checkboxInstance: any;
    let component: C;

    baseSetup(testConfig);

    beforeEach(() => {
        const preparedComponents = prepareComponent(testConfig, instance);
        fixture = preparedComponents.fixture;
        checkboxNativeElement = preparedComponents.checkboxNativeElement;
        checkboxInstance = preparedComponents.checkboxInstance;
        component = preparedComponents.component;
    });

    it('should render', () => {
        const mockSubStore = MockNgRedux.getSelectorStub();
        component.uischema = uischema;

        mockSubStore.next({
            jsonforms: {
                core: {
                    data,
                    schema,
                }
            }
        });
        mockSubStore.complete();
        fixture.detectChanges();
        component.ngOnInit();
        expect(component.data).toBe(true);
        expect(checkboxInstance.checked).toBe(true);
        expect(checkboxInstance.disabled).toBe(false);
    });
    it('should support updating the state', () => {
        const mockSubStore = MockNgRedux.getSelectorStub();
        component.uischema = uischema;

        mockSubStore.next({
            jsonforms: {
                core: {
                    data,
                    schema,
                }
            }
        });
        fixture.detectChanges();
        component.ngOnInit();

        mockSubStore.next({
            jsonforms: {
                core: {
                    data: { foo: false },
                    schema,
                }
            }
        });
        mockSubStore.complete();
        fixture.detectChanges();
        expect(component.data).toBe(false);
        expect(checkboxInstance.checked).toBe(false);
    });
    it('should update with undefined value', () => {
        const mockSubStore = MockNgRedux.getSelectorStub();
        component.uischema = uischema;

        mockSubStore.next({
            jsonforms: {
                core: {
                    data,
                    schema,
                }
            }
        });
        fixture.detectChanges();
        component.ngOnInit();

        mockSubStore.next({
            jsonforms: {
                core: {
                    data: { foo: undefined },
                    schema,
                }
            }
        });
        mockSubStore.complete();
        fixture.detectChanges();
        expect(component.data).toBe(undefined);
        expect(checkboxInstance.checked).toBe(false);
    });
    it('should update with null value', () => {
        const mockSubStore = MockNgRedux.getSelectorStub();
        component.uischema = uischema;

        mockSubStore.next({
            jsonforms: {
                core: {
                    data,
                    schema,
                }
            }
        });
        fixture.detectChanges();
        component.ngOnInit();

        mockSubStore.next({
            jsonforms: {
                core: {
                    data: { foo: null },
                    schema,
                }
            }
        });
        mockSubStore.complete();
        fixture.detectChanges();
        expect(component.data).toBe(null);
        expect(checkboxInstance.checked).toBe(false);
    });
    it('should not update with wrong ref', () => {
        const mockSubStore = MockNgRedux.getSelectorStub();
        component.uischema = uischema;

        mockSubStore.next({
            jsonforms: {
                core: {
                    data,
                    schema,
                }
            }
        });
        fixture.detectChanges();
        component.ngOnInit();

        mockSubStore.next({
            jsonforms: {
                core: {
                    data: { foo: true, bar: false },
                    schema,
                }
            }
        });
        mockSubStore.complete();
        fixture.detectChanges();
        expect(component.data).toBe(true);
        expect(checkboxInstance.checked).toBe(true);
    });
    // store needed as we evaluate the calculated enabled value to disable/enable the control
    it('can be disabled', () => {
        const mockSubStore = MockNgRedux.getSelectorStub();
        component.uischema = uischema;
        component.disabled = true;

        mockSubStore.next({
            jsonforms: {
                core: {
                    data,
                    schema,
                }
            }
        });
        mockSubStore.complete();
        fixture.detectChanges();
        component.ngOnInit();
        expect(checkboxInstance.disabled).toBe(true);

    });
    it('id should be present in output', () => {
        component.uischema = uischema;
        component.id = 'myId';

        fixture.detectChanges();
        component.ngOnInit();
        expect(checkboxNativeElement.id).toBe('myId');

    });

};
export const booleanInputEventTest = <C extends JsonFormsControl, I>
    (testConfig: TestConfig<C>, instance: Type<I>, selectorForClick: string) => () => {

        let fixture: ComponentFixture<any>;
        let checkboxNativeElement: HTMLElement;
        let checkboxInstance: any;
        let component: C;
        let elementToClick: any;

        baseSetup(testConfig);

        beforeEach(() => {
            const preparedComponents = prepareComponent(testConfig, instance);
            fixture = preparedComponents.fixture;
            checkboxNativeElement = preparedComponents.checkboxNativeElement;
            checkboxInstance = preparedComponents.checkboxInstance;
            component = preparedComponents.component;

            elementToClick = checkboxNativeElement.querySelector(selectorForClick);
        });

        it('should update via input event', () => {

            const mockSubStore = MockNgRedux.getSelectorStub();
            component.uischema = uischema;

            mockSubStore.next({
                jsonforms: {
                    core: {
                        data,
                        schema,
                    }
                }
            });
            mockSubStore.complete();
            fixture.detectChanges();
            component.ngOnInit();

            const spy = spyOn(component, 'onChange');
            elementToClick.click();
            // trigger change detection
            fixture.detectChanges();

            expect(spy).toHaveBeenCalled();
            expect(checkboxInstance.checked).toBe(false);
        });
    };
export const booleanErrorTest = <C extends JsonFormsControl, I>
    (testConfig: TestConfig<C>, instance: Type<I>, errorTestInformation: ErrorTestExpectation) =>
        () => {

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
            component.uischema = uischema;

            mockSubStore.next({
                jsonforms: {
                    core: {
                        data,
                        schema,
                        errors: [{
                            dataPath: 'foo',
                            message: 'Hi, this is me, test error!'
                        }]
                    }
                },
            });
            mockSubStore.complete();
            component.ngOnInit();
            fixture.detectChanges();
            const debugErrors: DebugElement[] =
                fixture.debugElement.queryAll(By.directive(errorTestInformation.errorInstance));
            expect(debugErrors.length).toBe(errorTestInformation.numberOfElements);
            expect(debugErrors[errorTestInformation.indexOfElement].nativeElement.textContent)
                .toBe('Hi, this is me, test error!');
        });
    };
