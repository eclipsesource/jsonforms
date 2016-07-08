import { IService } from "../services";
export interface IDataProvider extends IService {
    fetchData(): ng.IPromise<any>;
    getData(): any;
    canPage: boolean;
    canFilter: boolean;
}
export interface IPagingDataProvider extends IDataProvider {
    fetchPage(page: number): ng.IPromise<any>;
    getTotalItems(): number;
    setPageSize(size: number): any;
}
export interface IFilteringDataProvider extends IDataProvider {
    filter(terms: any): ng.IPromise<any>;
}
