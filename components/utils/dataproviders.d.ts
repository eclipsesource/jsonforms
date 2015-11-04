///<reference path="../references.ts"/>

declare module JSONForms{
    export interface IDataProvider extends IService {
        fetchData(): ng.IPromise<any>
        fetchPage(page:number, size:number): ng.IPromise<any>
        setPageSize(size:number)
        getData(): any
        getPageSize(): number
        getPage(): number
        getTotalItems?(): number
    }
}
