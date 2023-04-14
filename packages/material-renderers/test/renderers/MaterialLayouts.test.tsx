/*
  The MIT License

  Copyright (c) 2018-2019 EclipseSource Munich
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
import './MatchMediaMock';
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { materialRenderers } from '../../src';
import {
  ControlElement,
  Layout,
  RuleEffect,
  UISchemaElement,
} from '@jsonforms/core';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { JsonForms } from '@jsonforms/react';

Enzyme.configure({ adapter: new Adapter() });

const schema = {
  type: 'object',
  properties: {
    toggleTopLayout: {
      type: 'boolean',
    },
    topString: {
      type: 'string',
    },
    toggleMiddleLayout: {
      type: 'boolean',
    },
    middleNumber: {
      type: 'number',
    },
    toggleBottomLayout: {
      type: 'boolean',
    },
    bottomBoolean: {
      type: 'boolean',
    },
  },
};
const baseUischema = () => ({
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/topString',
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/middleNumber',
        },
        {
          type: 'Group',
          label: 'group',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/bottomBoolean',
            },
          ],
        },
      ],
    },
  ],
});

const rule = (effect: RuleEffect, propertyName: string) => ({
  effect: effect,
  condition: {
    scope: '#/properties/' + propertyName,
    schema: { const: true },
  },
});

const topRule = (rule: any, uischema: UISchemaElement) => {
  uischema.rule = rule;
  return uischema;
};
const topShowRule = (uischema: Layout) =>
  topRule(rule(RuleEffect.SHOW, 'toggleTopLayout'), uischema);
const topEnableRule = (uischema: Layout) =>
  topRule(rule(RuleEffect.ENABLE, 'toggleTopLayout'), uischema);

const middleRule = (rule: any, uischema: Layout) => {
  uischema.elements[1].rule = rule;
  return uischema;
};
const middleShowRule = (uischema: Layout) =>
  middleRule(rule(RuleEffect.SHOW, 'toggleMiddleLayout'), uischema);
const middleEnableRule = (uischema: Layout) =>
  middleRule(rule(RuleEffect.ENABLE, 'toggleMiddleLayout'), uischema);

const bottomRule = (rule: any, uischema: Layout) => {
  (uischema.elements[1] as Layout).elements[1].rule = rule;
  return uischema;
};
const bottomShowRule = (uischema: Layout) =>
  bottomRule(rule(RuleEffect.SHOW, 'toggleBottomLayout'), uischema);
const bottomEnableRule = (uischema: Layout) =>
  bottomRule(rule(RuleEffect.ENABLE, 'toggleBottomLayout'), uischema);

const controlRule = (rule: any, uischema: Layout) => {
  const group = (uischema.elements[1] as Layout).elements[1];
  (group as Layout).elements[0].rule = rule;
  return uischema;
};
const controlEnableRule = (uischema: Layout) =>
  controlRule(rule(RuleEffect.ENABLE, 'toggleControl'), uischema);

describe('Layout Tests', () => {
  let wrapper: Enzyme.ReactWrapper;

  const createWrapper = (data: any, uischema: UISchemaElement) => {
    wrapper = mount(
      <JsonForms
        data={data}
        schema={schema}
        uischema={uischema}
        renderers={materialRenderers}
      />
    );
  };

  afterEach(() => {
    wrapper.unmount();
  });

  const controlIsShown = (control: string) => {
    switch (control) {
      case 'top':
        return wrapper.find('input[type="text"]').length > 0;
      case 'middle':
        return wrapper.find('input[type="number"]').length > 0;
      case 'bottom':
        return wrapper.find('input[type="checkbox"]').length > 0;
      default:
        fail('Should not happen, something is massively broken');
    }
  };

  const controlIsEnabled = (control: string) => {
    let foundControl;
    switch (control) {
      case 'top':
        foundControl = wrapper.find('input[type="text"]');
        break;
      case 'middle':
        foundControl = wrapper.find('input[type="number"]');
        break;
      case 'bottom':
        foundControl = wrapper.find('input[type="checkbox"]');
        break;
      default:
        fail('Should not happen, something is massively broken');
    }
    if (foundControl.length === 0) {
      fail('Control was expected to be rendered but could not be found');
    }
    return (
      foundControl.first().props().disabled === undefined ||
      !foundControl.first().props().disabled
    );
  };

  describe('Sanity Checks', () => {
    it('should render all inputs without rules', () => {
      // data doesn't matter
      const data = {
        toggleTopLayout: true,
        toggleMiddleLayout: true,
        toggleBottomLayout: true,
      };
      createWrapper(data, baseUischema());
      expect(controlIsShown('top')).toBe(true);
      expect(controlIsShown('middle')).toBe(true);
      expect(controlIsShown('bottom')).toBe(true);
    });

    it('should render all inputs with all rules set to show', () => {
      const data = {
        toggleTopLayout: true,
        toggleMiddleLayout: true,
        toggleBottomLayout: true,
      };
      const uischema = topShowRule(
        middleShowRule(bottomShowRule(baseUischema()))
      );
      createWrapper(data, uischema);
      expect(controlIsShown('top')).toBe(true);
      expect(controlIsShown('middle')).toBe(true);
      expect(controlIsShown('bottom')).toBe(true);
    });

    it('should enable all inputs with all rules set to enabled', () => {
      const data = {
        toggleTopLayout: true,
        toggleMiddleLayout: true,
        toggleBottomLayout: true,
      };
      const uischema = topEnableRule(
        middleEnableRule(bottomEnableRule(baseUischema()))
      );
      createWrapper(data, uischema);
      expect(controlIsEnabled('top')).toBe(true);
      expect(controlIsEnabled('middle')).toBe(true);
      expect(controlIsEnabled('bottom')).toBe(true);
    });
  });

  describe('Single Rule', () => {
    it('hiding top should hide everything', () => {
      const data = {
        toggleTopLayout: false,
        toggleMiddleLayout: true,
        toggleBottomLayout: true,
      };
      const uischema = topShowRule(baseUischema());
      createWrapper(data, uischema);
      expect(controlIsShown('top')).toBe(false);
      expect(controlIsShown('middle')).toBe(false);
      expect(controlIsShown('bottom')).toBe(false);
    });

    it('hiding middle should leave top', () => {
      const data = {
        toggleTopLayout: true,
        toggleMiddleLayout: false,
        toggleBottomLayout: true,
      };
      const uischema = middleShowRule(baseUischema());
      createWrapper(data, uischema);
      expect(controlIsShown('top')).toBe(true);
      expect(controlIsShown('middle')).toBe(false);
      expect(controlIsShown('bottom')).toBe(false);
    });

    it('hiding bottom should leave top and middle', () => {
      const data = {
        toggleTopLayout: true,
        toggleMiddleLayout: true,
        toggleBottomLayout: false,
      };
      const uischema = bottomShowRule(baseUischema());
      createWrapper(data, uischema);
      expect(controlIsShown('top')).toBe(true);
      expect(controlIsShown('middle')).toBe(true);
      expect(controlIsShown('bottom')).toBe(false);
    });

    it('disabling top should disable everything', () => {
      const data = {
        toggleTopLayout: false,
        toggleMiddleLayout: true,
        toggleBottomLayout: true,
      };
      const uischema = topEnableRule(baseUischema());
      createWrapper(data, uischema);
      expect(controlIsEnabled('top')).toBe(false);
      expect(controlIsEnabled('middle')).toBe(false);
      expect(controlIsEnabled('bottom')).toBe(false);
    });

    it('disabling middle should leave top', () => {
      const data = {
        toggleTopLayout: true,
        toggleMiddleLayout: false,
        toggleBottomLayout: true,
      };
      const uischema = middleEnableRule(baseUischema());
      createWrapper(data, uischema);
      expect(controlIsEnabled('top')).toBe(true);
      expect(controlIsEnabled('middle')).toBe(false);
      expect(controlIsEnabled('bottom')).toBe(false);
    });

    it('disabling bottom should leave top and middle', () => {
      const data = {
        toggleTopLayout: true,
        toggleMiddleLayout: true,
        toggleBottomLayout: false,
      };
      const uischema = bottomEnableRule(baseUischema());
      createWrapper(data, uischema);
      expect(controlIsEnabled('top')).toBe(true);
      expect(controlIsEnabled('middle')).toBe(true);
      expect(controlIsEnabled('bottom')).toBe(false);
    });

    it('disabling control should disable control', () => {
      const data = {
        toggleTopLayout: true,
        toggleMiddleLayout: true,
        toggleBottomLayout: true,
        toggleControl: false,
      };
      const uischema = controlEnableRule(baseUischema());
      createWrapper(data, uischema);
      expect(controlIsEnabled('top')).toBe(true);
      expect(controlIsEnabled('middle')).toBe(true);
      expect(controlIsEnabled('bottom')).toBe(false);
    });
  });

  describe('Rule Combinations', () => {
    it('disabling middle should disable bottom, even if it has a show rule', () => {
      const data = {
        toggleTopLayout: true,
        toggleMiddleLayout: false,
        toggleBottomLayout: true,
      };
      const uischema = middleEnableRule(bottomShowRule(baseUischema()));
      createWrapper(data, uischema);
      expect(controlIsEnabled('top')).toBe(true);
      expect(controlIsEnabled('middle')).toBe(false);
      expect(controlIsEnabled('bottom')).toBe(false);
    });

    it('disabling layout and enabling control should enable control', () => {
      const data = {
        toggleTopLayout: true,
        toggleMiddleLayout: true,
        toggleBottomLayout: false,
        toggleControl: true,
      };
      const uischema = bottomEnableRule(controlEnableRule(baseUischema()));
      createWrapper(data, uischema);
      expect(controlIsEnabled('top')).toBe(true);
      expect(controlIsEnabled('middle')).toBe(true);
      expect(controlIsEnabled('bottom')).toBe(true);
    });
  });
});

describe('Special Layout Tests', () => {
  describe('Categorization Tests', () => {
    const schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        age: {
          type: 'integer',
        },
        topCheck: {
          type: 'boolean',
        },
        bottomCheck: {
          type: 'boolean',
        },
      },
    };

    const uischema = {
      type: 'Categorization',
      elements: [
        {
          type: 'Category',
          label: 'Private',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/name',
              rule: {
                effect: RuleEffect.ENABLE,
                condition: {
                  scope: '#/properties/bottomCheck',
                  schema: {
                    const: true,
                  },
                },
              },
            },
            {
              type: 'Control',
              scope: '#/properties/age',
            },
          ],
          rule: {
            effect: RuleEffect.ENABLE,
            condition: {
              scope: '#/properties/topCheck',
              schema: {
                const: true,
              },
            },
          },
        },
      ],
    };

    it('enabling top rule and disabling bottom rule should disable control', () => {
      const data = {
        topCheck: true,
        bottomCheck: false,
      };
      const wrapper = mount(
        <JsonForms
          data={data}
          schema={schema}
          uischema={uischema}
          renderers={materialRenderers}
        />
      );
      expect(wrapper.find('input[type="text"]').first().props().disabled).toBe(
        true
      );
    });

    it('disabling top rule and enabling bottom rule should enable control', () => {
      const data = {
        topCheck: false,
        bottomCheck: true,
      };
      const wrapper = mount(
        <JsonForms
          data={data}
          schema={schema}
          uischema={uischema}
          renderers={materialRenderers}
        />
      );
      expect(wrapper.find('input[type="text"]').first().props().disabled).toBe(
        false
      );
    });
  });

  describe('Object Renderer Tests', () => {
    const schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
        },
        age: {
          type: 'integer',
        },
        check: {
          type: 'boolean',
        },
      },
    };

    const uischema: ControlElement = {
      type: 'Control',
      scope: '#',
      rule: {
        effect: RuleEffect.ENABLE,
        condition: {
          scope: '#/properties/check',
          schema: {
            const: true,
          },
        } as any,
      },
    };

    it('enabling object control should enable child controls', () => {
      const data = {
        check: true,
      };
      const wrapper = mount(
        <JsonForms
          data={data}
          schema={schema}
          uischema={uischema}
          renderers={materialRenderers}
        />
      );
      expect(wrapper.find('input[type="text"]').first().props().disabled).toBe(
        false
      );
      expect(
        wrapper.find('input[type="number"]').first().props().disabled
      ).toBe(false);
    });

    it('disabling object control should disable child controls', () => {
      const data = {
        check: false,
      };
      const wrapper = mount(
        <JsonForms
          data={data}
          schema={schema}
          uischema={uischema}
          renderers={materialRenderers}
        />
      );
      expect(wrapper.find('input[type="text"]').first().props().disabled).toBe(
        true
      );
      expect(
        wrapper.find('input[type="number"]').first().props().disabled
      ).toBe(true);
    });
  });
});
