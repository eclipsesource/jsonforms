/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
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
import type { DebugElement, Type } from '@angular/core';
import { By } from '@angular/platform-browser';
import type { JsonFormsControl } from '@jsonforms/angular';
import { ControlElement, JsonSchema, Actions } from '@jsonforms/core';
import {
  baseSetup,
  ErrorTestExpectation,
  TestConfig,
  getJsonFormsService,
} from './util';
import { ComponentFixture, TestBed } from '@angular/core/testing';

const prepareComponent = <C extends JsonFormsControl, I>(
  testConfig: TestConfig<C>,
  instance: Type<I>
) => {
  const fixture = TestBed.createComponent(testConfig.componentUT);
  const component = fixture.componentInstance;
  const checkboxDebugElement = fixture.debugElement.query(
    By.directive(instance)
  );
  const checkboxInstance = checkboxDebugElement.componentInstance;
  const checkboxNativeElement = checkboxDebugElement.nativeElement;

  return { fixture, component, checkboxInstance, checkboxNativeElement };
};

const data = { foo: true };
export const defaultBooleanTestSchema: JsonSchema = {
  type: 'object',
  properties: {
    foo: {
      type: 'boolean',
    },
  },
};
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo',
};
export const defaultBooleanTestData = {
  data,
  schema: defaultBooleanTestSchema,
  uischema,
};

export const booleanBaseTest =
  <C extends JsonFormsControl, I>(
    testConfig: TestConfig<C>,
    instance: Type<I>
  ) =>
  () => {
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
      component.uischema = uischema;

      getJsonFormsService(component).init({
        core: {
          data: data,
          schema: defaultBooleanTestSchema,
          uischema: uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.data).toBe(true);
      expect(checkboxInstance.checked).toBe(true);
      expect(checkboxInstance.disabled).toBe(false);
      // the component is wrapped in a div
      const hasDisplayNone =
        'none' === fixture.nativeElement.children[0].style.display;
      const hasHidden = fixture.nativeElement.children[0].hidden;
      expect(hasDisplayNone || hasHidden).toBeFalsy();
    });
    it('should support updating the state', () => {
      component.uischema = uischema;

      getJsonFormsService(component).init({
        core: {
          data: data,
          schema: defaultBooleanTestSchema,
          uischema: uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();

      getJsonFormsService(component).updateCore(
        Actions.update('foo', () => false)
      );
      fixture.detectChanges();
      expect(component.data).toBe(false);
      expect(checkboxInstance.checked).toBe(false);
    });
    it('should update with undefined value', () => {
      component.uischema = uischema;

      getJsonFormsService(component).init({
        core: {
          data: data,
          schema: defaultBooleanTestSchema,
          uischema: uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();

      getJsonFormsService(component).updateCore(
        Actions.update('foo', () => undefined)
      );
      fixture.detectChanges();
      expect(component.data).toBe(undefined);
      expect(checkboxInstance.checked).toBe(false);
    });
    it('should update with null value', () => {
      component.uischema = uischema;

      getJsonFormsService(component).init({
        core: {
          data: data,
          schema: defaultBooleanTestSchema,
          uischema: uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();

      getJsonFormsService(component).updateCore(
        Actions.update('foo', () => null)
      );
      fixture.detectChanges();
      expect(component.data).toBe(null);
      expect(checkboxInstance.checked).toBe(false);
    });
    it('should not update with wrong ref', () => {
      component.uischema = uischema;

      getJsonFormsService(component).init({
        core: {
          data: data,
          schema: defaultBooleanTestSchema,
          uischema: uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();

      getJsonFormsService(component).updateCore(
        Actions.update('foo', () => true)
      );
      getJsonFormsService(component).updateCore(
        Actions.update('bar', () => false)
      );
      fixture.detectChanges();
      expect(component.data).toBe(true);
      expect(checkboxInstance.checked).toBe(true);
    });
    // store needed as we evaluate the calculated enabled value to disable/enable the control
    it('can be disabled', () => {
      component.uischema = uischema;
      component.disabled = true;

      getJsonFormsService(component).init({
        core: {
          data: data,
          schema: defaultBooleanTestSchema,
          uischema: uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();
      expect(checkboxInstance.disabled).toBe(true);
    });
    // store needed as we evaluate the calculated enabled value to disable/enable the control
    it('can be hidden', () => {
      component.uischema = uischema;
      component.visible = false;

      getJsonFormsService(component).init({
        core: {
          data: data,
          schema: defaultBooleanTestSchema,
          uischema: uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();
      // the component is wrapped in a div
      const hasDisplayNone =
        'none' === fixture.nativeElement.children[0].style.display;
      const hasHidden = fixture.nativeElement.children[0].hidden;
      expect(hasDisplayNone || hasHidden).toBeTruthy();
    });

    it('id should be present in output', () => {
      component.uischema = uischema;
      component.id = 'myId';

      getJsonFormsService(component).init({
        core: {
          data: data,
          schema: defaultBooleanTestSchema,
          uischema: uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();
      expect(checkboxNativeElement.id).toBe('myId');
    });
  };
export const booleanInputEventTest =
  <C extends JsonFormsControl, I>(
    testConfig: TestConfig<C>,
    instance: Type<I>,
    selectorForClick: string
  ) =>
  () => {
    let fixture: ComponentFixture<any>;
    let checkboxNativeElement: HTMLElement;
    let checkboxInstance: any;
    let component: C & { onChange(evt: string): void };
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
      component.uischema = uischema;
      getJsonFormsService(component).init({
        core: {
          data: data,
          schema: defaultBooleanTestSchema,
          uischema: uischema,
        },
      });
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

export const booleanErrorTest =
  <C extends JsonFormsControl, I>(
    testConfig: TestConfig<C>,
    instance: Type<I>,
    errorTestInformation: ErrorTestExpectation
  ) =>
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
      component.uischema = uischema;

      const formsService = getJsonFormsService(component);
      formsService.init({
        core: {
          data,
          schema: defaultBooleanTestSchema,
          uischema: uischema,
        },
      });
      formsService.updateCore(
        Actions.updateErrors([
          {
            instancePath: '/foo',
            message: 'Hi, this is me, test error!',
            keyword: '',
            schemaPath: '',
            params: {},
          },
        ])
      );
      formsService.refresh();

      component.ngOnInit();
      fixture.detectChanges();
      const debugErrors: DebugElement[] = fixture.debugElement.queryAll(
        By.directive(errorTestInformation.errorInstance)
      );
      expect(debugErrors.length).toBe(errorTestInformation.numberOfElements);
      expect(
        debugErrors[errorTestInformation.indexOfElement].nativeElement
          .textContent
      ).toBe('Hi, this is me, test error!');
    });
  };
