"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = require("ava");
const data_service_1 = require("../src/core/data.service");
ava_1.test('getValue returns data referenced by control', t => {
    const data = { foo: { bar: 'John Doe' } };
    const dataService = new data_service_1.DataService(data);
    const value = dataService.getValue({ scope: { $ref: '#/properties/foo/properties/bar' } });
    t.is(value, 'John Doe');
});
ava_1.test('getValue returns root data value', t => {
    const data = { foo: { bar: 'John Doe' } };
    const dataService = new data_service_1.DataService(data);
    const value = dataService.getValue({ scope: { $ref: '#' } });
    t.is(value, data);
});
ava_1.test('notifyAboutDataChange updates data ', t => {
    const data = { foo: { bar: 'John Doe' } };
    const dataService = new data_service_1.DataService(data);
    const controlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo/properties/bar'
        }
    };
    dataService.notifyAboutDataChange(controlElement, 'Jane');
    const value = dataService.getValue(controlElement);
    t.is(value, 'Jane');
});
ava_1.test('Registered data change listeners are called on init', t => {
    t.plan(1);
    const dataService = new data_service_1.DataService({});
    const listener1 = {
        needsNotificationAbout: (uischema) => true,
        dataChanged: (uischema, newValue, fullData) => t.pass()
    };
    dataService.registerDataChangeListener(listener1);
    const listener2 = {
        needsNotificationAbout: (uischema) => false,
        dataChanged: (uischema, newValue, fullData) => t.fail()
    };
    dataService.registerDataChangeListener(listener2);
    dataService.initDataChangeListeners();
});
ava_1.test('De-registered data change listeners are not called on init', t => {
    t.plan(0);
    const dataService = new data_service_1.DataService({});
    const listener = {
        needsNotificationAbout: (uischema) => true,
        dataChanged: (uischema, newValue, fullData) => t.fail()
    };
    dataService.registerDataChangeListener(listener);
    dataService.deregisterDataChangeListener(listener);
    dataService.initDataChangeListeners();
});
ava_1.test('Registered data change listeners are called when notified', t => {
    t.plan(3);
    const data = { foo: { bar: 'John Doe' } };
    const dataService = new data_service_1.DataService(data);
    const controlElement = {
        type: 'Control',
        scope: {
            $ref: '#/properties/foo/properties/bar'
        }
    };
    const listener1 = {
        needsNotificationAbout: (uischema) => true,
        dataChanged: (uischema, newValue, fullData) => {
            t.is(uischema, controlElement);
            t.is(newValue, 'Jane');
            t.is(fullData, data);
        }
    };
    dataService.registerDataChangeListener(listener1);
    const listener2 = {
        needsNotificationAbout: (uischema) => false,
        dataChanged: (uischema, newValue, fullData) => {
            t.fail();
        }
    };
    dataService.registerDataChangeListener(listener2);
    dataService.notifyAboutDataChange(controlElement, 'Jane');
});
ava_1.test('De-registered data change listeners are not called when notified', t => {
    t.plan(0);
    const data = { foo: { bar: 'John Doe' } };
    const dataService = new data_service_1.DataService(data);
    const controlElement = {
        type: 'Control',
        scope: { $ref: '#/properties/foo/properties/bar' }
    };
    const listener = {
        needsNotificationAbout: (uischema) => true,
        dataChanged: (uischema, newValue, fullData) => {
            t.fail();
        }
    };
    dataService.registerDataChangeListener(listener);
    dataService.deregisterDataChangeListener(listener);
    dataService.notifyAboutDataChange(controlElement, 'Jane');
});
//# sourceMappingURL=data.service.test.js.map