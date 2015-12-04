///<reference path="../references.ts"/>

declare module JSONForms{

    export interface IDataProvider extends IService {

        /**
         * Initially fetches the data instance
         *
         * @return a promise returning the initially fetched data
         */
        fetchData(): ng.IPromise<any>


        /**
         * Returns the instance.
         *
         * @return {any} the instance
         */
        getData(): any

        /**
         * Fetches the given page of data.
         *
         * @param page the page to be fetched
         * @return a promise returning the fetched data
         */
        fetchPage?(page:number): ng.IPromise<any>

        /**
         * Returns the currently used page size by the data provider.
         *
         * @return {number} the current page size
         */
        getPageSize?(): number

        /**
         * Set the page size to be used by the data provider.
         *
         * @param size the page size
         */
        setPageSize?(size:number)

        /**
         * Returns the current page the data provider currently has in scope.
         *
         * @return {number} the current page
         */
        getPage?(): number

        /**
         * Returns the overall number of items available.
         * Since not all data provider are able to determine an overall number of items,
         * this method is optional.
         *
         * @return {number} the overall number of items
         */
        getTotalItems?(): number

        /**
         * Fetches the data filtered accordingly to the given terms.
         *
         * @param terms search terms
         */
        filter?(terms: any): ng.IPromise<any>
    }
}
