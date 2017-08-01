import { JsonSchema } from '../../models/jsonSchema';
export declare type TreeNodeInfo = {
    data: object;
    schema: JsonSchema;
    deleteFunction(toDelete: object): void;
};
/**
 * Returns a function that handles the sortablejs onRemove event
 */
export declare const dragAndDropRemoveHandler: (treeNodeMapping: Map<HTMLLIElement, TreeNodeInfo>) => (evt: any) => void;
/**
 * Returns a function that handles the SortableJs onUpdate event.
 * It is triggered when an element is moved inside a list.
 * It is not triggered when an element is dragged and then dropped at its original position.
 */
export declare const dragAndDropUpdateHandler: (treeNodeMapping: Map<HTMLLIElement, TreeNodeInfo>) => (evt: any) => void;
/**
 * Returns a function that handles the sortablejs onAdd Event.
 */
export declare const dragAndDropAddHandler: (treeNodeMapping: Map<HTMLLIElement, TreeNodeInfo>) => (evt: any) => void;
/**
 * Activates drag and drop for all direct children of the given list.
 *
 * @param treeNodeMapping maps the trees renderer li nodes to their represented data, schema,
 *        and delete function
 * @param list the list that will support drag and drop
 * @param id the id identifying the type of the list's elements
 */
export declare const registerDnDWithGroupId: (treeNodeMapping: Map<HTMLLIElement, TreeNodeInfo>, list: HTMLUListElement, id: string) => void;
