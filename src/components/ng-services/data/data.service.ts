import * as angular from 'angular';

export class DataService {

    private root: any;

    public unset() {
        this.root = undefined;
    }

    public setRoot(newRootData: any) {
        if (this.root === undefined) {
            this.root = newRootData;
        }
    }

    public getRoot(): any {
        return this.root;
    }
}


export default angular
    .module('jsonforms.service.data', [])
    .service('DataService', DataService)
    .name;
