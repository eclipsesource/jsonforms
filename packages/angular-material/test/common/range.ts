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
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import type { JsonFormsControl } from '@jsonforms/angular';
import {
  baseSetup,
  ErrorTestExpectation,
  setupMockStore,
  TestConfig,
  TestData,
  getJsonFormsService,
} from './util';
import { ControlElement, JsonSchema, Actions } from '@jsonforms/core';

interface ComponentResult<C extends JsonFormsControl> {
  fixture: ComponentFixture<any>;
  component: C;
  rangeElement: DebugElement;
  thumbElement: DebugElement;
}

const prepareComponent = <C extends JsonFormsControl, I>(
  testConfig: TestConfig<C>,
  instance: Type<I>
): ComponentResult<C> => {
  const fixture = TestBed.createComponent(testConfig.componentUT);
  const component = fixture.componentInstance;
  const rangeElement = fixture.debugElement.query(By.directive(instance));
  const thumbElement = fixture.debugElement.query(By.css('[matsliderthumb]')); //rangeElement.nativeElement.children[0]; // todo: find a safer way to get the 'matSliderThumb'
  const result: ComponentResult<C> = {
    fixture,
    component,
    rangeElement,
    thumbElement,
  };
  return result;
};
export const rangeDefaultData = { foo: 1.234 };
export const rangeDefaultSchema: JsonSchema = {
  type: 'object',
  properties: {
    foo: {
      type: 'number',
      minimum: -42.42,
      maximum: 42.42,
      default: 0.42,
    },
  },
};
export const rangeDefaultUischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo',
  options: { slider: true },
};
export const rangeDefaultTestData: TestData<ControlElement> = {
  data: rangeDefaultData,
  schema: rangeDefaultSchema,
  uischema: rangeDefaultUischema,
};

