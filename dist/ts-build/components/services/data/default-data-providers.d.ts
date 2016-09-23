import { ServiceId } from '../services';
import { IDataProvider, IPagingDataProvider, IFilteringDataProvider } from './data-providers';
export declare class DataProviders {
    static canPage(provider: IDataProvider): provider is IPagingDataProvider;
    static canFilter(provider: IDataProvider): provider is IFilteringDataProvider;
}
export declare class DefaultDataProvider implements IPagingDataProvider {
    private $q;
    canPage: boolean;
    canFilter: boolean;
    private _page;
    private _pageSize;
    private _data;
    constructor($q: ng.IQService, data: any);
    getId(): ServiceId;
    getData(): any;
    fetchData(): ng.IPromise<any>;
    setPageSize: (newPageSize: number) => void;
    fetchPage(page: number): ng.IPromise<{}>;
    getTotalItems(): number;
}
export declare class DefaultInternalDataProvider implements IDataProvider {
    private _data;
    constructor(data: any);
    canPage: boolean;
    canFilter: boolean;
    getId(): ServiceId;
    getData(): any;
    fetchData(): angular.IPromise<any>;
    getTotalItems(): any;
}
