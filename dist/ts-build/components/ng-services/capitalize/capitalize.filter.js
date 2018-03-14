"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = angular
    .module('jsonforms.filters.capitalize', [])
    .filter('capitalize', function () {
    return function (input) { return _.capitalize(input); };
}).name;
//# sourceMappingURL=capitalize.filter.js.map