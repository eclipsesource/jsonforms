"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var JSX_1 = require("../JSX");
var inferno_1 = require("inferno");
var core_1 = require("../../core");
var renderer_1 = require("../../core/renderer");
var _ = require("lodash");
var path_util_1 = require("../../path.util");
var testers_1 = require("../../core/testers");
var actions_1 = require("../../actions");
var ui_schema_gen_1 = require("../../generators/ui-schema-gen");
var inferno_redux_1 = require("inferno-redux");
var index_1 = require("../../reducers/index");
var dispatch_renderer_1 = require("../dispatch-renderer");
var renderer_util_1 = require("../renderer.util");
/**
 * Default tester for a master-detail layout.
 * @type {RankedTester}
 */
exports.treeMasterDetailTester = testers_1.rankWith(2, testers_1.and(testers_1.uiTypeIs('MasterDetailLayout'), function (uischema) {
    var control = uischema;
    if (control.scope === undefined || control.scope === null) {
        return false;
    }
    return !(control.scope.$ref === undefined || control.scope.$ref === null);
}));
var isNotTuple = function (schema) { return !Array.isArray(schema.items); };
var TreeMasterDetail = /** @class */ (function (_super) {
    __extends(TreeMasterDetail, _super);
    function TreeMasterDetail() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TreeMasterDetail.prototype.componentWillMount = function () {
        var _a = this.props, uischema = _a.uischema, data = _a.data, resolvedSchema = _a.resolvedSchema;
        var controlElement = uischema;
        if (_.isArray(data)) {
            var dataPathSegments = path_util_1.toDataPathSegments(controlElement.scope.$ref);
            var path = _.isEmpty(dataPathSegments) ? '' : dataPathSegments.join('.');
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
                    data: data,
                    path: ''
                }
            });
        }
    };
    TreeMasterDetail.prototype.render = function () {
        var _this = this;
        var _a = this.props, uischema = _a.uischema, resolvedSchema = _a.resolvedSchema, visible = _a.visible;
        var controlElement = uischema;
        var rootData = this.props.data;
        return (JSX_1.JSX.createElement("div", { hidden: !visible, className: 'jsf-treeMasterDetail' },
            JSX_1.JSX.createElement("div", { className: 'jsf-treeMasterDetail-header' },
                JSX_1.JSX.createElement("label", null, typeof controlElement.label === 'string' ? controlElement.label : ''),
                Array.isArray(rootData) &&
                    JSX_1.JSX.createElement("button", { className: 'jsf-treeMasterDetail-add', onClick: function () {
                            _this.addToRoot();
                        } }, "Add to root")),
            JSX_1.JSX.createElement("div", { className: 'jsf-treeMasterDetail-content' },
                JSX_1.JSX.createElement("div", { className: 'jsf-treeMasterDetail-master' }, this.renderMaster(resolvedSchema)),
                JSX_1.JSX.createElement("div", { className: 'jsf-treeMasterDetail-detail' }, this.state.selected ?
                    JSX_1.JSX.createElement(dispatch_renderer_1.default, { schema: this.state.selected.schema, path: this.state.selected.path, uischema: ui_schema_gen_1.generateDefaultUISchema(this.state.selected.schema) }) : 'Select an item')),
            JSX_1.JSX.createElement("div", null,
                JSX_1.JSX.createElement("dialog", { id: 'dialog' },
                    JSX_1.JSX.createElement("label", null, "Select item to create"),
                    JSX_1.JSX.createElement("div", { id: 'dialog-content-container', className: 'content' }),
                    JSX_1.JSX.createElement("button", { className: 'jsf-treeMasterDetail-dialog-close', onClick: function () {
                            _this.closeDialog();
                        } }, "Close")))));
    };
    // create dialog on demand
    // open dialog
    TreeMasterDetail.prototype.openDialog = function (ev, schema, parentPath) {
        var dispatch = this.props.dispatch;
        ev.stopPropagation();
        var dialog = document.getElementById('dialog');
        var vnodeContent = JSX_1.JSX.createElement("div", { className: 'dialog-content' }, core_1.JsonForms.schemaService.getContainmentProperties(schema)
            .map(function (prop) {
            return JSX_1.JSX.createElement("button", { className: core_1.JsonForms.stylingRegistry.get('button'), onClick: function () {
                    var newData = _.keys(prop.schema.properties).reduce(function (d, key) {
                        if (prop.schema.properties[key].default) {
                            d[key] = prop.schema.properties[key].default;
                        }
                        return d;
                    }, {});
                    // prop.addToData(data)(newData);
                    dispatch(actions_1.update(path_util_1.compose(parentPath, prop.property), function (array) {
                        if (_.isEmpty(array)) {
                            return [newData];
                        }
                        array.push(newData);
                        return array;
                    }));
                    dialog.close();
                } }, prop.label);
        }));
        // TODO
        inferno_1.default.render(vnodeContent, document.getElementById('dialog-content-container'));
        dialog.showModal();
    };
    TreeMasterDetail.prototype.closeDialog = function () {
        var dialog = document.getElementById('dialog');
        dialog.close();
    };
    TreeMasterDetail.prototype.addToRoot = function () {
        var _a = this.props, schema = _a.schema, dispatch = _a.dispatch, path = _a.path;
        if (isNotTuple(schema)) {
            dispatch(actions_1.update(path, function (data) {
                var clone = data.slice();
                clone.push({});
                return clone;
            }));
        }
    };
    TreeMasterDetail.prototype.renderMaster = function (schema) {
        // TODO: so far no drag and drop support
        if (schema.items !== undefined) {
            return (JSX_1.JSX.createElement("ul", null, this.expandRootArray(schema.items)));
        }
        else {
            return (JSX_1.JSX.createElement("ul", null, this.expandObject(this.props.path, schema, null)));
        }
    };
    /**
     * Expands the given array of root elements by expanding every element.
     * It is assumed that the roor elements do not support drag and drop.
     * Based on this, a delete function is created for every element.
     *
     * @param data the array to expand
     * @param schema the {@link JsonSchema} defining the elements' type
     */
    TreeMasterDetail.prototype.expandRootArray = function (schema) {
        var _this = this;
        var _a = this.props, dispatch = _a.dispatch, path = _a.path;
        var data = this.props.data;
        if (data === undefined || data === null) {
            return;
        }
        return data.map(function (element, index) {
            var composedPath = path_util_1.compose(path, index + '');
            return _this.expandObject(composedPath, schema, function () { return dispatch(actions_1.update(path, function (d) {
                var clone = d.slice();
                clone.splice(index, 1);
                return clone;
            })); });
        });
    };
    /**
     * Expands the given data array by expanding every element.
     * If the parent data containing the array is provided,
     * a suitable delete function for the expanded elements is created.
     *
     * @param data the array to expand
     * @param property the {@link ContainmentProperty} defining the property that the array belongs to
     * @param parentData the data containing the array as a property
     */
    TreeMasterDetail.prototype.expandArray = function (data, property, path, parentData) {
        var _this = this;
        if (data === undefined || data === null) {
            return;
        }
        return data.map(function (element, index) {
            var deleteFunction = null;
            if (!_.isEmpty(parentData)) {
                deleteFunction = function (d) {
                    property.deleteFromData(parentData)(d);
                    return parentData;
                };
            }
            var composedPath = path_util_1.compose(path, index.toString() + '');
            return _this.expandObject(composedPath, property.schema, deleteFunction);
        });
    };
    TreeMasterDetail.prototype.getNamingFunction = function (schema) {
        var uischema = this.props.uischema;
        if (uischema.options !== undefined) {
            var labelProvider_1 = uischema.options.labelProvider;
            if (labelProvider_1 !== undefined && labelProvider_1[schema.id] !== undefined) {
                return function (element) {
                    return element[labelProvider_1[schema.id]];
                };
            }
        }
        var namingKeys = Object.keys(schema.properties).filter(function (key) { return key === 'id' || key === 'name'; });
        if (namingKeys.length !== 0) {
            return function (element) { return element[namingKeys[0]]; };
        }
        return function (obj) { return JSON.stringify(obj); };
    };
    /**
     * Renders a data object as a <li> child element of the given <ul> list.
     *
     * @param data The rendered data
     * @param schema The schema describing the rendered data's type
     * @param deleteFunction A function to delete the data from the model
     */
    TreeMasterDetail.prototype.expandObject = function (scopedPath, schema, deleteFunction) {
        var _this = this;
        var _a = this.props, uischema = _a.uischema, rootData = _a.rootData;
        var data = path_util_1.resolveData(rootData, scopedPath);
        var liClasses = this.state.selected === data ? 'selected' : '';
        var vnode = (JSX_1.JSX.createElement("li", { className: liClasses },
            JSX_1.JSX.createElement("div", null,
                _.has(uischema.options, 'imageProvider') ?
                    JSX_1.JSX.createElement("span", { className: "icon " + uischema.options.imageProvider[schema.id] }) : '',
                JSX_1.JSX.createElement("span", { className: 'label', onClick: function (ev) {
                        _this.setState({
                            selected: {
                                schema: schema,
                                data: data,
                                path: scopedPath
                            }
                        });
                    } },
                    JSX_1.JSX.createElement("span", null, this.getNamingFunction(schema)(data)),
                    core_1.JsonForms.schemaService.hasContainmentProperties(schema) ?
                        (JSX_1.JSX.createElement("span", { className: 'add', onClick: function (ev) {
                                _this.openDialog(ev, schema, scopedPath);
                            } }, '\u2795')) : '',
                    deleteFunction !== null &&
                        JSX_1.JSX.createElement("span", { className: 'remove', onClick: function () {
                                deleteFunction();
                            } }, '\u274C'))),
            // render contained children of this element
            core_1.JsonForms.schemaService.getContainmentProperties(schema)
                .filter(function (prop) { return _this.propHasData(prop, data); })
                .map(function (prop) { return JSX_1.JSX.createElement("ul", null, _this.renderChildren(prop, scopedPath, schema, data)); })));
        // add a separate list for each containment property
        core_1.JsonForms.schemaService.getContainmentProperties(schema).forEach(function (p) {
            var id = p.schema.id;
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
    };
    TreeMasterDetail.prototype.propHasData = function (prop, data) {
        var uischema = this.props.uischema;
        var sid = prop.schema.id;
        if (sid === undefined || sid === null) {
            // TODO proper logging
            console.warn('The property\'s schema with label \'' + prop.label
                + '\' has no id. No Drag & Drop is possible.');
        }
        var propertyData = prop.getData(data);
        /*tslint:disable:no-string-literal */
        if (uischema.options !== undefined &&
            uischema.options['modelMapping'] !== undefined
            && !_.isEmpty(propertyData)) {
            propertyData = propertyData.filter(function (value) {
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
    };
    // TODO: update selected element once selection has been changed
    TreeMasterDetail.prototype.renderChildren = function (prop, parentPath, parentSchema, parentData) {
        var composedPath = path_util_1.compose(parentPath, prop.property);
        var data = path_util_1.resolveData(this.props.data, composedPath);
        var schema = prop.schema;
        var array = data;
        var key = prop.property;
        var parentProperties = core_1.JsonForms.schemaService.getContainmentProperties(parentSchema);
        for (var _i = 0, parentProperties_1 = parentProperties; _i < parentProperties_1.length; _i++) {
            var property = parentProperties_1[_i];
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
    };
    return TreeMasterDetail;
}(renderer_1.Renderer));
exports.TreeMasterDetail = TreeMasterDetail;
var mapStateToProps = function (state, ownProps) {
    var path = path_util_1.compose(ownProps.path, path_util_1.toDataPathSegments(ownProps.uischema.scope.$ref).join('.'));
    var visible = _.has(ownProps, 'visible') ? ownProps.visible : renderer_1.isVisible(ownProps, state);
    var enabled = _.has(ownProps, 'enabled') ? ownProps.enabled : renderer_1.isEnabled(ownProps, state);
    return {
        rootData: index_1.getData(state),
        data: path_util_1.resolveData(index_1.getData(state), path),
        uischema: ownProps.uischema,
        schema: ownProps.schema,
        resolvedSchema: path_util_1.resolveSchema(ownProps.schema, ownProps.uischema.scope.$ref),
        path: path,
        visible: visible,
        enabled: enabled
    };
};
exports.default = renderer_util_1.registerStartupRenderer(exports.treeMasterDetailTester, inferno_redux_1.connect(mapStateToProps)(TreeMasterDetail));
//# sourceMappingURL=tree-renderer.js.map