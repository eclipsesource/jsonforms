///<reference path="../references.ts"/>

module JSONForms {

    export class DefaultDataProvider implements IDataProvider {

        private _page = 0;
        private _pageSize = 2;
        private _data:any;

        constructor(private $q: ng.IQService, data: any) {
            this._data = data;
        }

        getId(): ServiceId {
            return ServiceId.DataProvider;
        }

        getData():any {
            return this._data;
        }

        getPageSize():number {
            return this._pageSize;
        }

        getPage():number {
            return this._page;
        }

        fetchData(): ng.IPromise<any> {
            var p = this.$q.defer();
            // TODO: validation missing
            p.resolve(this._data);
            return p.promise;
        }

        setPageSize = (newPageSize: number) => {
            this._pageSize = newPageSize
        };

        fetchPage = (page: number, size: number) => {
            this._page = page;
            this._pageSize = size;
            var p = this.$q.defer();
            if (this._data instanceof Array) {
                p.resolve(
                    this._data.slice(this._page * this._pageSize, this._page * this._pageSize + this._pageSize));
            } else {
                p.resolve(this._data);
            }
            return p.promise;
        };

        totalItems() {
            return this._data.length;
        }
    }

    export class DefaultInternalDataProvider implements IDataProvider {

        private _pageSize:number;
        private _page:number;
        private _data:any;

        constructor(data: any) {
            this._data = data;
        }

        getId():JSONForms.ServiceId {
            return ServiceId.DataProvider;
        }

        getPageSize():number {
            return this._pageSize;
        }

        getPage():number {
            return this._page;
        }

        getData():any {
            return this._data;
        }

        fetchData():angular.IPromise<any> {
            return undefined;
        }

        fetchPage(page:number, size:number):angular.IPromise<any> {
            return undefined;
        }

        filter():angular.IPromise<any> {
            return undefined;
        }

        setPageSize(size:number) {
        }

        getTotalItems() {
            return this._data.length;
        }
    }
}