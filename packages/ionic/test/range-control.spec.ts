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
import {
  canBeDisabled,
  canBeHidden,
  initAndExpect,
  initComponent,
  rangeDefaultTestData,
  rangeDefaultUischema,
  setupMockStore,
  showErrors,
  updateFloatState,
  updateWithNull,
  updateWithSiblingNumberValue,
  updateWithUndefined
} from '@jsonforms/angular-test';
import { MockNgRedux } from '@angular-redux/store/testing';
import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { RangeControlRenderer, rangeControlTester } from '../src';
import { PlatformMock } from '../test-config/platform-mock';
import { IonicModule, Label, Platform } from 'ionic-angular';
import { NgRedux } from '@angular-redux/store';
import { Subject } from 'rxjs';

describe('Ionic range control tester', () => {
  const uischema = {
    type: 'Control',
    scope: '#/properties/foo',
    options: { slider: true }
  };

  it('should succeed with floats', () => {
    expect(
      rangeControlTester(uischema, {
        type: 'object',
        properties: {
          foo: {
            type: 'number',
            minimum: -42.42,
            maximum: 42.42,
            default: 0.42
          }
        }
      })
    ).toBe(4);
  });
  it('should succeed with integers', () => {
    expect(
      rangeControlTester(uischema, {
        type: 'object',
        properties: {
          foo: {
            type: 'integer',
            minimum: -42,
            maximum: 42,
            default: 1
          }
        }
      })
    ).toBe(4);
  });
});

describe('ionic range control', () => {
  let fixture: ComponentFixture<any>;
  let component: any;
  let rangeElement: DebugElement;
  let rangeInstance: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RangeControlRenderer],
      imports: [IonicModule.forRoot(RangeControlRenderer)],
      providers: [
        { provide: Platform, useClass: PlatformMock },
        { provide: NgRedux, useFactory: MockNgRedux.getInstance }
      ]
    }).compileComponents();

    MockNgRedux.reset();
    fixture = TestBed.createComponent(RangeControlRenderer);
    component = fixture.componentInstance;
    rangeElement = fixture.debugElement.queryAll(By.css('ion-range'))[0];
    rangeInstance = rangeElement.componentInstance;
  });

  // ngModel binding is async
  it('should render integer', async(() => {
    const schema = {
      type: 'object',
      properties: {
        foo: {
          type: 'integer',
          minimum: -41,
          maximum: 41,
          default: 1
        }
      }
    };
    initAndExpect(
      fixture,
      { uischema: rangeDefaultUischema, schema, data: { foo: 12 } },
      () =>
        fixture.whenStable().then(() => {
          expect(rangeInstance.value).toBe(12);
          expect(rangeInstance.step).toBe(1);
          expect(rangeInstance.min).toBe(-41);
          expect(rangeInstance.max).toBe(41);
          expect(rangeInstance.disabled).toBe(false);
        })
    );
  }));

  it('should render floats', async(() => {
    initAndExpect(fixture, rangeDefaultTestData, () =>
      fixture.whenStable().then(() => {
        expect(rangeInstance.value).toBe(1.234);
        // ionic rounds min, max, step
        // see https://github.com/ionic-team/ionic/issues/6812
        expect(rangeInstance.step).toBe(1);
        expect(rangeInstance.min).toBe(-42);
        expect(rangeInstance.max).toBe(42);
        expect(rangeInstance.disabled).toBe(false);
      })
    );
  }));

  it('should support updating the state', async(() => {
    updateFloatState(fixture, rangeDefaultTestData, () =>
      fixture.whenStable().then(() => {
        expect(rangeInstance.value).toBe(456.456);
      })
    );
  }));

  it('should update with undefined value', async(() => {
    updateWithUndefined(
      fixture,
      {
        ...rangeDefaultTestData,
        data: { foo: undefined }
      },
      () =>
        fixture.whenStable().then(() => {
          expect(component.data).toBe(undefined);
          expect(rangeInstance.value).toBe(0.42);
        })
    );
  }));

  it('should update with null value', async(() => {
    updateWithNull(
      fixture,
      {
        ...rangeDefaultTestData,
        data: { foo: null }
      },
      () =>
        fixture.whenStable().then(() => {
          expect(component.data).toBe(null);
          expect(rangeInstance.value).toBe(0.42);
        })
    );
  }));

  it('should not update with wrong ref', async(() => {
    updateWithSiblingNumberValue(
      fixture,
      {
        ...rangeDefaultTestData,
        data: { foo: 1.234, bar: 456.456 }
      },
      () =>
        fixture.whenStable().then(() => {
          expect(component.data).toBe(123.123);
          expect(rangeInstance.value).toBe(123.123);
        })
    );
  }));

  // store needed as we evaluate the calculated enabled value to disable/enable the control
  it('can be disabled', async(() => {
    canBeDisabled(fixture, rangeDefaultTestData, () =>
      fixture.whenStable().then(() => {
        expect(rangeElement.componentInstance.disabled).toBe(true);
      })
    );
  }));

  // store needed as we evaluate the calculated enabled value to disable/enable the control
  it('can be hidden', async(() => {
    canBeHidden(fixture, rangeDefaultTestData, () =>
      fixture
        .whenStable()
        .then(() => expect(rangeElement.nativeElement.hidden).toBe(true))
    );
  }));

  it('id should be present in output', async(() => {
    const mockSubStore: Subject<any> = setupMockStore(
      fixture,
      rangeDefaultTestData
    );
    component.id = 'myId';
    initComponent(fixture, mockSubStore);

    fixture.whenStable().then(() => {
      expect(rangeElement.nativeElement.id).toBe('myId');
    });
  }));

  it('should support update via input event', async(() => {
    initComponent(fixture, setupMockStore(fixture, rangeDefaultTestData));
    const spy = spyOn(component, 'onChange').and.callThrough();
    rangeElement.componentInstance.ionChange.emit(456.456);
    expect(spy).toHaveBeenCalled();
  }));

  it('should support displaying errors', async(() => {
    // initComponent(fixture, setupMockStore(fixture, rangeDefaultTestData));
    showErrors(fixture, rangeDefaultTestData, () =>
      fixture.whenStable().then(() => {
        const debugError: DebugElement = fixture.debugElement.queryAll(
          By.directive(Label)
        )[1];
        expect(debugError.nativeElement.textContent).toBe(
          'Hi, this is me, test error!'
        );
      })
    );
  }));
});
