"use strict";
var services_1 = require('../../services/services');
var AbstractLayout = (function () {
    function AbstractLayout(scope) {
        this.scope = scope;
        var services = scope['services'];
        this.uiSchema = scope['uischema'];
        this.instance = services.get(services_1.ServiceId.DataProvider).getData();
        this.rule = this.uiSchema.rule;
        services.get(services_1.ServiceId.RuleService).addRuleTrack(this);
    }
    return AbstractLayout;
}());
exports.AbstractLayout = AbstractLayout;
//# sourceMappingURL=abstract-layout.js.map