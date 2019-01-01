import { ResourceSet, ResourceSetImpl } from './resource-set';

export class ResourcesGlobal {
  private _resourceSet: ResourceSet;

  public get resourceSet(): ResourceSet {
    if (this._resourceSet === null) {
      this._resourceSet = new ResourceSetImpl();
    }
    return this._resourceSet;
  }
}

const Resources = new ResourcesGlobal();
export { Resources };
