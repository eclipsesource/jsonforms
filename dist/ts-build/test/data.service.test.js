"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ava_1 = require("ava");
var data_service_1 = require("../src/core/data.service");
ava_1.test('DataService getValue ', function (t) {
    var data = { foo: { bar: 'John Doe' } };
    var dataService = new data_service_1.DataService(data);
    var value = dataService.getValue({ type: 'Control', scope: { $ref: '#/properties/foo/properties/bar' } });
    t.is(value, 'John Doe');
});
ava_1.test('DataService getValue root', function (t) {
    var data = { foo: { bar: 'John Doe' } };
    var dataService = new data_service_1.DataService(data);
    var value = dataService.getValue({ type: 'Control', scope: { $ref: '#' } });
    t.is(value, data);
});
ava_1.test('DataService notifyChange updates data ', function (t) {
    var data = { foo: { bar: 'John Doe' } };
    var dataService = new data_service_1.DataService(data);
    var controlElement = {
        type: 'Control',
        scope: { $ref: '#/properties/foo/properties/bar' }
    };
    dataService.notifyChange(controlElement, 'Jane');
    var value = dataService.getValue(controlElement);
    t.is(value, 'Jane');
});
ava_1.test('DataService registered listeners are called on root run', function (t) {
    t.plan(1);
    var dataService = new data_service_1.DataService({});
    var listener1 = {
        isRelevantKey: function (uischema) { return true; },
        notifyChange: function (uischema, newValue, full_data) { return t.pass(); }
    };
    dataService.registerChangeListener(listener1);
    var listener2 = {
        isRelevantKey: function (uischema) { return false; },
        notifyChange: function (uischema, newValue, full_data) { return t.fail(); }
    };
    dataService.registerChangeListener(listener2);
    dataService.initialRootRun();
});
ava_1.test('DataService unregistered listeners are not called on root run', function (t) {
    t.plan(0);
    var dataService = new data_service_1.DataService({});
    var listener = {
        isRelevantKey: function (uischema) { return true; },
        notifyChange: function (uischema, newValue, full_data) { return t.fail(); }
    };
    dataService.registerChangeListener(listener);
    dataService.unregisterChangeListener(listener);
    dataService.initialRootRun();
});
ava_1.test('DataService registered listeners are called on notify', function (t) {
    t.plan(3);
    var data = { foo: { bar: 'John Doe' } };
    var dataService = new data_service_1.DataService(data);
    var controlElement = {
        type: 'Control',
        scope: { $ref: '#/properties/foo/properties/bar' }
    };
    var listener1 = {
        isRelevantKey: function (uischema) { return true; },
        notifyChange: function (uischema, newValue, full_data) {
            t.is(uischema, controlElement);
            t.is(newValue, 'Jane');
            t.is(full_data, data);
        }
    };
    dataService.registerChangeListener(listener1);
    var listener2 = {
        isRelevantKey: function (uischema) { return false; },
        notifyChange: function (uischema, newValue, full_data) {
            t.fail();
        }
    };
    dataService.registerChangeListener(listener2);
    dataService.notifyChange(controlElement, 'Jane');
});
ava_1.test('DataService unregistered listeners are not called on notify', function (t) {
    t.plan(0);
    var data = { foo: { bar: 'John Doe' } };
    var dataService = new data_service_1.DataService(data);
    var controlElement = {
        type: 'Control',
        scope: { $ref: '#/properties/foo/properties/bar' }
    };
    var listener = {
        isRelevantKey: function (uischema) { return true; },
        notifyChange: function (uischema, newValue, full_data) {
            t.fail();
        }
    };
    dataService.registerChangeListener(listener);
    dataService.unregisterChangeListener(listener);
    dataService.notifyChange(controlElement, 'Jane');
});
//# sourceMappingURL=data.service.test.js.map