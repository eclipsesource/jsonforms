"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("../../core");
__export(require("./materialized.boolean.control"));
__export(require("./materialized.date.control"));
__export(require("./materialized.time.control"));
__export(require("./materialized.enum.control"));
__export(require("./materialized.integer.control"));
__export(require("./materialized.number.control"));
__export(require("./materialized.text.control"));
__export(require("./materialized.textarea.control"));
exports.materialize = function () {
    core_1.JsonForms.stylingRegistry.registerMany([
        {
            name: 'button',
            classNames: ['btn', 'waves-effect', 'waves-light']
        },
        {
            name: 'control',
            classNames: ['input-field']
        },
        {
            name: 'control.label',
            classNames: ['active']
        },
        {
            name: 'array.button',
            classNames: ['btn-floating', 'waves-effect', 'waves-light', 'array-button']
        },
        {
            name: 'array.layout',
            classNames: ['z-depth-3']
        },
        {
            name: 'group.layout',
            classNames: ['z-depth-3']
        },
        {
            name: 'group.label',
            classNames: ['group.label']
        },
        {
            name: 'collection',
            classNames: ['collection']
        },
        {
            name: 'item',
            classNames: ['collection-item']
        },
        // {
        //   name: 'item-active',
        //   classNames: ['active']
        // },
        {
            name: 'horizontal-layout',
            classNames: ['row']
        },
        {
            name: 'array.children',
            classNames: ['row']
        },
        {
            name: 'categorization',
            classNames: ['jsf-categorization']
        },
        {
            name: 'categorization.master',
            classNames: ['jsf-categorization-master']
        },
        {
            name: 'categorization.detail',
            classNames: ['jsf-categorization-detail']
        },
        {
            name: 'category.group',
            classNames: ['jsf-category-group']
        },
    ]);
    var calcClasses = function (childrenSize) {
        var colSize = Math.floor(12 / childrenSize[0]);
        return ['col', "s" + colSize];
    };
    core_1.JsonForms.stylingRegistry.register({
        name: 'horizontal-layout-item',
        classNames: calcClasses
    });
    core_1.JsonForms.stylingRegistry.register({
        name: 'array.item',
        classNames: calcClasses
    });
    core_1.JsonForms.stylingRegistry.register({
        name: 'vertical-layout-item',
        classNames: ['vertical-layout-item']
    });
    core_1.JsonForms.stylingRegistry.deregister('select');
};
//# sourceMappingURL=index.js.map