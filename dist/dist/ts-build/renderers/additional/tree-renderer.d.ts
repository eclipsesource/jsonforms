import { Renderer } from '../../core/renderer';
import { JsonSchema } from '../../models/jsonSchema';
import { RankedTester } from '../../core/testers';
import { ControlProps } from '../controls/Control';
/**
 * Default tester for a master-detail layout.
 * @type {RankedTester}
 */
export declare const treeMasterDetailTester: RankedTester;
export interface TreeMasterDetailState {
    selected: {
        schema: JsonSchema;
        data: any;
        path: string;
    };
}
export declare class TreeMasterDetail extends Renderer<ControlProps, TreeMasterDetailState> {
    componentWillMount(): void;
    render(): any;
    openDialog(ev: Event, schema: JsonSchema, parentPath: string): void;
    private closeDialog();
    private addToRoot();
    private renderMaster(schema);
    /**
     * Expands the given array of root elements by expanding every element.
     * It is assumed that the roor elements do not support drag and drop.
     * Based on this, a delete function is created for every element.
     *
     * @param data the array to expand
     * @param schema the {@link JsonSchema} defining the elements' type
     */
    private expandRootArray(schema);
    /**
     * Expands the given data array by expanding every element.
     * If the parent data containing the array is provided,
     * a suitable delete function for the expanded elements is created.
     *
     * @param data the array to expand
     * @param property the {@link ContainmentProperty} defining the property that the array belongs to
     * @param parentData the data containing the array as a property
     */
    private expandArray(data, property, path, parentData?);
    private getNamingFunction(schema);
    /**
     * Renders a data object as a <li> child element of the given <ul> list.
     *
     * @param data The rendered data
     * @param schema The schema describing the rendered data's type
     * @param deleteFunction A function to delete the data from the model
     */
    private expandObject(scopedPath, schema, deleteFunction);
    private propHasData(prop, data);
    private renderChildren(prop, parentPath, parentSchema, parentData);
}
declare const _default: any;
export default _default;
