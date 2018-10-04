import { MockNgRedux } from '@angular-redux/store/testing';
import { DebugElement, Type } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { JsonFormsControl } from '@jsonforms/angular';
import { ControlElement, JsonSchema } from '@jsonforms/core';
import { By } from '@angular/platform-browser';
import { ErrorTestInformation } from './util';

export const textTest = <C extends JsonFormsControl>(
    imports: any[],
    providers: any[],
    componentUT: Type<C>,
    instance: string,
    errorTestInformation: ErrorTestInformation,
    elementToUse: (element: DebugElement) => any) => () => {
        let fixture: ComponentFixture<any>;
        let textElement: DebugElement;
        let textNativeElement;
        let component: C;

        const data = { foo: 'foo' };
        const schema: JsonSchema = {
            type: 'object',
            properties: {
                foo: {
                    type: 'string'
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
            textElement = fixture.debugElement.query(By.css(instance));
            textNativeElement = elementToUse(textElement);
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
            expect(component.data).toBe('foo');
            expect(textNativeElement.value).toBe('foo');
            expect(textNativeElement.disabled).toBe(false);
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

            expect(component.data).toBe('foo');
            expect(textNativeElement.value).toBe('foo');

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
            expect(component.data).toBe('foo');
            expect(textNativeElement.value).toBe('foo');

            mockSubStore.next({
                jsonforms: {
                    core: {
                        data: { foo: 'bar' },
                        schema,
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
            expect(component.data).toBe('foo');
            expect(textNativeElement.value).toBe('foo');

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
            expect(textNativeElement.value).toBe('');
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
            expect(component.data).toBe('foo');
            expect(textNativeElement.value).toBe('foo');

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
            expect(textNativeElement.value).toBe('');
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
            expect(component.data).toBe('foo');
            expect(textNativeElement.value).toBe('foo');

            mockSubStore.next({
                jsonforms: {
                    core: {
                        data: { foo: 'foo', bar: 'bar' },
                        schema,
                    }
                }
            });
            mockSubStore.complete();
            fixture.detectChanges();
            expect(component.data).toBe('foo');
            expect(textNativeElement.value).toBe('foo');
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
            expect(textNativeElement.disabled).toBe(true);

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
            expect(textElement.nativeElement.id).toBe('myId');

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
            fixture.detectChanges();
            component.ngOnInit();
            const debugErrors: DebugElement[] =
                fixture.debugElement.queryAll(By.directive(errorTestInformation.errorInstance));
            expect(debugErrors.length).toBe(errorTestInformation.numberOfElements);
            expect(debugErrors[errorTestInformation.indexOfElement].nativeElement.textContent)
                .toBe('Hi, this is me, test error!');
        });
    };
