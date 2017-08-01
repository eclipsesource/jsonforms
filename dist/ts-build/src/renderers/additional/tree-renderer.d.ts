import { MasterDetailLayout, Scopable } from '../../models/uischema';
import { Renderer } from '../../core/renderer';
import { DataChangeListener } from '../../core/data.service';
import { RankedTester } from '../../core/testers';
import { RUNTIME_TYPE } from '../../core/runtime';
/**
 * Default tester for a master-detail layout.
 * @type {RankedTester}
 */
export declare const treeMasterDetailTester: RankedTester;
/**
 * Default renderer for a tree-based master-detail layout.
 */
export declare class TreeMasterDetailRenderer extends Renderer implements DataChangeListener {
    private master;
    private detail;
    private selected;
    private dialog;
    private addingToRoot;
    private resolvedSchema;
    /** maps tree nodes (<li>) to their represented data, and schema delete function */
    private treeNodeMapping;
    constructor();
    connectedCallback(): void;
    disconnectedCallback(): void;
    dispose(): void;
    runtimeUpdated(type: RUNTIME_TYPE): void;
    render(): HTMLElement;
    needsNotificationAbout(uischema: Scopable): boolean;
    dataChanged(uischema: MasterDetailLayout, newValue: any, data: any): void;
    private renderFull();
    private selectFirstElement();
    private renderMaster(schema);
    /**
     * Expands the given array of root elements by expanding every element.
     * It is assumed that the roor elements do not support drag and drop.
     * Based on this, a delete function is created for every element.
     *
     * @param data the array to expand
     * @param parent the list that will contain the expanded elements
     * @param schema the {@link JsonSchema} defining the elements' type
     */
    private expandRootArray(data, parent, schema);
    /**
     * Expands the given data array by expanding every element.
     * If the parent data containing the array is provided,
     * a suitable delete function for the expanded elements is created.
     *
     * @param data the array to expand
     * @param parent the list that will contain the expanded elements
     * @param property the {@link ContainmentProperty} defining the property that the array belongs to
     * @param parentData the data containing the array as a property
     */
    private expandArray(data, parent, property, parentData?);
    private getNamingFunction(schema);
    /**
     * Updates the tree after a data object was added to property key of tree element li
     *
     * @param schema the JSON schema of the added data
     * @param key the key of the property that the data was added to
     * @param li the rendered list entry representing the parent object
     * @param newData the added data
     * @param deleteFunction function to allow deleting the data in the future
     */
    private updateTreeOnAdd(schema, key, li, newData, deleteFunction);
    /**
     * Renders a data object as a <li> child element of the given <ul> list.
     *
     * @param data The rendered data
     * @param parent The parent list to which the rendered element is added
     * @param schema The schema describing the rendered data's type
     * @param deleteFunction A function to delete the data from the model
     */
    private expandObject(data, parent, schema, deleteFunction);
    private findRendererChildContainer(li, key, id?);
    /**
     * Renders an array as children of the given <li> tree node.
     *
     * @param array the objects to render
     * @param schema the JsonSchema describing the objects
     * @param li The parent tree node of the rendered objects
     * @param key The parent's property that contains the rendered children
     */
    private renderChildren(array, schema, li, key);
    private renderDetail(element, label, schema);
}
