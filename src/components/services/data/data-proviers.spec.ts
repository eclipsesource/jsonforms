import 'angular';
import 'angular-mocks';
import '../../../index';

import {DataProviders, DefaultDataProvider} from './default-data-providers';
import {IDataProvider} from './data-providers';
import {ServiceId} from '../services';


describe('DataProvider', () => {

    // load all necessary modules and templates
    beforeEach(angular.mock.module('jsonforms.form'));

    let $q, $timeout;
    let data = [{ name: 'foo' }, { name: 'bar' }, { name: 'baz' }];

    class FilteringDataProvider implements IDataProvider {


        constructor(private $q: ng.IQService) {}

        get canPage(): boolean { return false; }
        get canFilter(): boolean { return true; }

        fetchData(): angular.IPromise<any> {
            let p = this.$q.defer();
            p.resolve(data);
            return p.promise;
        }

        getData(): any {
            return data;
        }

        getId(): ServiceId {
            return ServiceId.DataProvider;
        }

        filter(names: string[]) {
            let p = this.$q.defer();
            let filtered = data.filter((obj) => names.indexOf(obj.name) !== -1);
            p.resolve(filtered);
            return p.promise;
        }
    }


    beforeEach(angular.mock.inject(function(_$q_, _$timeout_) {
        $q = _$q_;
        $timeout = _$timeout_;
    }));

    it('should resolve properties path on the UI schema', (done) => {
        let provider = new FilteringDataProvider($q);
        let promise = provider.filter(['baz']);
        promise.then((filtered: any[]) => {
            expect(filtered.length).toBe(1);
        }).finally(done);
        $timeout.flush();
    });

    it('should be able to filter', () => {
        let provider = new FilteringDataProvider($q);
        expect(DataProviders.canFilter(provider)).toBe(true);
    });

    it('should not be able to page', () => {
        let provider = new FilteringDataProvider($q);
        expect(DataProviders.canPage(provider)).toBe(false);
    });

    it('should be able to page', () => {
        let provider = new DefaultDataProvider($q, data);
        expect(DataProviders.canPage(provider)).toBe(true);
    });

    it('should not be able to filter', () => {
        let provider = new DefaultDataProvider($q, data);
        expect(DataProviders.canFilter(provider)).toBe(false);
    });
});
