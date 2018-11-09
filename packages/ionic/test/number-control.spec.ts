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
import { NumberControlRenderer, numberControlTester } from '../src';
import { By } from '@angular/platform-browser';
import { MockNgRedux } from '@angular-redux/store/testing';
import {
    additionalTestData,
    canBeDisabled,
    defaultTestData,
    initAndExpect,
    initComponent,
    mustHaveId,
    setupMockStore,
    showErrors,
    updateFloatState,
    updateWithNull,
    updateWithSiblingValue,
    updateWithUndefined
} from '@jsonforms/angular-test';
import { NgRedux } from '@angular-redux/store';
import { IonicModule, Label, Platform, TextInput } from 'ionic-angular';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { PlatformMock } from '../test-config/platform-mock';

describe('Number field tester', () => {
    const uischema = {
        type: 'Control',
        scope: '#/properties/foo'
    };

    it('should succeed with floats', () => {
        expect(
            numberControlTester(
                uischema,
                {
                    type: 'object',
                    properties: {
                        foo: { type: 'number' }
                    }
                }
            )
        ).toBe(2);
    });
    it('should succeed with integers', () => {
        expect(
            numberControlTester(
                uischema,
                {
                    type: 'object',
                    properties: {
                        foo: { type: 'integer' }
                    }
                }
            )
        ).toBe(2);
    });
});

describe(
    'Ionic number control', () => {
        let fixture: ComponentFixture<any>;
        let component: any;
        let textInput: DebugElement;
        let textInputInstance: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [NumberControlRenderer],
                imports: [IonicModule.forRoot(NumberControlRenderer)],
                providers: [
                    { provide: Platform, useClass: PlatformMock },
                    { provide: NgRedux, useFactory: MockNgRedux.getInstance }
                ]
            }).compileComponents();

            MockNgRedux.reset();
            fixture = TestBed.createComponent(NumberControlRenderer);
            component = fixture.componentInstance;
            textInput = fixture.debugElement.query(By.directive(TextInput));
            textInputInstance = textInput.componentInstance;
        });

        it('should render floats', () => {
            initAndExpect(fixture, defaultTestData, () => {
                expect(textInputInstance.value).toBe(123.123);
                expect(textInputInstance.step).toBe(0.1);
                expect(textInputInstance.disabled).toBe(false);
            });
        });

        it('should render integer', () => {
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
                    uischema: defaultTestData.uischema
                },
                () => {
                    expect(textInputInstance.value).toBe(123);
                    expect(textInputInstance.step).toBe(1);
                    expect(textInputInstance.disabled).toBe(false);
                });
        });

        it('should support updating the state', () => {
            updateFloatState(fixture, defaultTestData, () => {
                expect(textInputInstance.value).toBe(456.456);
            });
        });

        // possibly related to https://github.com/ionic-team/ionic/issues/14370
        xit('should support updating with undefined', () => {
            updateWithUndefined(fixture, defaultTestData, () => {
                // not undefined
                expect(textInputInstance.value).toBe(undefined);
            });
        });

        // possibly related to https://github.com/ionic-team/ionic/issues/14370
        xit('should support updating with null', () => {
            updateWithNull(fixture, defaultTestData, () => {
                // not null
                expect(textInputInstance.value).toBe(null);
            });
        });

        it('should not update with wrong ref', () => {
            updateWithSiblingValue(fixture, defaultTestData, () => {
                expect(textInputInstance.value).toBe(123.123);
            });
        });

        // store needed as we evaluate the calculated enabled value to disable/enable the control
        // also, see https://github.com/ionic-team/ionic/issues/5280
        it('can be disabled', () => {
            canBeDisabled(fixture, defaultTestData, () => {
                expect(textInputInstance.disabled).toBe(true);
            });
        });

        it('id should be present in output', () => {
            mustHaveId(fixture, () => {
                expect(textInput.nativeElement.id).toBe('myId');
            });
        });

        it('should support input event changes', async(() => {
            initComponent(fixture, setupMockStore(fixture, defaultTestData));

            const spy = spyOn(component, 'onChange');
            textInput.componentInstance.ionChange.emit(456.456);
            fixture.detectChanges();
            expect(spy).toHaveBeenCalled();
        }));

        it('should show errors', () => {
            showErrors(fixture, defaultTestData, () => {
                const debugError: DebugElement =
                    fixture.debugElement.queryAll(By.directive(Label))[1];
                expect(debugError.nativeElement.textContent).toBe('Hi, this is me, test error!');
            });
        });

        it('should support additional props', () => {
            initAndExpect(fixture, additionalTestData, () => {
                expect(textInput.componentInstance.step).toBe(3);
                expect(textInput.componentInstance.min).toBe(-42.42);
                expect(textInput.componentInstance.max).toBe(42);
            });
        });
    });
