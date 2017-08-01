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
    private expandArray(data, parent, schema);
    private getNamingFunction(schema);
    private updateTreeOnAdd(schema, li, newData, deleteFunction);
    private expandObject(data, parent, schema, deleteFunction);
    private findRendererChildContainer(li, key);
    private renderChildren(array, schema, li, key);
    private renderDetail(element, label, schema);
}
