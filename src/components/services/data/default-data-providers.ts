
import {ServiceId} from '../services';
import {IDataProvider, IPagingDataProvider, IFilteringDataProvider} from './data-providers';

export class DataProviders {
    static canPage(provider: IDataProvider): provider is IPagingDataProvider {
        return provider.canPage;
    }
    static canFilter(provider: IDataProvider): provider is IFilteringDataProvider {
        return provider.canFilter;
    }
}

export class DefaultDataProvider implements IPagingDataProvider {
    canPage = true;
    canFilter = false;

    private _page = 0;
    private _pageSize = 2;
    private _data: any;

    constructor(private $q: ng.IQService, data: any) {
        this._data = data;
    }

    getId(): ServiceId {
        return ServiceId.DataProvider;
    }

    getData(): any {
        return this._data;
    }

    fetchData(): ng.IPromise<any> {
        let p = this.$q.defer();
        // TODO: validation missing
        p.resolve(this._data);
        return p.promise;
    }

    setPageSize = (newPageSize: number) => {
        this._pageSize = newPageSize;
    };

    fetchPage(page: number) {
        this._page = page;
        let p = this.$q.defer();
        if (this._data instanceof Array) {
            p.resolve(
                this._data.slice(
                    this._page * this._pageSize,
                    this._page * this._pageSize + this._pageSize)
            );
        } else {
            p.resolve(this._data);
        }
        return p.promise;
    }

    getTotalItems(): number {
        return this._data.length;
    }
}

export class DefaultInternalDataProvider implements IDataProvider {

    private _data: any;

    constructor(data: any) {
        this._data = data;
    }

    get canPage(): boolean { return false; }
    get canFilter(): boolean { return false; }

    getId(): ServiceId {
        return ServiceId.DataProvider;
    }

    getData(): any {
        return this._data;
    }

    fetchData(): angular.IPromise<any> {
        return undefined;
    }


    getTotalItems() {
        return this._data.length;
    }
}
