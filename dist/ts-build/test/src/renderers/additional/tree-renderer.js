"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSX_1 = require("../JSX");
const inferno_1 = require("inferno");
const core_1 = require("../../core");
const renderer_1 = require("../../core/renderer");
const _ = require("lodash");
const path_util_1 = require("../../path.util");
const testers_1 = require("../../core/testers");
const actions_1 = require("../../actions");
const ui_schema_gen_1 = require("../../generators/ui-schema-gen");
const inferno_redux_1 = require("inferno-redux");
const index_1 = require("../../reducers/index");
const dispatch_renderer_1 = require("../dispatch-renderer");
const renderer_util_1 = require("../renderer.util");
/**
 * Default tester for a master-detail layout.
 * @type {RankedTester}
 */
exports.treeMasterDetailTester = testers_1.rankWith(2, testers_1.and(testers_1.uiTypeIs('MasterDetailLayout'), uischema => {
    const control = uischema;
    if (control.scope === undefined || control.scope === null) {
        return false;
    }
    return !(control.scope.$ref === undefined || control.scope.$ref === null);
}));
const isNotTuple = (schema) => !Array.isArray(schema.items);
class TreeMasterDetail extends renderer_1.Renderer {
    componentWillMount() {
        const { uischema, data, resolvedSchema } = this.props;
        const controlElement = uischema;
        if (_.isArray(data)) {
            const dataPathSegments = path_util_1.toDataPathSegments(controlElement.scope.$ref);
            const path = _.isEmpty(dataPathSegments) ? '' : dataPathSegments.join('.');
            this.setState({
                selected: {
                    schema: resolvedSchema.items,
                    data: data[0],
                    path: path_util_1.compose(path, '0')
                }
            });
        }
        else {
            this.setState({
                selected: {
                    schema: resolvedSchema,
                    data,
                    path: ''
                }
            });
        }
    }
    render() {
        const { uischema, resolvedSchema, visible } = this.props;
        const controlElement = uischema;
        const rootData = this.props.data;
        return (JSX_1.JSX.createElement("div", { hidden: !visible, className: 'jsf-treeMasterDetail' },
            JSX_1.JSX.createElement("div", { className: 'jsf-treeMasterDetail-header' },
                JSX_1.JSX.createElement("label", null, typeof controlElement.label === 'string' ? controlElement.label : ''),
                Array.isArray(rootData) &&
                    JSX_1.JSX.createElement("button", { className: 'jsf-treeMasterDetail-add', onClick: () => {
                            this.addToRoot();
                        } }, "Add to root")),
            JSX_1.JSX.createElement("div", { className: 'jsf-treeMasterDetail-content' },
                JSX_1.JSX.createElement("div", { className: 'jsf-treeMasterDetail-master' }, this.renderMaster(resolvedSchema)),
                JSX_1.JSX.createElement("div", { className: 'jsf-treeMasterDetail-detail' }, this.state.selected ?
                    JSX_1.JSX.createElement(dispatch_renderer_1.default, { schema: this.state.selected.schema, path: this.state.selected.path, uischema: ui_schema_gen_1.generateDefaultUISchema(this.state.selected.schema) }) : 'Select an item')),
            JSX_1.JSX.createElement("div", null,
                JSX_1.JSX.createElement("dialog", { id: 'dialog' },
                    JSX_1.JSX.createElement("label", null, "Select item to create"),
                    JSX_1.JSX.createElement("div", { id: 'dialog-content-container', className: 'content' }),
                    JSX_1.JSX.createElement("button", { className: 'jsf-treeMasterDetail-dialog-close', onClick: () => {
                            this.closeDialog();
                        } }, "Close")))));
    }
    // create dialog on demand
    // open dialog
    openDialog(ev, schema, parentPath) {
        const { dispatch } = this.props;
        ev.stopPropagation();
        const dialog = document.getElementById('dialog');
        const vnodeContent = JSX_1.JSX.createElement("div", { className: 'dialog-content' }, core_1.JsonForms.schemaService.getContainmentProperties(schema)
            .map(prop => JSX_1.JSX.createElement("button", { className: core_1.JsonForms.stylingRegistry.get('button'), onClick: () => {
                const newData = _.keys(prop.schema.properties).reduce((d, key) => {
                    if (prop.schema.properties[key].default) {
                        d[key] = prop.schema.properties[key].default;
                    }
                    return d;
                }, {});
                // prop.addToData(data)(newData);
                dispatch(actions_1.update(path_util_1.compose(parentPath, prop.property), array => {
                    if (_.isEmpty(array)) {
                        return [newData];
                    }
                    array.push(newData);
                    return array;
                }));
                dialog.close();
            } }, prop.label)));
        // TODO
        inferno_1.default.render(vnodeContent, document.getElementById('dialog-content-container'));
        dialog.showModal();
    }
    closeDialog() {
        const dialog = document.getElementById('dialog');
        dialog.close();
    }
    addToRoot() {
        const { schema, dispatch, path } = this.props;
        if (isNotTuple(schema)) {
            dispatch(actions_1.update(path, data => {
                const clone = data.slice();
                clone.push({});
                return clone;
            }));
        }
    }
    renderMaster(schema) {
        // TODO: so far no drag and drop support
        if (schema.items !== undefined) {
            return (JSX_1.JSX.createElement("ul", null, this.expandRootArray(schema.items)));
        }
        else {
            return (JSX_1.JSX.createElement("ul", null, this.expandObject(this.props.path, schema, null)));
        }
    }
    /**
     * Expands the given array of root elements by expanding every element.
     * It is assumed that the roor elements do not support drag and drop.
     * Based on this, a delete function is created for every element.
     *
     * @param data the array to expand
     * @param schema the {@link JsonSchema} defining the elements' type
     */
    expandRootArray(schema) {
        const { dispatch, path } = this.props;
        const data = this.props.data;
        if (data === undefined || data === null) {
            return;
        }
        return data.map((element, index) => {
            const composedPath = path_util_1.compose(path, index + '');
            return this.expandObject(composedPath, schema, () => dispatch(actions_1.update(path, d => {
                const clone = d.slice();
                clone.splice(index, 1);
                return clone;
            })));
        });
    }
    /**
     * Expands the given data array by expanding every element.
     * If the parent data containing the array is provided,
     * a suitable delete function for the expanded elements is created.
     *
     * @param data the array to expand
     * @param property the {@link ContainmentProperty} defining the property that the array belongs to
     * @param parentData the data containing the array as a property
     */
    expandArray(data, property, path, parentData) {
        if (data === undefined || data === null) {
            return;
        }
        return data.map((element, index) => {
            let deleteFunction = null;
            if (!_.isEmpty(parentData)) {
                deleteFunction = d => {
                    property.deleteFromData(parentData)(d);
                    return parentData;
                };
            }
            const composedPath = path_util_1.compose(path, index.toString() + '');
            return this.expandObject(composedPath, property.schema, deleteFunction);
        });
    }
    getNamingFunction(schema) {
        const { uischema } = this.props;
        if (uischema.options !== undefined) {
            const labelProvider = uischema.options.labelProvider;
            if (labelProvider !== undefined && labelProvider[schema.id] !== undefined) {
                return element => {
                    return element[labelProvider[schema.id]];
                };
            }
        }
        const namingKeys = Object.keys(schema.properties).filter(key => key === 'id' || key === 'name');
        if (namingKeys.length !== 0) {
            return element => element[namingKeys[0]];
        }
        return obj => JSON.stringify(obj);
    }
    /**
     * Renders a data object as a <li> child element of the given <ul> list.
     *
     * @param data The rendered data
     * @param schema The schema describing the rendered data's type
     * @param deleteFunction A function to delete the data from the model
     */
    expandObject(scopedPath, schema, deleteFunction) {
        const { uischema, rootData } = this.props;
        const data = path_util_1.resolveData(rootData, scopedPath);
        const liClasses = this.state.selected === data ? 'selected' : '';
        const vnode = (JSX_1.JSX.createElement("li", { className: liClasses },
            JSX_1.JSX.createElement("div", null,
                _.has(uischema.options, 'imageProvider') ?
                    JSX_1.JSX.createElement("span", { className: `icon ${uischema.options.imageProvider[schema.id]}` }) : '',
                JSX_1.JSX.createElement("span", { className: 'label', onClick: ev => {
                        this.setState({
                            selected: {
                                schema,
                                data,
                                path: scopedPath
                            }
                        });
                    } },
                    JSX_1.JSX.createElement("span", null, this.getNamingFunction(schema)(data)),
                    core_1.JsonForms.schemaService.hasContainmentProperties(schema) ?
                        (JSX_1.JSX.createElement("span", { className: 'add', onClick: ev => {
                                this.openDialog(ev, schema, scopedPath);
                            } }, '\u2795')) : '',
                    deleteFunction !== null &&
                        JSX_1.JSX.createElement("span", { className: 'remove', onClick: () => {
                                deleteFunction();
                            } }, '\u274C'))),
            // render contained children of this element
            core_1.JsonForms.schemaService.getContainmentProperties(schema)
                .filter(prop => this.propHasData(prop, data))
                .map(prop => JSX_1.JSX.createElement("ul", null, this.renderChildren(prop, scopedPath, schema, data)))));
        // add a separate list for each containment property
        core_1.JsonForms.schemaService.getContainmentProperties(schema).forEach(p => {
            const id = p.schema.id;
            if (id === undefined || id === null) {
                // TODO proper logging
                console.warn('The property\'s schema with label \'' + p.label
                    + '\' has no id. No Drag & Drop is possible.');
                return;
            }
            // FIXME: DND support
            // FIXME: create child list and activate drag and drop
            // registerDnDWithGroupId(this.treeNodeMapping, ul, id);
        });
        return vnode;
    }
    propHasData(prop, data) {
        const { uischema } = this.props;
        const sid = prop.schema.id;
        if (sid === undefined || sid === null) {
            // TODO proper logging
            console.warn('The property\'s schema with label \'' + prop.label
                + '\' has no id. No Drag & Drop is possible.');
        }
        let propertyData = prop.getData(data);
        /*tslint:disable:no-string-literal */
        if (uischema.options !== undefined &&
            uischema.options['modelMapping'] !== undefined
            && !_.isEmpty(propertyData)) {
            propertyData = propertyData.filter(value => {
                // only use filter criterion if the checked value has the mapped attribute
                if (value[uischema.options['modelMapping'].attribute]) {
                    return prop.schema.id === uischema.options['modelMapping']
                        .mapping[value[uischema.options['modelMapping'].attribute]];
                }
                return true;
            });
        }
        // TODO: remove check OR add id to test data (?)
        return !_.isEmpty(propertyData);
    }
    // TODO: update selected element once selection has been changed
    renderChildren(prop, parentPath, parentSchema, parentData) {
        const composedPath = path_util_1.compose(parentPath, prop.property);
        const data = path_util_1.resolveData(this.props.data, composedPath);
        const schema = prop.schema;
        const array = data;
        const key = prop.property;
        const parentProperties = core_1.JsonForms.schemaService.getContainmentProperties(parentSchema);
        for (const property of parentProperties) {
            // If available, additionally use schema id to identify the correct property
            if (!_.isEmpty(schema.id) && schema.id !== property.schema.id) {
                continue;
            }
            if (key === property.property) {
                return this.expandArray(array, property, composedPath, parentData);
            }
        }
        // TODO proper logging
        console.warn('Could not render children because no fitting property was found.');
        return undefined;
    }
}
exports.TreeMasterDetail = TreeMasterDetail;
const mapStateToProps = (state, ownProps) => {
    const path = path_util_1.compose(ownProps.path, path_util_1.toDataPathSegments(ownProps.uischema.scope.$ref).join('.'));
    const visible = _.has(ownProps, 'visible') ? ownProps.visible : renderer_1.isVisible(ownProps, state);
    const enabled = _.has(ownProps, 'enabled') ? ownProps.enabled : renderer_1.isEnabled(ownProps, state);
    return {
        rootData: index_1.getData(state),
        data: path_util_1.resolveData(index_1.getData(state), path),
        uischema: ownProps.uischema,
        schema: ownProps.schema,
        resolvedSchema: path_util_1.resolveSchema(ownProps.schema, ownProps.uischema.scope.$ref),
        path,
        visible,
        enabled
    };
};
exports.default = renderer_util_1.registerStartupRenderer(exports.treeMasterDetailTester, inferno_redux_1.connect(mapStateToProps)(TreeMasterDetail));
//# sourceMappingURL=tree-renderer.js.map