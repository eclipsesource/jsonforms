//
'use strict';

describe('The BindingService', function() {

    beforeEach(module('jsonForms.services'));

    it('should allow adding new bindings', inject(function(BindingService) {
        expect(BindingService).not.toBeUndefined();
        BindingService.add("foo", 42);
        expect(BindingService.binding("foo")).toBe(42);
        expect(BindingService.binding("bar")).toBe(undefined);
    }));

    it('should allow to retrieve all bindings', inject(function(BindingService) {
        expect(BindingService).not.toBeUndefined();
        BindingService.add("foo", 42);
        BindingService.add("bar", undefined);
        expect(Object.keys(BindingService.all(false)).length).toBe(2);
    }));

    it('should allow to retrieve all bindings', inject(function(BindingService) {
        expect(BindingService).not.toBeUndefined();
        BindingService.add("foo", 42);
        BindingService.add("bar", undefined);
        expect(Object.keys(BindingService.all(true)).length).toBe(1);
    }));
});
