"use strict";
var services_1 = require('../services');
var DataProviders = (function () {
    function DataProviders() {
    }
    DataProviders.canPage = function (provider) {
        return provider.canPage;
    };
    DataProviders.canFilter = function (provider) {
        return provider.canFilter;
    };
    return DataProviders;
}());
exports.DataProviders = DataProviders;
var DefaultDataProvider = (function () {
    function DefaultDataProvider($q, data) {
        var _this = this;
        this.$q = $q;
        this.canPage = true;
        this.canFilter = false;
        this._page = 0;
        this._pageSize = 2;
        this.setPageSize = function (newPageSize) {
            _this._pageSize = newPageSize;
        };
        this._data = data;
    }
    DefaultDataProvider.prototype.getId = function () {
        return services_1.ServiceId.DataProvider;
    };
    DefaultDataProvider.prototype.getData = function () {
        return this._data;
    };
    DefaultDataProvider.prototype.fetchData = function () {
        var p = this.$q.defer();
        p.resolve(this._data);
        return p.promise;
    };
    DefaultDataProvider.prototype.fetchPage = function (page) {
        this._page = page;
        var p = this.$q.defer();
        if (this._data instanceof Array) {
            p.resolve(this._data.slice(this._page * this._pageSize, this._page * this._pageSize + this._pageSize));
        }
        else {
            p.resolve(this._data);
        }
        return p.promise;
    };
    DefaultDataProvider.prototype.getTotalItems = function () {
        return this._data.length;
    };
    return DefaultDataProvider;
}());
exports.DefaultDataProvider = DefaultDataProvider;
var DefaultInternalDataProvider = (function () {
    function DefaultInternalDataProvider(data) {
        this._data = data;
    }
    Object.defineProperty(DefaultInternalDataProvider.prototype, "canPage", {
        get: function () { return false; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DefaultInternalDataProvider.prototype, "canFilter", {
        get: function () { return false; },
        enumerable: true,
        configurable: true
    });
    DefaultInternalDataProvider.prototype.getId = function () {
        return services_1.ServiceId.DataProvider;
    };
    DefaultInternalDataProvider.prototype.getData = function () {
        return this._data;
    };
    DefaultInternalDataProvider.prototype.fetchData = function () {
        return undefined;
    };
    DefaultInternalDataProvider.prototype.getTotalItems = function () {
        return this._data.length;
    };
    return DefaultInternalDataProvider;
}());
exports.DefaultInternalDataProvider = DefaultInternalDataProvider;
//# sourceMappingURL=default-data-providers.js.map