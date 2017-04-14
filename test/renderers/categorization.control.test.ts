import test from 'ava';
// inject window, document etc.
import 'jsdom-global/register';
import * as installCE from 'document-register-element/pony';
declare var global;
installCE(global, 'force');
import {JsonSchema} from '../../src/models/jsonSchema';
import {Categorization, Category, ControlElement} from '../../src/models/uischema';
import {CategorizationRenderer, categorizationTester}
  from '../../src/renderers/additional/categorization-renderer';
import {DataService } from '../../src/core/data.service';
import {JsonFormsHolder} from '../../src/core';
import {Runtime} from '../../src/core/runtime';

test('CategorizationTester', t => {
  t.is(categorizationTester(undefined, undefined), -1);
  t.is(categorizationTester(null, undefined), -1);
  t.is(categorizationTester({type: 'Foo'}, undefined), -1);
  t.is(categorizationTester({type: 'Categorization'}, undefined), -1);
  t.is(categorizationTester({type: 'Categorization', elements: null} as Categorization,
    undefined), -1);
  t.is(categorizationTester({type: 'Categorization', elements: []} as Categorization,
    undefined), -1);
  t.is(categorizationTester(
    {type: 'Categorization', elements: [{type: 'Foo'}]} as Categorization,
    undefined), -1);
  t.is(categorizationTester(
    {type: 'Categorization', elements: [{type: 'Category'}]} as Categorization,
    undefined), 1);
  t.is(categorizationTester(
    {type: 'Categorization',
      elements: [{type: 'Categorization', elements: [{type: 'Category'}]}]} as Categorization,
    undefined), 1);
  t.is(categorizationTester(
    {type: 'Categorization',
      elements: [{type: 'Categorization'}]} as Categorization,
    undefined), -1);
  t.is(categorizationTester(
    {type: 'Categorization',
      elements: [{type: 'Categorization', elements: null}]} as Categorization,
    undefined), -1);
  t.is(categorizationTester(
    {type: 'Categorization',
      elements: [{type: 'Categorization', elements: []}]} as Categorization,
    undefined), -1);
});
test('CategorizationRenderer static', t => {
  const schema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
  const renderer: CategorizationRenderer = new CategorizationRenderer();
  const data = {'name': 'Foo'};
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Categorization', elements: [
      {type: 'Categorization', label: 'Bar', elements: [
        {type: 'Category', label: 'A', elements: [
          {type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement]} as Category
      ]} as Categorization,
      {type: 'Category', label: 'B', elements: [
        {type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement]} as Category
    ]} as Categorization);
  const result = renderer.render();
  t.is(result.className, 'jsf-categorization')
  t.is(result.childNodes.length, 2);
  // master tree
  const master = <HTMLDivElement>result.children[0]; // <-- TODO needed?
  t.is(master.className, 'jsf-categorization-master');
  t.is(master.children.length, 1);
  const ul = master.children[0];
  t.is(ul.children.length, 2);
  const liA = ul.children[0];
  t.is(liA.className, 'jsf-category-group');
  t.is(liA.children.length, 2);
  const spanA = liA.children[0];
  t.is(spanA.textContent, 'Bar');
  const innerUlA = liA.children[1];
  t.is(innerUlA.className, 'jsf-category-subcategories');
  t.is(innerUlA.children.length, 1);
  const innerLiA = innerUlA.children[0];
  t.is(innerLiA.children.length, 1);
  const innerSpanA = innerLiA.children[0];
  t.is(innerSpanA.textContent, 'A');
  const liB = ul.children[1];
  t.not(liB.className, 'jsf-category-group');
  t.is(liB.children.length, 1);
  const spanB = liB.children[0];
  t.is(spanB.textContent, 'B');
  // detail
  const detail = <HTMLDivElement>result.children[1];
  t.is(detail.className, 'jsf-categorization-detail');
  t.is(detail.children.length, 1);
  t.is(detail.children.item(0).tagName, 'DIV');
  t.is(detail.children.item(0).children.length, 1);
  t.is(detail.children.item(0).children.item(0).tagName, 'JSON-FORMS');
});

