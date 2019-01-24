import JsonRefs from 'json-refs';

export const RS_PROTOCOL = 'rs://';

/**
 * A ResourceSet contains an arbitrary number of data objects, each registered under a unique name.
 */
export interface ResourceSet {
  /**
   * Get the resource registered for the given name.
   * @param name The name of the resource to retrieve.
   * @return The resource if it is present; undefined otherwise.
   */
  getResource(name: string): Object;

  /**
   * Returns whether the resource set contains a data resource for the given name.
   * @param name the name identifying the resource
   * @return whether the resource is present in the resource set
   */
  hasResource(name: string): Object;

  /**
   * Register the given resource under the given name.
   * @param name The name to register the resource for.
   *             It can later be retrieved by calling getResource() for the same name.
   * @param resource The resource Object
   * @param resolveReferenecs If true, JSON References in the resource are resolved
   * @return The old resource if one was already registered for the given name, undefined otherwise
   */
  registerResource(
    name: string,
    resource: Object,
    resolveReferences: boolean
  ): Object;

  /**
   * Remove all registered resources from the ResourceSet.
   */
  clear(): void;
}

export class ResourceSetImpl implements ResourceSet {
  private resourceMap: { [name: string]: Object };

  constructor() {
    this.resourceMap = {};
  }

  getResource(name: string) {
    return this.resourceMap[name];
  }

  hasResource(name: string) {
    return this.resourceMap[name] !== undefined;
  }

  registerResource(
    name: string,
    resource: Object,
    resolveReferences = false
  ): Object {
    const oldResource = this.resourceMap[name];
    if (resolveReferences) {
      const resourcePromise = JsonRefs.resolveRefs(resource, {
        includeInvalid: true
      });
      resourcePromise.then(result => {
        this.resourceMap[name] = result.resolved;
      });
    } else {
      this.resourceMap[name] = resource;
    }

    return oldResource;
  }

  clear() {
    this.resourceMap = {};
  }
}
