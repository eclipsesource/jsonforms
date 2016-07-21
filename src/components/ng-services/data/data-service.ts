import * as angular from 'angular';

export class RootDataService {

    private root: any;

    public unset() {
        this.root = undefined;
    }

    public setData(newRootData: any) {
        if (this.root === undefined) {
            this.root = newRootData;
        }
    }

    public getRootData(): any {
        return this.root;
    }
}


export default angular
    .module('jsonforms.data.root', [])
    .service('RootDataService', RootDataService)
    .name;
