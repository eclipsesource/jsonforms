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
import './MatchMediaMock';
import * as React from 'react';
import { ControlElement } from '@jsonforms/core';
import { materialRenderers, MuiSelect, MaterialEnumControl } from '../../src';

import Enzyme, { mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { JsonFormsStateProvider } from '@jsonforms/react';
import { initCore } from './util';

Enzyme.configure({ adapter: new Adapter() });

const data = { nationality: 'JP' };
const schema = {
  type: 'string',
  enum: ['DE', 'IT', 'JP', 'US', 'RU', 'Other'],
};
const uischema: ControlElement = {
  type: 'Control',
  scope: '#/properties/nationality',
  options: {
    autocomplete: false,
  },
};

describe('Material enum control', () => {
  it('enum options should change when translation changes', () => {
    const core = initCore(schema, uischema, data);
    const translate = () => 'Translated';
    const changedTranslate = () => 'OtherTranslation';
    const wrapper = mount(
      <JsonFormsStateProvider
        initState={{ renderers: materialRenderers, core, i18n: { translate } }}
      >
        <MaterialEnumControl
          schema={schema}
          uischema={uischema}
          path='nationality'
        />
      </JsonFormsStateProvider>
    );

    expect(wrapper.find(MuiSelect).props().options[0].label).toBe('Translated');

    wrapper.setProps({
      initState: {
        renderers: materialRenderers,
        core,
        i18n: { translate: changedTranslate },
      },
    });
    wrapper.update();

    expect(wrapper.find(MuiSelect).props().options[0].label).toBe(
      'OtherTranslation'
    );
  });
});
