import * as React from 'react';
import * as _ from 'lodash';
import {
  ControlElement,
  ControlProps,
  convertToValidClassName,
  DispatchRenderer,
  getConfig,
  JsonSchema,
  Layout,
  mapStateToControlProps,
  mapStateToLayoutProps,
  RendererProps
} from '@jsonforms/core';
import { getStyle, getStyleAsClassName } from '../reducers';

/**
 * A style associates a name with a list of CSS class names.
 */
export interface StyleDef {
  name: string;
  classNames: string[];
}

export const renderChildren = (
  layout: Layout,
  schema: JsonSchema,
  classNames: string,
  path: string
) => {

  if (_.isEmpty(layout.elements)) {
    return [];
  }

  return layout.elements.map((child, index) => {
    return (
      <div className={classNames} key={`${path}-${index}`}>
        <DispatchRenderer
          uischema={child}
          schema={schema}
          path={path}
        />
      </div>
    );
  });
};

export const mapStateToVanillaControlProps = (state, ownProps) => {
  const props = mapStateToControlProps(state, ownProps);
  const config = getConfig(state);
  const trim = config.trim;
  const controlElement = ownProps.uischema as ControlElement;
  const isValid = _.isEmpty(props.errors);
  const styles = getStyle(state)('control');
  let classNames: string[] = !_.isEmpty(controlElement.scope) ?
    styles.concat(
      [`${convertToValidClassName(controlElement.scope)}`]
    ) : [''];

  if (trim) {
    classNames = classNames.concat(getStyle(state)('control.trim'));
  }
  const labelClass = getStyleAsClassName(state)('control.label');
  const descriptionClassName = getStyleAsClassName(state)('input-description');
  const inputClassName = ['validate'].concat(isValid ? 'valid' : 'invalid');

  return {
    ...props,
    getStyleAsClassName:  getStyleAsClassName(state),
    getStyle:  getStyle(state),
    classNames: {
      wrapper: classNames.join(' '),
      input: inputClassName.join(' '),
      label: labelClass,
      description: descriptionClassName
    },
  };
};

export interface VanillaControlProps extends ControlProps {
  classNames: {
    wrapper: string;
    input: string;
    label: string;
    description: string;
  };
  getStyle(string: string, ...args: any[]): string[];
  getStyleAsClassName(string: string): string;
}

export interface VanillaRendererProps extends RendererProps {
  getStyle(string: string, ...args: any[]): string[];
  getStyleAsClassName(string: string): string;
}

export const mapStateToVanillaLayoutProps = (state, ownProps) => {
  const props = mapStateToLayoutProps(state, ownProps);

  return {
    ...props,
    getStyleAsClassName:  getStyleAsClassName(state),
    getStyle:  getStyle(state),
  };
};

export const vanillaStyles = [
  {
    name: 'control',
    classNames: ['control']
  },
  {
    name: 'control.trim',
    classNames: ['trim']
  },
  {
    name: 'control.label',
    classNames: ['control']
  },
  {
    name: 'control.input',
    classNames: ['input']
  },
  {
    name: 'control.validation',
    classNames: ['validation']
  },
  {
    name: 'categorization',
    classNames: ['jsf-categorization']
  },
  {
    name: 'categorization.master',
    classNames: ['jsf-categorization-master']
  },
  {
    name: 'categorization.detail',
    classNames: ['jsf-categorization-detail']
  },
  {
    name: 'category.group',
    classNames: ['jsf-category-group']
  },
  {
    name: 'array.layout',
    classNames: ['array-layout']
  },
  {
    name: 'array.children',
    classNames: ['children']
  },
  {
    name: 'group-layout',
    classNames: ['group-layout']
  },
  {
    name: 'horizontal-layout',
    classNames: ['horizontal-layout']
  },
  {
    name: 'vertical-layout',
    classNames: ['vertical-layout']
  },
  {
    name: 'array-table',
    classNames: ['array-table-layout', 'control']
  },
  {
    name: 'input-description',
    classNames: ['input-description']
  }
];
