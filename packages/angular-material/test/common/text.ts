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
import type { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import type { JsonFormsControl } from '@jsonforms/angular';
import { Actions, ControlElement, JsonSchema } from '@jsonforms/core';
import {
  baseSetup,
  ErrorTestExpectation,
  getJsonFormsService,
  TestConfig,
  TestData,
} from './util';

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
  const result: ComponentResult<C> = { fixture, component };
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
      type: 'string',
    },
  },
};
const defaultUischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo',
};
export const defaultTextTestData: TestData<ControlElement> = {
  data: defaultData,
  schema: defaultSchema,
  uischema: defaultUischema,
};
export const textBaseTest =
  <C extends JsonFormsControl>(
    testConfig: TestConfig<C>,
    instance: string,
    elementToUse: (element: DebugElement) => any,
    testData: TestData<ControlElement> = defaultTextTestData
  ) =>
  () => {
    let fixture: ComponentFixture<any>;
    let textElement: DebugElement;
    let textNativeElement: any;
    let component: C;

    baseSetup(testConfig);

    beforeEach(() => {
      const preparedComponents = prepareComponent(
        testConfig,
        instance,
        elementToUse
      );
      fixture = preparedComponents.fixture;
      textNativeElement = preparedComponents.textNativeElement;
      textElement = preparedComponents.textElement;
      component = preparedComponents.component;
    });

    it('should render', () => {
      component.uischema = testData.uischema;
      getJsonFormsService(component).init({
        core: {
          data: testData.data,
          schema: testData.schema,
          uischema: testData.uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.data).toBe('foo');
      expect(textNativeElement.value).toBe('foo');
      expect(textNativeElement.disabled).toBe(false);
      // the component is wrapped in a div
      const hasDisplayNone =
        'none' === fixture.nativeElement.children[0].style.display;
      const hasHidden = fixture.nativeElement.children[0].hidden;
      expect(!hasDisplayNone && !hasHidden).toBeTruthy();
    });

    it('should support updating the state', () => {
      component.uischema = testData.uischema;

      getJsonFormsService(component).init({
        core: {
          data: testData.data,
          schema: testData.schema,
          uischema: testData.uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();

      getJsonFormsService(component).updateCore(
        Actions.update('foo', () => 'bar')
      );
      fixture.detectChanges();
      expect(component.data).toBe('bar');
      expect(textNativeElement.value).toBe('bar');
    });
    it('should update with undefined value', () => {
      component.uischema = testData.uischema;

      getJsonFormsService(component).init({
        core: {
          data: testData.data,
          schema: testData.schema,
          uischema: testData.uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();

      getJsonFormsService(component).updateCore(
        Actions.update('foo', () => undefined)
      );
      fixture.detectChanges();
      expect(component.data).toBe(undefined);
      expect(textNativeElement.value).toBe('');
    });
    it('should update with null value', () => {
      component.uischema = testData.uischema;

      getJsonFormsService(component).init({
        core: {
          data: testData.data,
          schema: testData.schema,
          uischema: testData.uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();

      getJsonFormsService(component).updateCore(
        Actions.update('foo', () => null)
      );
      fixture.detectChanges();
      expect(component.data).toBe(null);
      expect(textNativeElement.value).toBe('');
    });
    it('should not update with wrong ref', () => {
      component.uischema = testData.uischema;

      getJsonFormsService(component).init({
        core: {
          data: testData.data,
          schema: testData.schema,
          uischema: testData.uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();

      getJsonFormsService(component).updateCore(
        Actions.update('foo', () => 'foo')
      );
      getJsonFormsService(component).updateCore(
        Actions.update('bar', () => 'bar')
      );
      fixture.detectChanges();
      expect(component.data).toBe('foo');
      expect(textNativeElement.value).toBe('foo');
    });
    // store needed as we evaluate the calculated enabled value to disable/enable the control
    it('can be disabled', () => {
      component.uischema = testData.uischema;
      component.disabled = true;

      getJsonFormsService(component).init({
        core: {
          data: testData.data,
          schema: testData.schema,
          uischema: testData.uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();
      expect(textNativeElement.disabled).toBe(true);
    });
    it('can be hidden', () => {
      component.uischema = testData.uischema;
      component.visible = false;

      getJsonFormsService(component).init({
        core: {
          data: testData.data,
          schema: testData.schema,
          uischema: testData.uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();
      const hasDisplayNone =
        'none' === fixture.nativeElement.children[0].style.display;
      const hasHidden = fixture.nativeElement.children[0].hidden;
      expect(hasDisplayNone || hasHidden).toBeTruthy();
    });
    it('id should be present in output', () => {
      component.uischema = testData.uischema;
      component.id = 'myId';
      getJsonFormsService(component).init({
        core: {
          data: testData.data,
          schema: testData.schema,
          uischema: testData.uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();
      expect(textElement.nativeElement.id).toBe('myId');
    });
  };
export const textInputEventTest =
  <C extends JsonFormsControl>(
    testConfig: TestConfig<C>,
    instance: string,
    elementToUse: (element: DebugElement) => any,
    testData: TestData<ControlElement> = defaultTextTestData
  ) =>
  () => {
    let fixture: ComponentFixture<any>;
    let textNativeElement: any;
    let component: C & { onChange(evt: string): void };

    baseSetup(testConfig);

    beforeEach(() => {
      const preparedComponents = prepareComponent(
        testConfig,
        instance,
        elementToUse
      );
      fixture = preparedComponents.fixture;
      textNativeElement = preparedComponents.textNativeElement;
      component = preparedComponents.component;
    });

    it('should update via input event', () => {
      component.uischema = testData.uischema;

      getJsonFormsService(component).init({
        core: {
          data: testData.data,
          schema: testData.schema,
          uischema: testData.uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();

      const spy = spyOn(component, 'onChange');
      textNativeElement.value = 'bar';
      if (textNativeElement.dispatchEvent) {
        textNativeElement.dispatchEvent(new Event('input'));
      }
      // trigger change detection
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
      expect(textNativeElement.value).toBe('bar');
    });
  };
export const textErrorTest =
  <C extends JsonFormsControl>(
    testConfig: TestConfig<C>,
    errorTestInformation: ErrorTestExpectation,
    testData: TestData<ControlElement> = defaultTextTestData
  ) =>
  () => {
    let fixture: ComponentFixture<any>;
    let component: C;

    baseSetup(testConfig);

    beforeEach(() => {
      const preparedComponents = prepareComponent(testConfig);
      fixture = preparedComponents.fixture;
      component = preparedComponents.component;
    });
    it('should display errors', () => {
      component.uischema = testData.uischema;

      const formsService = getJsonFormsService(component);
      formsService.init({
        core: {
          data: testData.data,
          schema: testData.schema,
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
export const textTypeTest =
  <C extends JsonFormsControl>(
    testConfig: TestConfig<C>,
    instance: string,
    elementToUse: (element: DebugElement) => any,
    testData: TestData<ControlElement> = defaultTextTestData
  ) =>
  () => {
    let fixture: ComponentFixture<any>;
    let component: C;
    let textNativeElement: any;

    baseSetup(testConfig);

    beforeEach(() => {
      const preparedComponents = prepareComponent(
        testConfig,
        instance,
        elementToUse
      );
      fixture = preparedComponents.fixture;
      component = preparedComponents.component;
      textNativeElement = preparedComponents.textNativeElement;
    });
    it('should show password independent of schema', () => {
      const uischema = JSON.parse(JSON.stringify(testData.uischema));
      uischema.options = { format: 'password' };
      const schema = JSON.parse(JSON.stringify(testData.schema));
      schema.properties.foo.format = 'email';

      component.uischema = uischema;
      component.schema = schema;

      getJsonFormsService(component).init({
        core: { data: testData.data, schema: schema, uischema: uischema },
      });
      component.ngOnInit();
      fixture.detectChanges();
      expect(textNativeElement.type).toBe('password');
    });
    it('should show email', () => {
      const schema = JSON.parse(JSON.stringify(testData.schema));
      schema.properties.foo.format = 'email';

      component.uischema = testData.uischema;
      component.schema = schema;

      getJsonFormsService(component).init({
        core: {
          data: testData.data,
          schema: schema,
          uischema: testData.uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();
      expect(textNativeElement.type).toBe('email');
    });
    xit('should show tel', () => {
      const schema = JSON.parse(JSON.stringify(testData.schema));
      schema.properties.foo.format = 'tel';

      component.uischema = testData.uischema;
      component.schema = schema;

      getJsonFormsService(component).init({
        core: {
          data: testData.data,
          schema: schema,
          uischema: testData.uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();
      expect(textNativeElement.type).toBe('tel');
    });
    xit('should fallback to text', () => {
      const schema = JSON.parse(JSON.stringify(testData.schema));
      schema.properties.foo.format = 'foo';

      component.uischema = testData.uischema;
      component.schema = schema;

      getJsonFormsService(component).init({
        core: {
          data: testData.data,
          schema: schema,
          uischema: testData.uischema,
        },
      });
      component.ngOnInit();
      fixture.detectChanges();
      expect(textNativeElement.type).toBe('text');
    });
  };
