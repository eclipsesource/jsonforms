"use strict";
var services_1 = require('../services');
var uischema_1 = require('../../../uischema');
var path_resolver_1 = require('../path-resolver/path-resolver');
var RuleService = (function () {
    function RuleService() {
        this.map = {};
    }
    RuleService.prototype.getId = function () {
        return services_1.ServiceId.RuleService;
    };
    RuleService.prototype.reevaluateRules = function (schemaPath) {
        if (!(schemaPath in this.map)) {
            return;
        }
        var renderDescriptionArray = this.map[schemaPath];
        for (var i = 0; i < renderDescriptionArray.length; i++) {
            var renderDescription = renderDescriptionArray[i];
            var conditionValue = null;
            try {
                conditionValue = path_resolver_1.PathResolver.resolveInstance(renderDescription.instance, schemaPath);
            }
            catch (e) {
            }
            var valueMatch = (renderDescription.rule.condition.expectedValue === conditionValue);
            var effect = renderDescription.rule.effect;
            renderDescription.hide = (effect === uischema_1.RuleEffect.HIDE && valueMatch)
                || (effect === uischema_1.RuleEffect.SHOW && !valueMatch);
        }
    };
    ;
    RuleService.prototype.addRuleTrack = function (renderDescription) {
        if (renderDescription.rule === undefined) {
            return;
        }
        var path = renderDescription.rule.condition['scope'].$ref;
        if (!(path in this.map)) {
            this.map[path] = [];
        }
        this.map[path].push(renderDescription);
        this.reevaluateRules(path);
    };
    return RuleService;
}());
exports.RuleService = RuleService;
//# sourceMappingURL=rule-service.js.map