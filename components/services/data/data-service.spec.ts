/// <reference path="../../references.ts"/>

describe('DataProvider', () => {

    // load all necessary modules and templates
    beforeEach(module('jsonforms.form'));
    beforeEach(module('jsonforms.renderers.layouts.group'));
    beforeEach(module('jsonforms.renderers.controls.string'));

    beforeEach(module('components/form/form.html'));
    beforeEach(module('components/renderers/layouts/layout.html'));
    beforeEach(module('components/renderers/controls/control.html'));

    var $q, $timeout;
    var data = [{ name: "foo" }, { name: "bar" }, { name: "baz" }];

    class FilteringDataProvider implements JSONForms.IDataProvider {


        constructor(private $q: ng.IQService) {}

        get canPage(): boolean { return false; }
        get canFilter() :boolean { return true; }

        fetchData():angular.IPromise<any> {
            var p = this.$q.defer();
            p.resolve(data);
            return p.promise;
        }

        getData():any {
            return data;
        }

        getId():JSONForms.ServiceId {
            return JSONForms.ServiceId.DataProvider;
        }

        filter(names: string[]) {
            var p = this.$q.defer();
            var filtered = data.filter((obj) => names.indexOf(obj.name) != -1);
            p.resolve(filtered);
            return p.promise;
        }
    }


    beforeEach(inject(function(_$q_, _$timeout_) {
        $q = _$q_;
        $timeout = _$timeout_;
    }));

    it("should resolve properties path on the UI schema", (done) => {
        var provider = new FilteringDataProvider($q);
        var promise = provider.filter(['baz']);
        promise.then((filtered: any[]) => {
            expect(filtered.length).toBe(1);
        }).finally(done);
        $timeout.flush();
    });

    it("should be able to filter", () => {
        var provider = new FilteringDataProvider($q);
        expect(JSONForms.DataProviders.canFilter(provider)).toBe(true);
    });

    it("should not be able to page", () => {
        let provider = new FilteringDataProvider($q);
        expect(JSONForms.DataProviders.canPage(provider)).toBe(false);
    });

    it("should be able to page", () => {
        let provider = new JSONForms.DefaultDataProvider($q, data);
        expect(JSONForms.DataProviders.canPage(provider)).toBe(true);
    });

    it("should not be able to filter", () => {
        let provider = new JSONForms.DefaultDataProvider($q, data);
        expect(JSONForms.DataProviders.canFilter(provider)).toBe(false);
    });
});