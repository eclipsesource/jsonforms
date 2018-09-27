/*
  The MIT License
  
  Copyright (c) 2018 EclipseSource Munich
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
import { NgRedux } from '@angular-redux/store';
import { MockNgRedux } from '@angular-redux/store/testing';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCheckbox, MatCheckboxModule, MatError, MatFormFieldModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { NOT_APPLICABLE } from '@jsonforms/core';
import { BooleanControlRenderer, booleanControlTester } from '../src';

const uischema = {
    type: 'Control',
    scope: '#/properties/foo'
};

describe('Material boolean field tester', () => {
    it('should fail', () => {
        expect(booleanControlTester(undefined, undefined)).toBe(NOT_APPLICABLE);
        expect(booleanControlTester(null, undefined)).toBe(NOT_APPLICABLE);
        expect(booleanControlTester({ type: 'Foo' }, undefined)).toBe(NOT_APPLICABLE);
        expect(booleanControlTester({ type: 'Control' }, undefined)).toBe(NOT_APPLICABLE);
        expect(
            booleanControlTester(
                uischema,
                { type: 'object', properties: { foo: { type: 'string' } } }
            )
        ).toBe(NOT_APPLICABLE);
        expect(
            booleanControlTester(
                uischema,
                {
                    type: 'object',
                    properties: {
                        foo: {
                            type: 'string'
                        },
                        bar: {
                            type: 'boolean'
                        }
                    }
                }
            )
        ).toBe(NOT_APPLICABLE);
    });

    it('should succeed', () => {
        expect(
            booleanControlTester(
                uischema,
                {
                    type: 'object',
                    properties: {
                        foo: {
                            type: 'boolean'
                        }
                    }
                }
            )
        ).toBe(2);
    });
});
describe('Boolean control', () => {
    let fixture: ComponentFixture<any>;
    let checkboxDebugElement: DebugElement;
    let checkboxNativeElement: HTMLElement;
    let checkboxInstance: MatCheckbox;
    let component: BooleanControlRenderer;
    let labelElement: HTMLLabelElement;

    const data = { foo: true };
    const schema = {
        type: 'object',
        properties: {
            foo: {
                type: 'boolean'
            }
        }
    };

    const getImports = () => [
        MatCheckboxModule,
        MatFormFieldModule
    ];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BooleanControlRenderer],
            imports: getImports(),
            providers: [
                { provide: NgRedux, useFactory: MockNgRedux.getInstance }
            ]
        }).compileComponents();

        MockNgRedux.reset();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BooleanControlRenderer);
        component = fixture.componentInstance;
        checkboxDebugElement = fixture.debugElement.query(By.directive(MatCheckbox));
        checkboxInstance = checkboxDebugElement.componentInstance;
        checkboxNativeElement = checkboxDebugElement.nativeElement;
        labelElement = checkboxNativeElement.querySelector('label');
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
        expect(component.value).toBe(true);
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

        expect(component.value).toBe(true);
        expect(checkboxInstance.checked).toBe(true);

        const spy = spyOn(component, 'onChange');
        labelElement.click();
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
        mockSubStore.complete();
        fixture.detectChanges();
        component.ngOnInit();
        expect(component.value).toBe(true);
        expect(checkboxInstance.checked).toBe(true);

        MockNgRedux.reset();
        const mockSubStore2 = MockNgRedux.getSelectorStub();
        mockSubStore2.next({
            jsonforms: {
                core: {
                    data: { foo: false },
                    schema,
                }
            }
        });
        mockSubStore2.complete();
        component.subscribe();
        expect(component.value).toBe(false);
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
        mockSubStore.complete();
        fixture.detectChanges();
        component.ngOnInit();
        expect(component.value).toBe(true);
        expect(checkboxInstance.checked).toBe(true);

        MockNgRedux.reset();
        const mockSubStore2 = MockNgRedux.getSelectorStub();
        mockSubStore2.next({
            jsonforms: {
                core: {
                    data: { foo: undefined },
                    schema,
                }
            }
        });
        mockSubStore2.complete();
        component.subscribe();
        fixture.detectChanges();
        expect(component.value).toBe(false);
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
        mockSubStore.complete();
        fixture.detectChanges();
        component.ngOnInit();
        expect(component.value).toBe(true);
        expect(checkboxInstance.checked).toBe(true);

        MockNgRedux.reset();
        const mockSubStore2 = MockNgRedux.getSelectorStub();
        mockSubStore2.next({
            jsonforms: {
                core: {
                    data: { foo: null },
                    schema,
                }
            }
        });
        mockSubStore2.complete();
        component.subscribe();
        fixture.detectChanges();
        expect(component.value).toBe(false);
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
        mockSubStore.complete();
        fixture.detectChanges();
        component.ngOnInit();
        expect(component.value).toBe(true);
        expect(checkboxInstance.checked).toBe(true);

        MockNgRedux.reset();
        const mockSubStore2 = MockNgRedux.getSelectorStub();
        mockSubStore2.next({
            jsonforms: {
                core: {
                    data: { foo: true, bar: false },
                    schema,
                }
            }
        });
        mockSubStore2.complete();
        component.subscribe();
        fixture.detectChanges();
        expect(component.value).toBe(true);
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
        expect(checkboxInstance.id).toBe('myId');

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
        const debugErrors: DebugElement[] = fixture.debugElement.queryAll(By.directive(MatError));
        expect(debugErrors.length).toBe(1);
        expect(debugErrors[0].nativeElement.textContent).toBe('Hi, this is me, test error!');
    });
});
