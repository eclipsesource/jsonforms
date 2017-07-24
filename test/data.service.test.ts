import { test } from 'ava';
import { DataChangeListener, DataService } from '../src/core/data.service';
import { ControlElement } from '../src/models/uischema';

test('getValue returns data referenced by control', t => {
  const data = {foo: {bar: 'John Doe'}};
  const dataService = new DataService(data);
  const value = dataService.getValue({scope: {$ref: '#/properties/foo/properties/bar'}});
  t.is(value, 'John Doe');
});
test('getValue returns root data value', t => {
  const data = {foo: {bar: 'John Doe'}};
  const dataService = new DataService(data);
  const value = dataService.getValue({scope: {$ref: '#'}});
  t.is(value, data);
});
test('notifyAboutDataChange updates data ', t => {
  const data = {foo: {bar: 'John Doe'}};
  const dataService = new DataService(data);
  const controlElement: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo/properties/bar'
    }
  };
  dataService.notifyAboutDataChange(controlElement, 'Jane');
  const value = dataService.getValue(controlElement);
  t.is(value, 'Jane');
});
test('Registered data change listeners are called on init', t => {
  t.plan(1);
  const dataService = new DataService({});
  const listener1: DataChangeListener = {
    needsNotificationAbout: (uischema: ControlElement): boolean => true,
    dataChanged: (uischema: ControlElement, newValue: any, fullData: any): void => t.pass()
  };
  dataService.registerDataChangeListener(listener1);
  const listener2: DataChangeListener = {
    needsNotificationAbout: (uischema: ControlElement): boolean => false,
    dataChanged: (uischema: ControlElement, newValue: any, fullData: any): void => t.fail()
  };
  dataService.registerDataChangeListener(listener2);
  dataService.initDataChangeListeners();
});
test('De-registered data change listeners are not called on init', t => {
  t.plan(0);
  const dataService = new DataService({});
  const listener: DataChangeListener = {
    needsNotificationAbout: (uischema: ControlElement): boolean => true,
    dataChanged: (uischema: ControlElement, newValue: any, fullData: any): void => t.fail()
  };
  dataService.registerDataChangeListener(listener);
  dataService.deregisterDataChangeListener(listener);
  dataService.initDataChangeListeners();
});
test('Registered data change listeners are called when notified', t => {
  t.plan(3);
  const data = {foo: {bar: 'John Doe'}};
  const dataService = new DataService(data);
  const controlElement: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/foo/properties/bar'
    }
  };
  const listener1: DataChangeListener = {
    needsNotificationAbout: (uischema: ControlElement): boolean => true,
    dataChanged: (uischema: ControlElement, newValue: any, fullData: any): void => {
      t.is(uischema, controlElement);
      t.is(newValue, 'Jane');
      t.is(fullData, data);
    }
  };
  dataService.registerDataChangeListener(listener1);
  const listener2: DataChangeListener = {
    needsNotificationAbout: (uischema: ControlElement): boolean => false,
    dataChanged: (uischema: ControlElement, newValue: any, fullData: any): void => {
      t.fail();
    }
  };
  dataService.registerDataChangeListener(listener2);
  dataService.notifyAboutDataChange(controlElement, 'Jane');
});
test('De-registered data change listeners are not called when notified', t => {
  t.plan(0);
  const data = {foo: {bar: 'John Doe'}};
  const dataService = new DataService(data);
  const controlElement: ControlElement = {
    type: 'Control',
    scope: {$ref: '#/properties/foo/properties/bar'}
  };
  const listener: DataChangeListener = {
    needsNotificationAbout: (uischema: ControlElement): boolean => true,
    dataChanged: (uischema: ControlElement, newValue: any, fullData: any): void => {
      t.fail();
    }
  };
  dataService.registerDataChangeListener(listener);
  dataService.deregisterDataChangeListener(listener);
  dataService.notifyAboutDataChange(controlElement, 'Jane');
});
