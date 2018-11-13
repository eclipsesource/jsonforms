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
import { IonicModule, Label, Platform, Toggle } from 'ionic-angular';
import { NgRedux } from '@angular-redux/store';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockNgRedux } from '@angular-redux/store/testing';
import {
    additionalTestData,
    canBeDisabled,
    defaultBooleanTestData,
    defaultBooleanTestSchema,
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
import { By } from '@angular/platform-browser';
import { BooleanToggleControlRenderer, booleanToggleControlTester } from '../src';
import { DebugElement } from '@angular/core';
import { PlatformMock } from '../test-config/platform-mock';
import { Subject } from 'rxjs';
import { canBeHidden } from '@jsonforms/angular-test/lib';

describe('Ionic boolean toggle tester', () => {
    const uischema = {
        type: 'Control',
        scope: '#/properties/foo',
        options: {
            toggle: true
        }
    };

    it('should succeed', () => {
        expect(
            booleanToggleControlTester(
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
        ).toBe(3);
    });
});

describe(
    'Ionic boolean toggle control', () => {

        let fixture: ComponentFixture<any>;
        let component: any;
        let checkbox: DebugElement;
        let checkboxInstance: any;

        beforeEach(() => {
            TestBed.configureTestingModule({
                declarations: [BooleanToggleControlRenderer],
                imports: [IonicModule.forRoot(BooleanToggleControlRenderer)],
                providers: [
                    { provide: Platform, useClass: PlatformMock },
                    { provide: NgRedux, useFactory: MockNgRedux.getInstance }
                ]
            }).compileComponents();

            MockNgRedux.reset();
            fixture = TestBed.createComponent(BooleanToggleControlRenderer);
            component = fixture.componentInstance;
            checkbox = fixture.debugElement.query(By.directive(Toggle));
            checkboxInstance = checkbox.componentInstance;
        });

        it('should render', () => {
            initAndExpect(fixture, defaultBooleanTestData, () => {
                expect(component.data).toBe(true);
                expect(checkboxInstance.checked).toBe(true);
                expect(checkboxInstance.disabled).toBe(false);
                expect(checkbox.nativeElement.hidden).toBe(false);
            });
        });

        it('should support updating the state', () => {
            const mockSubStore: Subject<any> = setupMockStore(fixture, defaultBooleanTestData);
            fixture.detectChanges();
            component.ngOnInit();
            mockSubStore.next({
                jsonforms: {
                    core: {
                        data: { foo: false },
                        schema: defaultBooleanTestSchema,
                    }
                }
            });
            mockSubStore.complete();
            fixture.detectChanges();
            expect(component.data).toBe(false);
            expect(checkboxInstance.checked).toBe(false);
        });

        // possibly related to https://github.com/ionic-team/ionic/issues/14370
        xit('should support updating with undefined', () => {
            updateWithUndefined(fixture, defaultBooleanTestData, () => {
                // not undefined
                expect(checkboxInstance.value).toBe(undefined);
            });
        });

        // // possibly related to https://github.com/ionic-team/ionic/issues/14370
        xit('should support updating with null', () => {
            updateWithNull(fixture, defaultBooleanTestData, () => {
                // not null
                expect(checkboxInstance.value).toBe(null);
            });
        });

        it('should not update with wrong ref', () => {
            const mockSubStore = setupMockStore(fixture, defaultBooleanTestData);
            fixture.detectChanges();
            component.ngOnInit();
            mockSubStore.next({
                jsonforms: {
                    core: {
                        data: { foo: true, bar: false },
                        schema: defaultBooleanTestSchema,
                    }
                }
            });
            mockSubStore.complete();
            fixture.detectChanges();
            expect(component.data).toBe(true);
            expect(checkboxInstance.checked).toBe(true);
        });

        // store needed as we evaluate the calculated enabled value to disable/enable the control
        // also, see https://github.com/ionic-team/ionic/issues/5280
        it('can be disabled', () => {
            canBeDisabled(fixture, defaultBooleanTestData, () => {
                expect(checkboxInstance.disabled).toBe(true);
            });
        });

        it('can be hidden', () => {
            canBeHidden(fixture, defaultBooleanTestData, () => {
                expect(checkbox.nativeElement.hidden).toBe(true);
            });
        });

        it('id should be present in output', () => {
            mustHaveId(fixture, () => {
                expect(checkbox.nativeElement.id).toBe('myId');
            });
        });

        it('should update via input event', () => {
            const mockSubStore: Subject<any> = setupMockStore(fixture, defaultBooleanTestData);
            initComponent(fixture, mockSubStore);

            const spy = spyOn(component, 'onChange');
            const toggle = fixture.debugElement.query(By.directive(Toggle));
            // trigger change detection
            toggle.componentInstance.ionChange.emit(false);
            fixture.detectChanges();

            expect(spy).toHaveBeenCalled();
        });

        it('should show errors', () => {
            showErrors(fixture, defaultBooleanTestData, () => {
                const debugError: DebugElement =
                    fixture.debugElement.queryAll(By.directive(Label))[1];
                expect(debugError.nativeElement.textContent).toBe('Hi, this is me, test error!');
            });
        });
    });
