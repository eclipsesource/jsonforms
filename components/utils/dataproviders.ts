///<reference path="../references.ts"/>

module JSONForms {

    export class DefaultDataProvider implements IDataProvider {

        private currentPage = 0;
        private currentPageSize = 2;

        constructor(private $q:ng.IQService, public data:any) {
        }

        fetchData():ng.IPromise<any> {
            var p = this.$q.defer();
            // TODO: validation missing
            p.resolve(this.data);
            return p.promise;
        }

        setPageSize = (newPageSize:number) => {
            this.currentPageSize = newPageSize
        };

        fetchPage = (page:number, size:number) => {
            this.currentPage = page;
            this.currentPageSize = size;
            var p = this.$q.defer();
            if (this.data instanceof Array) {
                p.resolve(
                    this.data.slice(this.currentPage * this.currentPageSize, this.currentPage * this.currentPageSize + this.currentPageSize));
            } else {
                p.resolve(this.data);
            }
            return p.promise;
        };

        totalItems = this.data.length;
        pageSize = this.currentPageSize
        page = this.currentPage
    }
}