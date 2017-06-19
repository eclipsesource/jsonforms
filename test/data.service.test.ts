import {test} from 'ava';
import {DataService, DataChangeListener} from '../src/core/data.service';
import {ControlElement} from '../src/models/uischema';

test('getValue returns data referenced by control', t => {
  const data = {foo: {bar: 'John Doe'}};
  const dataService = new DataService(data);
  const value = dataService.getValue(
    {type: 'Control', scope: {$ref: '#/properties/foo/properties/bar'}}
  );
  t.is(value, 'John Doe');
});
test('getValue returns root data value', t => {
  const data = {foo: {bar: 'John Doe'}};
  const dataService = new DataService(data);
  const value = dataService.getValue(
    {type: 'Control', scope: {$ref: '#'}}
  );
  t.is(value, data);
});
test('notifyAboutDataChange updates data ', t => {
  const data = {foo: {bar: 'John Doe'}};
  const dataService = new DataService(data);
  const controlElement = {
    type: 'Control',
    scope: {$ref: '#/properties/foo/properties/bar'}
  } as ControlElement;
  dataService.notifyAboutDataChange(controlElement, 'Jane');
  const value = dataService.getValue(controlElement);
  t.is(value, 'Jane');
});
test('Registered data change listeners are called on init', t => {
  t.plan(1);
  const dataService = new DataService({});
  const listener1 = {
    needsNotificationAbout: (uischema: ControlElement): boolean => true,
    dataChanged: (uischema: ControlElement, newValue: any, full_data: any): void => t.pass()
  } as DataChangeListener;
  dataService.registerDataChangeListener(listener1);
  const listener2 = {
    needsNotificationAbout: (uischema: ControlElement): boolean => false,
    dataChanged: (uischema: ControlElement, newValue: any, full_data: any): void => t.fail()
  } as DataChangeListener;
  dataService.registerDataChangeListener(listener2);
  dataService.initDataChangeListeners();
});
test('De-registered data change listeners are not called on init', t => {
  t.plan(0);
  const dataService = new DataService({});
  const listener = {
    needsNotificationAbout: (uischema: ControlElement): boolean => true,
    dataChanged: (uischema: ControlElement, newValue: any, full_data: any): void => t.fail()
  } as DataChangeListener;
  dataService.registerDataChangeListener(listener);
  dataService.deregisterDataChangeListener(listener);
  dataService.initDataChangeListeners();
});
test('Registered data change listeners are called when notified', t => {
  t.plan(3);
  const data = {foo: {bar: 'John Doe'}};
  const dataService = new DataService(data);
  const controlElement = {
    type: 'Control',
    scope: {$ref: '#/properties/foo/properties/bar'}
  } as ControlElement;
  const listener1 = {
    needsNotificationAbout: (uischema: ControlElement): boolean => true,
    dataChanged: (uischema: ControlElement, newValue: any, full_data: any): void => {
      t.is(uischema, controlElement);
      t.is(newValue, 'Jane');
      t.is(full_data, data);
    }
  } as DataChangeListener;
  dataService.registerDataChangeListener(listener1);
  const listener2 = {
    needsNotificationAbout: (uischema: ControlElement): boolean => false,
    dataChanged: (uischema: ControlElement, newValue: any, full_data: any): void => {
      t.fail();
    }
  } as DataChangeListener;
  dataService.registerDataChangeListener(listener2);
  dataService.notifyAboutDataChange(controlElement, 'Jane');
});
test('De-registered data change listeners are not called when notified', t => {
  t.plan(0);
  const data = {foo: {bar: 'John Doe'}};
  const dataService = new DataService(data);
  const controlElement = {
    type: 'Control',
    scope: {$ref: '#/properties/foo/properties/bar'}
  } as ControlElement;
  const listener = {
    needsNotificationAbout: (uischema: ControlElement): boolean => true,
    dataChanged: (uischema: ControlElement, newValue: any, full_data: any): void => {
      t.fail();
    }
  } as DataChangeListener;
  dataService.registerDataChangeListener(listener);
  dataService.deregisterDataChangeListener(listener);
  dataService.notifyAboutDataChange(controlElement, 'Jane');
});
