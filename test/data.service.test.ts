import {test} from 'ava';
import {DataService, DataChangeListener} from '../src/core/data.service';
import {ControlElement} from '../src/models/uischema';

test('DataService getValue ', t => {
  const data = {foo: {bar: 'John Doe'}};
  const dataService = new DataService(data);
  const value = dataService.getValue(
    {type: 'Control', scope: {$ref: '#/properties/foo/properties/bar'}}
  );
  t.is(value, 'John Doe');
});
test('DataService getValue root', t => {
  const data = {foo: {bar: 'John Doe'}};
  const dataService = new DataService(data);
  const value = dataService.getValue(
    {type: 'Control', scope: {$ref: '#'}}
  );
  t.is(value, data);
});
test('DataService notifyChange updates data ', t => {
  const data = {foo: {bar: 'John Doe'}};
  const dataService = new DataService(data);
  const controlElement = {
    type: 'Control',
    scope: {$ref: '#/properties/foo/properties/bar'}
  } as ControlElement;
  dataService.notifyChange(controlElement, 'Jane');
  const value = dataService.getValue(controlElement);
  t.is(value, 'Jane');
});
test('DataService registered listeners are called on root run', t => {
  t.plan(1);
  const dataService = new DataService({});
  const listener1 = {
    isRelevantKey: (uischema: ControlElement): boolean => true,
    notifyChange: (uischema: ControlElement, newValue: any, full_data: any): void => t.pass()
  } as DataChangeListener;
  dataService.registerChangeListener(listener1);
  const listener2 = {
    isRelevantKey: (uischema: ControlElement): boolean => false,
    notifyChange: (uischema: ControlElement, newValue: any, full_data: any): void => t.fail()
  } as DataChangeListener;
  dataService.registerChangeListener(listener2);
  dataService.initialRootRun();
});
test('DataService unregistered listeners are not called on root run', t => {
  t.plan(0);
  const dataService = new DataService({});
  const listener = {
    isRelevantKey: (uischema: ControlElement): boolean => true,
    notifyChange: (uischema: ControlElement, newValue: any, full_data: any): void => t.fail()
  } as DataChangeListener;
  dataService.registerChangeListener(listener);
  dataService.unregisterChangeListener(listener);
  dataService.initialRootRun();
});
test('DataService registered listeners are called on notify', t => {
  t.plan(3);
  const data = {foo: {bar: 'John Doe'}};
  const dataService = new DataService(data);
  const controlElement = {
    type: 'Control',
    scope: {$ref: '#/properties/foo/properties/bar'}
  } as ControlElement;
  const listener1 = {
    isRelevantKey: (uischema: ControlElement): boolean => true,
    notifyChange: (uischema: ControlElement, newValue: any, full_data: any): void => {
      t.is(uischema, controlElement);
      t.is(newValue, 'Jane');
      t.is(full_data, data);
    }
  } as DataChangeListener;
  dataService.registerChangeListener(listener1);
  const listener2 = {
    isRelevantKey: (uischema: ControlElement): boolean => false,
    notifyChange: (uischema: ControlElement, newValue: any, full_data: any): void => {
      t.fail();
    }
  } as DataChangeListener;
  dataService.registerChangeListener(listener2);
  dataService.notifyChange(controlElement, 'Jane');
});
test('DataService unregistered listeners are not called on notify', t => {
  t.plan(0);
  const data = {foo: {bar: 'John Doe'}};
  const dataService = new DataService(data);
  const controlElement = {
    type: 'Control',
    scope: {$ref: '#/properties/foo/properties/bar'}
  } as ControlElement;
  const listener = {
    isRelevantKey: (uischema: ControlElement): boolean => true,
    notifyChange: (uischema: ControlElement, newValue: any, full_data: any): void => {
      t.fail();
    }
  } as DataChangeListener;
  dataService.registerChangeListener(listener);
  dataService.unregisterChangeListener(listener);
  dataService.notifyChange(controlElement, 'Jane');
});
