///<reference path="../references.ts"/>

declare module JSONForms{
    export interface IDataProvider {
        data: any
        fetchData(): ng.IPromise<any>
        fetchPage(page: number, size: number): ng.IPromise<any>
        setPageSize(size: number)
        pageSize: number
        page: number
        totalItems?: number
    }
}