test('CategorizationRenderer dynamic', t => {
  const schema = {type: 'object', properties: {name: {type: 'string'}}} as JsonSchema;
  const renderer: CategorizationRenderer = new CategorizationRenderer();
  const data = {'name': 'Foo'};
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);
  renderer.setUiSchema({type: 'Categorization', elements: [
      {type: 'Categorization', label: 'Bar', elements: [
        {type: 'Category', label: 'A', elements: [
          {type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement]} as Category
      ]} as Categorization,
      {type: 'Category', label: 'B', elements: [
          {type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement,
          {type: 'Control', scope: {$ref: '#/properties/name'}} as ControlElement
        ]} as Category,
      {type: 'Category', label: 'C', elements: undefined} as Category,
      {type: 'Category', label: 'D', elements: null} as Category
    ]} as Categorization);
  const result = renderer.render();
  t.is(result.className, 'jsf-categorization')
  t.is(result.childNodes.length, 2);
  // master tree
  const master = <HTMLDivElement>result.children[0]; // <-- TODO needed?
  t.is(master.children.length, 1);
  const ul = master.children[0];
  t.is(ul.children.length, 4);
  const liA = ul.children[0];
  const innerLiA = <HTMLLIElement>liA.children[1].children[0];
  const liB = <HTMLLIElement>ul.children[1];
  const liC = <HTMLLIElement>ul.children[2];
  const liD = <HTMLLIElement>ul.children[3];
  // detail
  const detail = <HTMLDivElement>result.children[1];
  t.is(detail.children.length, 1);
  t.is(detail.children.item(0).tagName, 'DIV');
  t.is(detail.children.item(0).children.length, 1);
  t.is(detail.children.item(0).children.item(0).tagName, 'JSON-FORMS');

  liB.click();
  t.is(detail.children.length, 1);
  t.is(detail.children.item(0).tagName, 'DIV');
  t.is(detail.children.item(0).children.length, 2);
  t.is(detail.children.item(0).children.item(0).tagName, 'JSON-FORMS');
  t.is(detail.children.item(0).children.item(1).tagName, 'JSON-FORMS');

  liC.click();
  t.is(detail.children.length, 1);
  t.is(detail.children.item(0).tagName, 'DIV');
  t.is(detail.children.item(0).children.length, 0);
  liD.click();
  t.is(detail.children.length, 1);
  t.is(detail.children.item(0).tagName, 'DIV');
  t.is(detail.children.item(0).children.length, 0);
});

test('CategorizationRenderer notify visible', t => {
  const renderer: CategorizationRenderer = new CategorizationRenderer();
  const categorization = {type: 'Categorization', elements: [
    {type: 'Category', label: 'B'} as Category]} as Categorization;
  renderer.setUiSchema(categorization);
  renderer.connectedCallback();
  const runtime = <Runtime>categorization['runtime'];
  runtime.visible = false;
  t.is(renderer.hidden, true);
});
test('CategorizationRenderer notify disabled', t => {
  const renderer: CategorizationRenderer = new CategorizationRenderer();
  const categorization = {type: 'Categorization', elements: [
    {type: 'Category', label: 'B'} as Category]} as Categorization;
  renderer.setUiSchema(categorization);
  renderer.connectedCallback();
  const runtime = <Runtime>categorization['runtime'];
  runtime.enabled = false;
  t.is(renderer.getAttribute('disabled'), 'true');
});
test('CategorizationRenderer notify enabled', t => {
  const renderer: CategorizationRenderer = new CategorizationRenderer();
  const categorization = {type: 'Categorization', elements: [
    {type: 'Category', label: 'B'} as Category]} as Categorization;
  renderer.setUiSchema(categorization);
  renderer.connectedCallback();
  const runtime = <Runtime>categorization['runtime'];
  runtime.enabled = true;
  t.false(renderer.hasAttribute('disabled'));
});
test('CategorizationRenderer disconnected no notify visible', t => {
  const renderer: CategorizationRenderer = new CategorizationRenderer();
  const categorization = {type: 'Categorization', elements: [
    {type: 'Category', label: 'B'} as Category]} as Categorization;
  renderer.setUiSchema(categorization);
  renderer.connectedCallback();
  renderer.disconnectedCallback();
  const runtime = <Runtime>categorization['runtime'];
  runtime.visible = false;
  t.is(renderer.hidden, false);
});