export const rangeBaseTest =
  <C extends JsonFormsControl, I>(
    testConfig: TestConfig<C>,
    instance: Type<I>
  ) =>
  () => {
    let fixture: ComponentFixture<any>;
    let rangeElement: DebugElement;
    let thumbElement: DebugElement;
    let component: C;

    baseSetup(testConfig);

    beforeEach(() => {
      const preparedComponents = prepareComponent(testConfig, instance);
      fixture = preparedComponents.fixture;
      rangeElement = preparedComponents.rangeElement;
      thumbElement = preparedComponents.thumbElement;
      component = preparedComponents.component;
    });

    it('should render floats', () => {
      component.uischema = rangeDefaultTestData.uischema;
      component.schema = rangeDefaultTestData.schema;

      getJsonFormsService(component).init({
        core: {
          data: rangeDefaultTestData.data,
          schema: rangeDefaultTestData.schema,
          uischema: rangeDefaultTestData.uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.data).toBe(1.234);
      expect(thumbElement.componentInstance.data).toBe(1.234);
      // step is of type string
      expect(rangeElement.componentInstance.step).toBe(1);
      expect(rangeElement.componentInstance.min).toBe(-42.42);
      expect(rangeElement.componentInstance.max).toBe(42.42);
      expect(rangeElement.componentInstance.disabled).toBe(false);
      expect(fixture.nativeElement.children[0].style.display).not.toBe('none');
    });

    it('should render integer', () => {
      component.uischema = rangeDefaultTestData.uischema;
      const schema = JSON.parse(JSON.stringify(rangeDefaultTestData.schema));
      schema.properties.foo.type = 'integer';
      schema.properties.foo.minimum = -42;
      schema.properties.foo.maximum = 42;
      schema.properties.foo.default = 1;
      setupMockStore(fixture, {
        uischema: rangeDefaultTestData.uischema,
        schema,
        data: { foo: 12 },
      });
      getJsonFormsService(component).updateCore(
        Actions.init({ foo: 12 }, schema, rangeDefaultTestData.uischema)
      );

      fixture.componentInstance.ngOnInit();
      fixture.detectChanges();
      expect(component.data).toBe(12);
      expect(thumbElement.componentInstance.data).toBe(12);
      // step is of type string
      expect(rangeElement.componentInstance.step).toBe(1);
      expect(rangeElement.componentInstance.min).toBe(-42);
      expect(rangeElement.componentInstance.max).toBe(42);
      expect(rangeElement.componentInstance.disabled).toBe(false);
      // the component is wrapped in a div
      expect(fixture.nativeElement.children[0].style.display).not.toBe('none');
    });

    it('should support updating the state', () => {
      component.uischema = rangeDefaultTestData.uischema;
      component.schema = rangeDefaultTestData.schema;

      getJsonFormsService(component).init({
        core: {
          data: rangeDefaultTestData.data,
          schema: rangeDefaultTestData.schema,
          uischema: rangeDefaultTestData.uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();

      getJsonFormsService(component).updateCore(
        Actions.update('foo', () => 4.56)
      );
      fixture.detectChanges();
      expect(component.data).toBe(4.56);
      expect(thumbElement.componentInstance.data).toBe(4.56);
    });
    it('should update with undefined value', () => {
      component.uischema = rangeDefaultTestData.uischema;
      component.schema = rangeDefaultTestData.schema;

      getJsonFormsService(component).init({
        core: {
          data: rangeDefaultTestData.data,
          schema: rangeDefaultTestData.schema,
          uischema: rangeDefaultTestData.uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();

      getJsonFormsService(component).updateCore(
        Actions.update('foo', () => undefined)
      );
      fixture.detectChanges();
      expect(component.data).toBe(undefined);
      expect(thumbElement.componentInstance.data).toBe(undefined);
    });
    it('should update with null value', () => {
      component.uischema = rangeDefaultTestData.uischema;
      component.schema = rangeDefaultTestData.schema;

      getJsonFormsService(component).init({
        core: {
          data: rangeDefaultTestData.data,
          schema: rangeDefaultTestData.schema,
          uischema: rangeDefaultTestData.uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();

      getJsonFormsService(component).updateCore(
        Actions.update('foo', () => null)
      );
      fixture.detectChanges();
      expect(component.data).toBe(null);
      expect(thumbElement.componentInstance.data).toBe(null);
    });
    it('should not update with wrong ref', () => {
      component.uischema = rangeDefaultTestData.uischema;
      component.schema = rangeDefaultTestData.schema;

      getJsonFormsService(component).init({
        core: {
          data: rangeDefaultTestData.data,
          schema: rangeDefaultTestData.schema,
          uischema: rangeDefaultTestData.uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();

      getJsonFormsService(component).updateCore(
        Actions.update('foo', () => 1.234)
      );
      getJsonFormsService(component).updateCore(
        Actions.update('bar', () => 456.456)
      );

      fixture.detectChanges();
      expect(component.data).toBe(1.234);
      expect(thumbElement.componentInstance.data).toBe(1.234);
    });
    // store needed as we evaluate the calculated enabled value to disable/enable the control
    it('can be disabled', () => {
      component.uischema = rangeDefaultTestData.uischema;
      component.schema = rangeDefaultTestData.schema;
      component.disabled = true;

      getJsonFormsService(component).init({
        core: {
          data: rangeDefaultTestData.data,
          schema: rangeDefaultTestData.schema,
          uischema: rangeDefaultTestData.uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();
      expect(rangeElement.componentInstance.disabled).toBe(true);
    });
    it('can be hidden', () => {
      component.uischema = rangeDefaultTestData.uischema;
      component.schema = rangeDefaultTestData.schema;
      component.visible = false;

      getJsonFormsService(component).init({
        core: {
          data: rangeDefaultTestData.data,
          schema: rangeDefaultTestData.schema,
          uischema: rangeDefaultTestData.uischema,
        },
      });
      fixture.detectChanges();
      component.ngOnInit();
      expect(fixture.nativeElement.children[0].style.display).toBe('none');
    });
    it('id should be present in output', () => {
      component.uischema = rangeDefaultTestData.uischema;
      component.schema = rangeDefaultTestData.schema;
      component.id = 'myId';
      getJsonFormsService(component).init({
        core: {
          data: rangeDefaultTestData.data,
          schema: rangeDefaultTestData.schema,
          uischema: rangeDefaultTestData.uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();
      expect(rangeElement.nativeElement.id).toBe('myId');
    });
  };
export const rangeInputEventTest =
  <C extends JsonFormsControl, I>(
    testConfig: TestConfig<C>,
    instance: Type<I>
  ) =>
  () => {
    let fixture: ComponentFixture<any>;
    let component: C & { onChange(evt: string): void };

    baseSetup(testConfig);

    beforeEach(() => {
      const preparedComponents = prepareComponent(testConfig, instance);
      fixture = preparedComponents.fixture;
      component = preparedComponents.component;
    });

    xit('should update via input event', async () => {
      component.uischema = rangeDefaultTestData.uischema;
      component.schema = rangeDefaultTestData.schema;

      getJsonFormsService(component).init({
        core: {
          data: rangeDefaultTestData.data,
          schema: rangeDefaultTestData.schema,
          uischema: rangeDefaultTestData.uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();

      const spy = spyOn(component, 'onChange');

      const sliderElement = fixture.debugElement.query(
        By.css('.mat-slider')
      ).nativeElement;

      const trackElement = fixture.debugElement.query(
        By.css('.mat-slider-wrapper')
      ).nativeElement;
      const dimensions = trackElement.getBoundingClientRect();
      const x = dimensions.left + dimensions.width * 0.2;
      const y = dimensions.top + dimensions.height * 0.2;

      dispatchEvent(sliderElement, createMouseEvent('mousedown', x, y, 0));

      // trigger change detection
      fixture.detectChanges();
      await fixture.whenStable();
      expect(spy).toHaveBeenCalled();
    });
  };
export const rangeErrorTest =
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
      component.uischema = rangeDefaultTestData.uischema;
      component.schema = rangeDefaultTestData.schema;

      const formsService = getJsonFormsService(component);
      formsService.init({
        core: {
          data: rangeDefaultTestData.data,
          schema: rangeDefaultTestData.schema,
          uischema: undefined,
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

/** Creates a browser MouseEvent with the specified options. */
const createMouseEvent = (type: string, x = 0, y = 0, button = 0) => {
  const event = document.createEvent('MouseEvent');

  event.initMouseEvent(
    type,
    true /* canBubble */,
    false /* cancelable */,
    window /* view */,
    0 /* detail */,
    x /* screenX */,
    y /* screenY */,
    x /* clientX */,
    y /* clientY */,
    false /* ctrlKey */,
    false /* altKey */,
    false /* shiftKey */,
    false /* metaKey */,
    button /* button */,
    null /* relatedTarget */
  );

  // `initMouseEvent` doesn't allow us to pass the `buttons` and
  // defaults it to 0 which looks like a fake event.
  Object.defineProperty(event, 'buttons', { get: () => 1 });

  return event;
};
/** Utility to dispatch any event on a Node. */
const dispatchEvent = (node: Node | Window, event: Event): Event => {
  node.dispatchEvent(event);
  return event;
};
