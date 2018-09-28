import { MockNgRedux } from '@angular-redux/store/testing';
import { DebugElement, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JsonFormsControl } from '@jsonforms/angular';
import { ControlElement, JsonSchema } from '@jsonforms/core';
import { By } from '@angular/platform-browser';

export interface ErrorTestInformation {
    errorInstance: Type<any>;
    numberOfElements: number;
    indexOfElement: number;
}

export const booleanTest = <C extends JsonFormsControl, I>(
    imports: any[],
    providers: any[],
    componentUT: Type<C>,
    instance: Type<I>,
    errorTestInformation: ErrorTestInformation,
    selectorForClick: string) => () => {
        let fixture: ComponentFixture<any>;
        let checkboxDebugElement: DebugElement;
        let checkboxNativeElement: HTMLElement;
        let checkboxInstance: any;
        let component: C;
        let elementToClick: HTMLLabelElement;

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

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [componentUT],
                imports: imports,
                providers: providers
            }).compileComponents();

            MockNgRedux.reset();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(componentUT);
            component = fixture.componentInstance;
            checkboxDebugElement = fixture.debugElement.query(By.directive(instance));
            checkboxInstance = checkboxDebugElement.componentInstance;
            checkboxNativeElement = checkboxDebugElement.nativeElement;
            elementToClick = checkboxNativeElement.querySelector(selectorForClick);
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

            expect(component.data).toBe(true);
            expect(checkboxInstance.checked).toBe(true);

            const spy = spyOn(component, 'onChange');
            elementToClick.click();
            // trigger change detection
            fixture.detectChanges();

            expect(spy).toHaveBeenCalled();
            expect(checkboxInstance.checked).toBe(false);
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
            expect(component.data).toBe(true);
            expect(checkboxInstance.checked).toBe(true);

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
            expect(component.data).toBe(true);
            expect(checkboxInstance.checked).toBe(true);

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
            expect(component.data).toBe(true);
            expect(checkboxInstance.checked).toBe(true);

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
            expect(component.data).toBe(true);
            expect(checkboxInstance.checked).toBe(true);

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
            const mockSubStore = MockNgRedux.getSelectorStub();
            component.uischema = uischema;
            component.id = 'myId';

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
            expect(checkboxNativeElement.id).toBe('myId');

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
