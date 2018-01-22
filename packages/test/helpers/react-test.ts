import * as TestUtils from 'react-dom/test-utils';
import { Component } from 'react';

export const findRenderedDOMElementWithTag =
  (component: Component<any, any>, tag: string): Element =>
    TestUtils.findRenderedDOMComponentWithTag(component, tag);

export const findRenderedDOMElementWithClass =
  (component: Component<any, any>, tag: string): Element =>
    TestUtils.findRenderedDOMComponentWithClass(component, tag);

export const scryRenderedDOMElementsWithTag =
  (component: Component<any, any>, tag: string): Element[] =>
    TestUtils.scryRenderedDOMComponentsWithTag(component, tag);

export const scryRenderedDOMElementsWithClass =
  (component: Component<any, any>, tag: string): Element[] =>
    TestUtils.scryRenderedDOMComponentsWithClass(component, tag);

export const renderIntoDocument = (element: any): any =>
  TestUtils.renderIntoDocument(element);

export const click = TestUtils.Simulate.click;

export const change = TestUtils.Simulate.change;

export const focus = TestUtils.Simulate.focus;

export const blur = TestUtils.Simulate.blur;
