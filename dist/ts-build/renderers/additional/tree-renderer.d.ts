import { JsonSchema } from '../../models/jsonSchema';
import { RankedTester } from '../../core/testers';
import { Control, ControlProps, ControlState } from '../controls/Control';
/**
 * Default tester for a master-detail layout.
 * @type {RankedTester}
 */
export declare const treeMasterDetailTester: RankedTester;
export interface TreeMasterDetailState extends ControlState {
    selected: {
        schema: JsonSchema;
        data: any;
        path: string;
    };
    dialog: {
        open: boolean;
        schema: JsonSchema;
        path: string;
    };
}
export interface TreeProps extends ControlProps {
    resolvedSchema: any;
    rootData: any;
}
export declare class TreeMasterDetail extends Control<TreeProps, TreeMasterDetailState> {
    componentWillMount(): void;
    render(): any;
    private closeDialog();
    private addToRoot();
    private renderMaster(schema);
    /**
     * Expands the given array of root elements by expanding every element.
     * It is assumed that the roor elements do not support drag and drop.
     * Based on this, a delete function is created for every element.
     *
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
