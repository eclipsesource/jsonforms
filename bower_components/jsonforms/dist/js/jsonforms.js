/*! jsonforms - v0.0.14 - 2016-01-28 Copyright (c) EclipseSource Muenchen GmbH and others. */ 
'use strict';
// Source: temp/services.js
/*! jsonforms - v0.0.14 - 2016-01-28 Copyright (c) EclipseSource Muenchen GmbH and others. */ 
// Source: components/services/data/data-service.js
///<reference path="../../references.ts"/>
//# sourceMappingURL=data-service.js.map
// Source: components/services/data/data-services.js
///<reference path="../../references.ts"/>
var JSONForms;
(function (JSONForms) {
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
    })();
    JSONForms.DataProviders = DataProviders;
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
            this.fetchPage = function (page) {
                _this._page = page;
                var p = _this.$q.defer();
                if (_this._data instanceof Array) {
                    p.resolve(_this._data.slice(_this._page * _this._pageSize, _this._page * _this._pageSize + _this._pageSize));
                }
                else {
                    p.resolve(_this._data);
                }
                return p.promise;
            };
            this._data = data;
        }
        DefaultDataProvider.prototype.getId = function () {
            return JSONForms.ServiceId.DataProvider;
        };
        DefaultDataProvider.prototype.getData = function () {
            return this._data;
        };
        DefaultDataProvider.prototype.fetchData = function () {
            var p = this.$q.defer();
            p.resolve(this._data);
            return p.promise;
        };
        DefaultDataProvider.prototype.getTotalItems = function () {
            return this._data.length;
        };
        return DefaultDataProvider;
    })();
    JSONForms.DefaultDataProvider = DefaultDataProvider;
    var DefaultInternalDataProvider = (function () {
        function DefaultInternalDataProvider(data) {
            this._data = data;
        }
        Object.defineProperty(DefaultInternalDataProvider.prototype, "canPage", {
            get: function () { return false; },
            enumerable: true,
            configurable: true
        });
        ;
        Object.defineProperty(DefaultInternalDataProvider.prototype, "canFilter", {
            get: function () { return false; },
            enumerable: true,
            configurable: true
        });
        ;
        DefaultInternalDataProvider.prototype.getId = function () {
            return JSONForms.ServiceId.DataProvider;
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
    })();
    JSONForms.DefaultInternalDataProvider = DefaultInternalDataProvider;
})(JSONForms || (JSONForms = {}));
//# sourceMappingURL=data-services.js.map
// Source: components/services/pathresolver/jsonforms-pathresolver.js
///<reference path="../../references.ts"/>
var JSONForms;
(function (JSONForms) {
    var PathResolver = (function () {
        function PathResolver() {
            var _this = this;
            this.pathMapping = {};
            this.toInstancePath = function (path) {
                return JSONForms.PathUtil.normalize(path);
            };
            this.resolveUi = function (instance, uiPath) {
                var p = uiPath + "/scope/$ref";
                if (_this.pathMapping !== undefined && _this.pathMapping.hasOwnProperty(p)) {
                    p = _this.pathMapping[p];
                }
                return _this.resolveInstance(instance, p);
            };
            this.resolveInstance = function (instance, schemaPath) {
                var fragments = JSONForms.PathUtil.toPropertyFragments(_this.toInstancePath(schemaPath));
                return fragments.reduce(function (currObj, fragment) {
                    if (currObj instanceof Array) {
                        return currObj.map(function (item) {
                            return item[fragment];
                        });
                    }
                    return currObj[fragment];
                }, instance);
            };
            this.resolveSchema = function (schema, path) {
                try {
                    var fragments = JSONForms.PathUtil.toPropertyFragments(path);
                    return fragments.reduce(function (subSchema, fragment) {
                        if (fragment == "#") {
                            return subSchema;
                        }
                        else if (subSchema instanceof Array) {
                            return subSchema.map(function (item) {
                                return item[fragment];
                            });
                        }
                        return subSchema[fragment];
                    }, schema);
                }
                catch (err) {
                    return undefined;
                }
            };
        }
        return PathResolver;
    })();
    JSONForms.PathResolver = PathResolver;
})(JSONForms || (JSONForms = {}));
//# sourceMappingURL=jsonforms-pathresolver.js.map
// Source: components/services/pathutil.js
///<reference path="../references.ts"/>
var JSONForms;
(function (JSONForms) {
    var PathUtil = (function () {
        function PathUtil() {
        }
        PathUtil.inits = function (schemaPath) {
            var fragments = PathUtil.toPropertyFragments(schemaPath);
            return '/' + fragments.slice(0, fragments.length - 1).join('/');
        };
        PathUtil.beautifiedLastFragment = function (schemaPath) {
            return PathUtil.beautify(PathUtil.capitalizeFirstLetter(PathUtil.lastFragment(schemaPath)));
        };
        PathUtil.lastFragment = function (schemaPath) {
            return schemaPath.substr(schemaPath.lastIndexOf('/') + 1, schemaPath.length);
        };
        PathUtil.capitalizeFirstLetter = function (string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        };
        PathUtil.Keywords = ["items", "properties", "#"];
        PathUtil.normalize = function (path) {
            return PathUtil.filterNonKeywords(PathUtil.toPropertyFragments(path)).join("/");
        };
        PathUtil.toPropertyFragments = function (path) {
            return path.split('/').filter(function (fragment) {
                return fragment.length > 0;
            });
        };
        PathUtil.filterNonKeywords = function (fragments) {
            return fragments.filter(function (fragment) {
                return !(PathUtil.Keywords.indexOf(fragment) !== -1);
            });
        };
        PathUtil.beautify = function (text) {
            if (text && text.length > 0) {
                var textArray = text.split(/(?=[A-Z])/).map(function (x) { return x.toLowerCase(); });
                textArray[0] = textArray[0].charAt(0).toUpperCase() + textArray[0].slice(1);
                return textArray.join(' ');
            }
            return text;
        };
        return PathUtil;
    })();
    JSONForms.PathUtil = PathUtil;
})(JSONForms || (JSONForms = {}));
//# sourceMappingURL=pathutil.js.map
// Source: components/services/rule/rule-service.js
///<reference path="../../references.ts"/>
var JSONForms;
(function (JSONForms) {
    var RuleService = (function () {
        function RuleService(pathresolver) {
            this.pathresolver = pathresolver;
            this.map = {};
        }
        RuleService.prototype.getId = function () {
            return JSONForms.ServiceId.RuleService;
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
                    conditionValue = this.pathresolver.resolveInstance(renderDescription.instance, schemaPath);
                }
                catch (e) {
                }
                var valueMatch = (renderDescription.rule.condition.expectedValue === conditionValue);
                var effect = renderDescription.rule.effect;
                var hide = false;
                hide = (effect === "HIDE" && valueMatch) || (effect === "SHOW" && !valueMatch);
                renderDescription.hide = hide;
            }
        };
        ;
        RuleService.prototype.addRuleTrack = function (renderDescription) {
            if (renderDescription.rule == undefined)
                return;
            var path = renderDescription.rule.condition['scope'].$ref;
            if (!(path in this.map)) {
                this.map[path] = [];
            }
            this.map[path].push(renderDescription);
            this.reevaluateRules(path);
        };
        return RuleService;
    })();
    JSONForms.RuleService = RuleService;
})(JSONForms || (JSONForms = {}));
//# sourceMappingURL=rule-service.js.map
// Source: components/services/services.js
///<reference path="../references.ts"/>
var JSONForms;
(function (JSONForms) {
    var HashTable = (function () {
        function HashTable() {
            this.hashes = {};
        }
        HashTable.prototype.put = function (key, value) {
            this.hashes[JSON.stringify(key)] = value;
        };
        HashTable.prototype.get = function (key) {
            return this.hashes[JSON.stringify(key)];
        };
        return HashTable;
    })();
    var Services = (function () {
        function Services() {
            this.services = {};
        }
        Services.prototype.add = function (service) {
            this.services[service.getId()] = service;
        };
        Services.prototype.get = function (serviceId) {
            return this.services[serviceId];
        };
        return Services;
    })();
    JSONForms.Services = Services;
    var ScopeProvider = (function () {
        function ScopeProvider(scope) {
            this.scope = scope;
        }
        ScopeProvider.prototype.getId = function () {
            return ServiceId.ScopeProvider;
        };
        ScopeProvider.prototype.getScope = function () {
            return this.scope;
        };
        return ScopeProvider;
    })();
    JSONForms.ScopeProvider = ScopeProvider;
    var PathResolverService = (function () {
        function PathResolverService(resolver) {
            this.resolver = resolver;
        }
        PathResolverService.prototype.getId = function () {
            return ServiceId.PathResolver;
        };
        PathResolverService.prototype.getResolver = function () {
            return this.resolver;
        };
        return PathResolverService;
    })();
    JSONForms.PathResolverService = PathResolverService;
    var SchemaProvider = (function () {
        function SchemaProvider(schema) {
            this.schema = schema;
        }
        SchemaProvider.prototype.getId = function () {
            return ServiceId.SchemaProvider;
        };
        SchemaProvider.prototype.getSchema = function () {
            return this.schema;
        };
        return SchemaProvider;
    })();
    JSONForms.SchemaProvider = SchemaProvider;
    var ValidationService = (function () {
        function ValidationService() {
            this.validationResults = new HashTable();
        }
        ValidationService.prototype.getId = function () {
            return ServiceId.Validation;
        };
        ValidationService.prototype.getResult = function (instance, dataPath) {
            if (this.validationResults.get(instance) == undefined) {
                return undefined;
            }
            else {
                return this.validationResults.get(instance)[dataPath];
            }
        };
        ValidationService.prototype.convertAllDates = function (instance) {
            for (var prop in instance) {
                if (instance.hasOwnProperty(prop)) {
                    if (instance[prop] instanceof Date) {
                        instance[prop] = instance[prop].toString();
                    }
                    else if (instance[prop] instanceof Object) {
                        this.convertAllDates(instance[prop]);
                    }
                }
            }
        };
        ValidationService.prototype.validate = function (instance, schema) {
            var _this = this;
            if (tv4 == undefined) {
                return;
            }
            this.clear(instance);
            this.convertAllDates(instance);
            var results = tv4.validateMultiple(instance, schema);
            results['errors'].forEach(function (error) {
                if (error['schemaPath'].indexOf("required") != -1) {
                    var propName = error['dataPath'] + "/" + error['params']['key'];
                    _this.validationResults.get(instance)[propName] = "Missing property";
                }
                else {
                    _this.validationResults.get(instance)[error['dataPath']] = error['message'];
                }
            });
        };
        ValidationService.prototype.clear = function (instance) { this.validationResults.put(instance, {}); };
        return ValidationService;
    })();
    JSONForms.ValidationService = ValidationService;
    (function (ServiceId) {
        ServiceId[ServiceId["Validation"] = 0] = "Validation";
        ServiceId[ServiceId["DataProvider"] = 1] = "DataProvider";
        ServiceId[ServiceId["SchemaProvider"] = 2] = "SchemaProvider";
        ServiceId[ServiceId["ScopeProvider"] = 3] = "ScopeProvider";
        ServiceId[ServiceId["RuleService"] = 4] = "RuleService";
        ServiceId[ServiceId["PathResolver"] = 5] = "PathResolver";
    })(JSONForms.ServiceId || (JSONForms.ServiceId = {}));
    var ServiceId = JSONForms.ServiceId;
})(JSONForms || (JSONForms = {}));
//# sourceMappingURL=services.js.map
// Source: temp/jsonforms-module.js
/*! jsonforms - v0.0.14 - 2016-01-28 Copyright (c) EclipseSource Muenchen GmbH and others. */ 
// Source: components/generators/schema/jsonforms-schemagenerator.js
///<reference path="../../references.ts"/>
var JSONForms;
(function (JSONForms) {
    var SchemaGenerator = (function () {
        function SchemaGenerator() {
            var _this = this;
            this.generateDefaultSchema = function (instance) {
                return _this.schemaObject(instance, _this.allowAdditionalProperties, _this.requiredProperties);
            };
            this.generateDefaultSchemaWithOptions = function (instance, allowAdditionalProperties, requiredProperties) {
                return _this.schemaObject(instance, allowAdditionalProperties, requiredProperties);
            };
            this.schemaObject = function (instance, allowAdditionalProperties, requiredProperties) {
                var properties = _this.properties(instance, allowAdditionalProperties, requiredProperties);
                return {
                    "type": "object",
                    "properties": properties,
                    "additionalProperties": allowAdditionalProperties(properties),
                    "required": requiredProperties(_this.keys(properties))
                };
            };
            this.properties = function (instance, allowAdditionalProperties, requiredProperties) {
                var properties = {};
                var generator = _this;
                _this.keys(instance).forEach(function (property) {
                    properties[property] = generator.property(instance[property], allowAdditionalProperties, requiredProperties);
                });
                return properties;
            };
            this.keys = function (properties) {
                return Object.keys(properties);
            };
            this.property = function (instance, allowAdditionalProperties, requiredProperties) {
                switch (typeof instance) {
                    case "string":
                    case "boolean":
                        return { "type": typeof instance };
                    case "number":
                        if (Number(instance) % 1 === 0) {
                            return { "type": "integer" };
                        }
                        else {
                            return { "type": "number" };
                        }
                    case "object":
                        return _this.schemaObjectOrNullOrArray(instance, allowAdditionalProperties, requiredProperties);
                    default:
                        return {};
                }
            };
            this.schemaObjectOrNullOrArray = function (instance, allowAdditionalProperties, requiredProperties) {
                if (_this.isNotNull(instance)) {
                    if (_this.isArray(instance)) {
                        return _this.schemaArray(instance, allowAdditionalProperties, requiredProperties);
                    }
                    else {
                        return _this.schemaObject(instance, allowAdditionalProperties, requiredProperties);
                    }
                }
                else {
                    return { "type": "null" };
                }
            };
            this.schemaArray = function (instance, allowAdditionalProperties, requiredProperties) {
                if (instance.length) {
                    var generator = _this;
                    var allProperties = instance.map(function (object) {
                        return generator.property(object, allowAdditionalProperties, requiredProperties);
                    });
                    var uniqueProperties = _this.distinct(allProperties, function (object) { return JSON.stringify(object); });
                    if (uniqueProperties.length == 1) {
                        return {
                            "type": "array",
                            "items": uniqueProperties[0]
                        };
                    }
                    else {
                        return {
                            "type": "array",
                            "items": {
                                "oneOf": uniqueProperties
                            }
                        };
                    }
                }
            };
            this.isArray = function (instance) {
                return Object.prototype.toString.call(instance) === '[object Array]';
            };
            this.isNotNull = function (instance) {
                return (typeof (instance) !== 'undefined') && (instance !== null);
            };
            this.distinct = function (array, discriminator) {
                var known = {};
                return array.filter(function (item) {
                    var discriminatorValue = discriminator(item);
                    if (known.hasOwnProperty(discriminatorValue)) {
                        return false;
                    }
                    else {
                        return (known[discriminatorValue] = true);
                    }
                });
            };
            this.requiredProperties = function (properties) {
                return properties;
            };
            this.allowAdditionalProperties = function (properties) {
                return true;
            };
        }
        return SchemaGenerator;
    })();
    JSONForms.SchemaGenerator = SchemaGenerator;
})(JSONForms || (JSONForms = {}));
//# sourceMappingURL=jsonforms-schemagenerator.js.map
// Source: components/generators/uischema/jsonforms-uischemagenerator.js
///<reference path="../../references.ts"/>
var JSONForms;
(function (JSONForms) {
    var UISchemaGenerator = (function () {
        function UISchemaGenerator() {
            var _this = this;
            this.generateDefaultUISchema = function (jsonSchema) {
                var uiSchemaElements = [];
                _this.generateUISchema(jsonSchema, uiSchemaElements, "#", "");
                return uiSchemaElements[0];
            };
            this.generateUISchema = function (jsonSchema, schemaElements, currentRef, schemaName) {
                var type = _this.deriveType(jsonSchema);
                switch (type) {
                    case "object":
                        var verticalLayout = {
                            type: "VerticalLayout",
                            elements: []
                        };
                        schemaElements.push(verticalLayout);
                        if (schemaName && schemaName !== "") {
                            var label = {
                                type: "Label",
                                text: JSONForms.PathUtil.beautify(schemaName)
                            };
                            verticalLayout.elements.push(label);
                        }
                        if (!jsonSchema.properties) {
                            return;
                        }
                        var nextRef = currentRef + '/' + "properties";
                        for (var property in jsonSchema.properties) {
                            if (_this.isIgnoredProperty(property, jsonSchema.properties[property])) {
                                continue;
                            }
                            _this.generateUISchema(jsonSchema.properties[property], verticalLayout.elements, nextRef + "/" + property, property);
                        }
                        break;
                    case "array":
                        var horizontalLayout = {
                            type: "HorizontalLayout",
                            elements: []
                        };
                        schemaElements.push(horizontalLayout);
                        var nextRef = currentRef + '/' + "items";
                        if (!jsonSchema.items) {
                            return;
                        }
                        if (jsonSchema.items instanceof Array) {
                            for (var i = 0; i < jsonSchema.items.length; i++) {
                                _this.generateUISchema(jsonSchema.items[i], horizontalLayout.elements, nextRef + '[' + i + ']', "");
                            }
                        }
                        else {
                            _this.generateUISchema(jsonSchema.items, horizontalLayout.elements, nextRef, "");
                        }
                        break;
                    case "string":
                    case "number":
                    case "integer":
                    case "boolean":
                        var controlObject = _this.getControlObject(JSONForms.PathUtil.beautify(schemaName), currentRef);
                        schemaElements.push(controlObject);
                        break;
                    case "null":
                        break;
                    default:
                        throw new Error("Unknown type: " + JSON.stringify(jsonSchema));
                }
            };
            this.isIgnoredProperty = function (propertyKey, propertyValue) {
                return propertyKey === "id" && typeof propertyValue === "string";
            };
            this.deriveType = function (jsonSchema) {
                if (jsonSchema.type) {
                    return jsonSchema.type;
                }
                if (jsonSchema.properties || jsonSchema.additionalProperties) {
                    return "object";
                }
                return "null";
            };
            this.getControlObject = function (label, ref) {
                return {
                    type: "Control",
                    label: label,
                    scope: {
                        $ref: ref
                    }
                };
            };
        }
        return UISchemaGenerator;
    })();
    JSONForms.UISchemaGenerator = UISchemaGenerator;
})(JSONForms || (JSONForms = {}));
//# sourceMappingURL=jsonforms-uischemagenerator.js.map
// Source: components/renderers/jsonforms-renderers.js
///<reference path="../references.ts"/>
var JSONForms;
(function (JSONForms) {
    var RenderService = (function () {
        function RenderService(refResolver) {
            var _this = this;
            this.refResolver = refResolver;
            this.renderers = [];
            this.register = function (renderer) {
                _this.renderers.push(renderer);
            };
        }
        RenderService.prototype.render = function (scope, element, services) {
            var foundRenderer;
            var schemaPath;
            var subSchema;
            var schema = services.get(JSONForms.ServiceId.SchemaProvider).getSchema();
            if (element['scope']) {
                schemaPath = element['scope']['$ref'];
                subSchema = this.refResolver.resolveSchema(schema, schemaPath);
            }
            for (var i = 0; i < this.renderers.length; i++) {
                if (this.renderers[i].isApplicable(element, subSchema, schemaPath)) {
                    if (foundRenderer == undefined || this.renderers[i].priority > foundRenderer.priority) {
                        foundRenderer = this.renderers[i];
                    }
                }
            }
            if (foundRenderer === undefined) {
                throw new Error("No applicable renderer found for element " + JSON.stringify(element));
            }
            var rendered = foundRenderer.render(element, schema, schemaPath, services);
            services.get(JSONForms.ServiceId.ScopeProvider).getScope().$broadcast('modelChanged');
            return rendered;
        };
        RenderService.$inject = ['PathResolver'];
        return RenderService;
    })();
    JSONForms.RenderService = RenderService;
    var RenderDescriptionFactory = (function () {
        function RenderDescriptionFactory() {
        }
        RenderDescriptionFactory.createControlDescription = function (schemaPath, services, element) {
            return new ControlRenderDescription(schemaPath, services, element);
        };
        RenderDescriptionFactory.renderElements = function (elements, renderService, services) {
            return elements.map(function (el) {
                return renderService.render(services.get(JSONForms.ServiceId.ScopeProvider).getScope(), el, services);
            });
        };
        RenderDescriptionFactory.createContainerDescription = function (size, elements, template, services, element) {
            return new ContainerRenderDescription(size, elements, template, services, element);
        };
        return RenderDescriptionFactory;
    })();
    JSONForms.RenderDescriptionFactory = RenderDescriptionFactory;
    var ContainerRenderDescription = (function () {
        function ContainerRenderDescription(size, elements, template, services, element) {
            this.type = "Layout";
            this.size = size;
            this.elements = elements;
            this.template = template;
            this.instance = services.get(JSONForms.ServiceId.DataProvider).getData();
            this.rule = element.rule;
            services.get(JSONForms.ServiceId.RuleService).addRuleTrack(this);
        }
        return ContainerRenderDescription;
    })();
    JSONForms.ContainerRenderDescription = ContainerRenderDescription;
    var ControlRenderDescription = (function () {
        function ControlRenderDescription(schemaPath, services, element) {
            this.schemaPath = schemaPath;
            this.type = "Control";
            this.size = 99;
            this.alerts = [];
            this.instance = services.get(JSONForms.ServiceId.DataProvider).getData();
            this.schema = services.get(JSONForms.ServiceId.SchemaProvider).getSchema();
            this.validationService = services.get(JSONForms.ServiceId.Validation);
            this.pathResolver = services.get(JSONForms.ServiceId.PathResolver).getResolver();
            this.ruleService = services.get(JSONForms.ServiceId.RuleService);
            this.scope = services.get(JSONForms.ServiceId.ScopeProvider).getScope();
            this.path = JSONForms.PathUtil.normalize(schemaPath);
            this.label = this.createLabel(schemaPath, element.label);
            this.readOnly = element.readOnly;
            this.rule = element.rule;
            this.ruleService.addRuleTrack(this);
            this.setupModelChangedCallback();
        }
        ControlRenderDescription.prototype.createLabel = function (schemaPath, label) {
            var stringBuilder = "";
            if (label) {
                stringBuilder += label;
            }
            else {
                stringBuilder += JSONForms.PathUtil.beautifiedLastFragment(schemaPath);
            }
            if (this.isRequired(schemaPath)) {
                stringBuilder += "*";
            }
            return stringBuilder;
        };
        ControlRenderDescription.prototype.isRequired = function (schemaPath) {
            var path = JSONForms.PathUtil.inits(schemaPath);
            var lastFragment = JSONForms.PathUtil.lastFragment(path);
            if (lastFragment === "properties") {
                path = JSONForms.PathUtil.inits(path);
            }
            var subSchema = this.pathResolver.resolveSchema(this.schema, path + "/required");
            if (subSchema !== undefined) {
                if (subSchema.indexOf(JSONForms.PathUtil.lastFragment(schemaPath)) != -1) {
                    return true;
                }
            }
            return false;
        };
        ControlRenderDescription.prototype.setupModelChangedCallback = function () {
            var _this = this;
            this.scope.$on('modelChanged', function () {
                _this.validate();
                _this.ruleService.reevaluateRules(_this.schemaPath);
            });
        };
        ControlRenderDescription.prototype.modelChanged = function () {
            this.scope.$broadcast('modelChanged');
            this.scope.$emit('modelChanged');
        };
        ControlRenderDescription.prototype.validate = function () {
            this.validationService.validate(this.instance, this.schema);
            var result = this.validationService.getResult(this.instance, '/' + this.path);
            this.alerts = [];
            if (result !== undefined) {
                var alert = {
                    type: 'danger',
                    msg: result
                };
                this.alerts.push(alert);
            }
        };
        return ControlRenderDescription;
    })();
    JSONForms.ControlRenderDescription = ControlRenderDescription;
})(JSONForms || (JSONForms = {}));
//# sourceMappingURL=jsonforms-renderers.js.map
// Source: components/services/pathresolver/jsonforms-pathresolver.js
///<reference path="../../references.ts"/>
var JSONForms;
(function (JSONForms) {
    var PathResolver = (function () {
        function PathResolver() {
            var _this = this;
            this.pathMapping = {};
            this.toInstancePath = function (path) {
                return JSONForms.PathUtil.normalize(path);
            };
            this.resolveUi = function (instance, uiPath) {
                var p = uiPath + "/scope/$ref";
                if (_this.pathMapping !== undefined && _this.pathMapping.hasOwnProperty(p)) {
                    p = _this.pathMapping[p];
                }
                return _this.resolveInstance(instance, p);
            };
            this.resolveInstance = function (instance, schemaPath) {
                var fragments = JSONForms.PathUtil.toPropertyFragments(_this.toInstancePath(schemaPath));
                return fragments.reduce(function (currObj, fragment) {
                    if (currObj instanceof Array) {
                        return currObj.map(function (item) {
                            return item[fragment];
                        });
                    }
                    return currObj[fragment];
                }, instance);
            };
            this.resolveSchema = function (schema, path) {
                try {
                    var fragments = JSONForms.PathUtil.toPropertyFragments(path);
                    return fragments.reduce(function (subSchema, fragment) {
                        if (fragment == "#") {
                            return subSchema;
                        }
                        else if (subSchema instanceof Array) {
                            return subSchema.map(function (item) {
                                return item[fragment];
                            });
                        }
                        return subSchema[fragment];
                    }, schema);
                }
                catch (err) {
                    return undefined;
                }
            };
        }
        return PathResolver;
    })();
    JSONForms.PathResolver = PathResolver;
})(JSONForms || (JSONForms = {}));
//# sourceMappingURL=jsonforms-pathresolver.js.map
// Source: temp/jsonforms.js
//====================================================================================================================
// Module:    jsonforms.generators
// Optimized: Yes
// File:      components/generators/generators.js
//====================================================================================================================

///<reference path="../references.ts"/>
//# sourceMappingURL=generators.js.map
angular.module ('jsonforms.generators', []);



//====================================================================================================================
// Module:    jsonforms.generators.schema
// Optimized: Yes
// File:      components/generators/schema/schema.js
//====================================================================================================================

(function (module) {

  ///<reference path="../../references.ts"/>
  //# sourceMappingURL=schema.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/generators/schema/schema-service.js
//--------------------------------------------------------------------------------------------------------------------

  ///<reference path="../../references.ts"/>
  module.service('SchemaGenerator', JSONForms.SchemaGenerator);
  //# sourceMappingURL=schema-service.js.map

}) (angular.module ('jsonforms.generators.schema', ['jsonforms.generators']));



//====================================================================================================================
// Module:    jsonforms.generators.uischema
// Optimized: Yes
// File:      components/generators/uischema/uischema.js
//====================================================================================================================

(function (module) {

  ///<reference path="../../references.ts"/>
  //# sourceMappingURL=uischema.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/generators/uischema/uischema-service.js
//--------------------------------------------------------------------------------------------------------------------

  ///<reference path="../../references.ts"/>
  module.service('UISchemaGenerator', JSONForms.UISchemaGenerator);
  //# sourceMappingURL=uischema-service.js.map

}) (angular.module ('jsonforms.generators.uischema', ['jsonforms.generators']));



//====================================================================================================================
// Module:    jsonforms.pathresolver
// Optimized: Yes
// File:      components/ng-services/pathresolver/pathresolver.js
//====================================================================================================================

(function (module) {

  ///<reference path="../../references.ts"/>
  //# sourceMappingURL=pathresolver.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/ng-services/pathresolver/pathresolver-service.js
//--------------------------------------------------------------------------------------------------------------------

  ///<reference path="../../references.ts"/>
  module.service('PathResolver', JSONForms.PathResolver);
  //# sourceMappingURL=pathresolver-service.js.map

}) (angular.module ('jsonforms.pathresolver', []));



//====================================================================================================================
// Module:    jsonforms.renderers
// Optimized: Yes
// File:      components/renderers/renderers.js
//====================================================================================================================

(function (module) {

  ///<reference path="../references.ts"/>
  //# sourceMappingURL=renderers.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/renderers-directive.js
//--------------------------------------------------------------------------------------------------------------------

  ///<reference path="../references.ts"/>
  var Widget = (function () {
      function Widget() {
          this.restrict = "E";
          this.replace = true;
          this.transclude = true;
          this.template = "<div class=\"col-sm-{{element.size}} jsf-label ng-transclude\"></div>";
      }
      return Widget;
  })();
  var DynamicWidget = (function () {
      function DynamicWidget($compile, $templateRequest) {
          var _this = this;
          this.$compile = $compile;
          this.$templateRequest = $templateRequest;
          this.restrict = 'E';
          this.scope = { element: "=" };
          this.replace = true;
          this.link = function (scope, element) {
              var fragments = scope.element.path !== undefined ? scope.element.path.split('/') : [];
              if (scope.element.templateUrl) {
                  _this.$templateRequest(scope.element.templateUrl).then(function (template) {
                      var updatedTemplate = _this.replaceJSONFormsAttributeInTemplate(template, fragments);
                      var compiledTemplate = _this.$compile(updatedTemplate)(scope);
                      element.replaceWith(compiledTemplate);
                  });
              }
              else {
                  var updatedTemplate = _this.replaceJSONFormsAttributeInTemplate(scope.element.template, fragments);
                  var template = _this.$compile(updatedTemplate)(scope);
                  element.replaceWith(template);
              }
          };
      }
      DynamicWidget.prototype.replaceJSONFormsAttributeInTemplate = function (template, fragments) {
          var path = [];
          for (var fragment in fragments) {
              path.push("['" + fragments[fragment] + "']");
          }
          var pathBinding = "ng-model=\"element.instance" + path.join('') + "\"";
          if (fragments.length > 0) {
              return template
                  .replace("data-jsonforms-model", pathBinding)
                  .replace("data-jsonforms-validation", "ng-change='element.modelChanged()'");
          }
          else {
              return template;
          }
      };
      return DynamicWidget;
  })();
  module
      .directive('jsonformsWidget', function () { return new Widget(); })
      .directive('jsonformsDynamicWidget', ['$compile', '$templateRequest',
      function ($compile, $templateRequest) {
          return new DynamicWidget($compile, $templateRequest);
      }
  ]);
  //# sourceMappingURL=renderers-directive.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/renderers-service.js
//--------------------------------------------------------------------------------------------------------------------

  ///<reference path="../references.ts"/>
  module.service('RenderService', JSONForms.RenderService);
  angular.module('jsonforms.renderers').service('RenderDescriptionFactory', JSONForms.RenderDescriptionFactory);
  //# sourceMappingURL=renderers-service.js.map

}) (angular.module ('jsonforms.renderers', ['jsonforms.generators', 'jsonforms.generators.schema', 'jsonforms.generators.uischema', 'jsonforms.pathresolver']));



//====================================================================================================================
// Module:    jsonforms.renderers.controls
// Optimized: Yes
// File:      components/renderers/controls/controls.js
//====================================================================================================================

(function (module) {

  ///<reference path="../../references.ts"/>
  //# sourceMappingURL=controls.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/controls/controls-directive.js
//--------------------------------------------------------------------------------------------------------------------

  ///<reference path="../../references.ts"/>
  var ControlDirective = (function () {
      function ControlDirective() {
          this.restrict = "E";
          this.replace = true;
          this.transclude = true;
          this.templateUrl = 'components/renderers/controls/control.html';
      }
      return ControlDirective;
  })();
  module.directive('jsonformsControl', function () { return new ControlDirective; });
  //# sourceMappingURL=controls-directive.js.map

}) (angular.module ('jsonforms.renderers.controls', ['jsonforms.renderers']));



//====================================================================================================================
// Module:    jsonforms.renderers.controls.array
// Optimized: Yes
// File:      components/renderers/controls/array/array.js
//====================================================================================================================

(function (module) {

  ///<reference path="../../../references.ts"/>
  //# sourceMappingURL=array.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/controls/array/array-renderer.js
//--------------------------------------------------------------------------------------------------------------------

  ///<reference path="../../../references.ts"/>
  var ArrayRenderer = (function () {
      function ArrayRenderer(pathResolver) {
          this.pathResolver = pathResolver;
          this.maxSize = 99;
          this.priority = 2;
      }
      ArrayRenderer.prototype.defaultGridOptions = function (existingOptions, services, schema) {
          var dataProvider = services.get(JSONForms.ServiceId.DataProvider);
          var validationService = services.get(JSONForms.ServiceId.Validation);
          var scope = services.get(JSONForms.ServiceId.ScopeProvider).getScope();
          var externalPaginationEnabled = existingOptions.hasOwnProperty('useExternalPagination');
          var externalFilteringEnabled = existingOptions.hasOwnProperty('useExternalFiltering');
          var defaultGridOptions = {};
          defaultGridOptions.enableColumnResizing = true;
          defaultGridOptions.enableHorizontalScrollbar = 0;
          defaultGridOptions.enableVerticalScrollbar = 0;
          defaultGridOptions.paginationPageSizes = [5, 10, 20];
          defaultGridOptions.paginationPageSize = 5;
          defaultGridOptions.paginationCurrentPage = 1;
          defaultGridOptions.enablePaginationControls = true;
          if (externalPaginationEnabled) {
              defaultGridOptions.useExternalPagination = true;
          }
          if (JSONForms.DataProviders.canPage(dataProvider)) {
              defaultGridOptions.totalItems = dataProvider.getTotalItems();
          }
          defaultGridOptions.onRegisterApi = function (gridApi) {
              if (JSONForms.DataProviders.canPage(dataProvider) && externalPaginationEnabled) {
                  gridApi.pagination.on.paginationChanged(scope, function (newPage, pageSize) {
                      defaultGridOptions.paginationCurrentPage = newPage;
                      defaultGridOptions.paginationPageSize = pageSize;
                      dataProvider.setPageSize(pageSize);
                      dataProvider.fetchPage(newPage).then(function (newData) {
                          existingOptions.data = newData;
                      });
                  });
              }
              if (JSONForms.DataProviders.canFilter(dataProvider) && externalFilteringEnabled) {
                  gridApi.core.on.filterChanged(scope, function () {
                      var columns = gridApi.grid.columns;
                      var terms = columns.reduce(function (acc, column) {
                          var value = column.filters[0].term;
                          if (value !== undefined && value.length > 0) {
                              acc[column.field] = ArrayRenderer.convertColumnValue(column.colDef, value);
                          }
                          return acc;
                      }, {});
                      dataProvider.filter(terms).then(function (newData) {
                          existingOptions.data = newData;
                      });
                  });
              }
              gridApi.edit.on.afterCellEdit(scope, function (rowEntity, colDef, newValue, oldValue) {
                  rowEntity[colDef.field] = ArrayRenderer.convertColumnValue(colDef, newValue);
                  validationService.validate(rowEntity, schema['items']);
                  gridApi.core.notifyDataChange("column");
                  scope.$apply();
              });
          };
          return this.mergeOptions(existingOptions, defaultGridOptions);
      };
      ArrayRenderer.convertColumnValue = function (colDef, value) {
          if (colDef.type) {
              if (colDef.type == "number" || colDef.type == "integer") {
                  return Number(value);
              }
              else if (colDef.type == "boolean") {
                  return Boolean(value);
              }
          }
          return value;
      };
      ArrayRenderer.prototype.mergeOptions = function (optionsA, optionsB) {
          return Object.keys(optionsB).reduce(function (mergedOpts, optionName) {
              if (mergedOpts.hasOwnProperty(optionName)) {
                  return mergedOpts;
              }
              mergedOpts[optionName] = optionsB[optionName];
              return mergedOpts;
          }, optionsA);
      };
      ArrayRenderer.prototype.isApplicable = function (element, subSchema, schemaPath) {
          return element.type == 'Control' && subSchema !== undefined && subSchema.type == 'array';
      };
      ArrayRenderer.prototype.render = function (element, schema, schemaPath, services) {
          var gridOptions = this.createGridOptions(element, services, schema, schemaPath);
          var data = services.get(JSONForms.ServiceId.DataProvider).getData();
          if (!Array.isArray(data)) {
              data = this.pathResolver.resolveInstance(data, schemaPath);
          }
          if (data != undefined) {
              gridOptions.data = data;
          }
          return {
              "type": "Control",
              "gridOptions": gridOptions,
              "size": this.maxSize,
              "template": "<jsonforms-control><div ui-grid=\"element['gridOptions']\" ui-grid-auto-resize ui-grid-pagination ui-grid-edit class=\"grid\"></div></jsonforms-control>"
          };
      };
      ArrayRenderer.prototype.generateColumnDefs = function (schema, schemaPath) {
          var columnsDefs = [];
          var subSchema = this.pathResolver.resolveSchema(schema, schemaPath);
          if (subSchema !== undefined && subSchema['items'] !== undefined && subSchema['items']['type'] == 'object') {
              var items = subSchema['items'];
              for (var prop in items['properties']) {
                  if (items['properties'].hasOwnProperty(prop)) {
                      var colDef = {
                          field: prop,
                          displayName: JSONForms.PathUtil.beautify(prop)
                      };
                      columnsDefs.push(colDef);
                  }
              }
          }
          else {
          }
          return columnsDefs;
      };
      ArrayRenderer.prototype.createColumnDefs = function (columns, schema, services) {
          var _this = this;
          var validationService = services.get(JSONForms.ServiceId.Validation);
          return columns.map(function (col) {
              var href = col['href'];
              if (href) {
                  var hrefScope = href.scope;
                  var cellTemplate;
                  var field = _this.pathResolver.toInstancePath(col['scope']['$ref']);
                  if (hrefScope) {
                      var instancePath = _this.pathResolver.toInstancePath(hrefScope.$ref);
                      cellTemplate = "<div class=\"ui-grid-cell-contents\">\n                      <a href=\"#" + href.url + "/{{row.entity." + instancePath + "}}\">\n                        {{row.entity." + field + "}}\n                      </a>\n                    </div>";
                  }
                  else {
                      cellTemplate = "<div class=\"ui-grid-cell-contents\">\n                      <a href=\"#" + href.url + "/{{row.entity." + field + "}}\">\n                        {{row.entity." + field + "}}\n                      </a>\n                </div>";
                  }
                  return {
                      cellTemplate: cellTemplate,
                      field: field,
                      displayName: col.label,
                      enableCellEdit: false
                  };
              }
              else {
                  var subSchema = _this.pathResolver.resolveSchema(schema, col['scope']['$ref']);
                  return {
                      field: _this.pathResolver.toInstancePath(col['scope']['$ref']),
                      displayName: col.label,
                      enableCellEdit: true,
                      type: subSchema.type,
                      cellClass: function (grid, row, col) {
                          var result = validationService.getResult(row.entity, '/' + col.colDef.field);
                          if (result != undefined) {
                              return 'invalidCell';
                          }
                          else {
                              return 'validCell';
                          }
                      }
                  };
              }
          });
      };
      ArrayRenderer.prototype.createGridOptions = function (element, services, schema, schemaPath) {
          var subSchema = this.pathResolver.resolveSchema(schema, schemaPath);
          var columnsDefs = element.columns ?
              this.createColumnDefs(element.columns, subSchema, services) :
              this.generateColumnDefs(subSchema, schemaPath);
          var gridOptions = this.defaultGridOptions(element.options || {}, services, schema);
          gridOptions.columnDefs = columnsDefs;
          return gridOptions;
      };
      return ArrayRenderer;
  })();
  module.run(['RenderService', 'PathResolver', function (RenderService, PathResolver) {
          RenderService.register(new ArrayRenderer(PathResolver));
      }]);
  //# sourceMappingURL=array-renderer.js.map

}) (angular.module ('jsonforms.renderers.controls.array', ['jsonforms.renderers.controls']));



//====================================================================================================================
// Module:    jsonforms.renderers.controls.integer
// Optimized: Yes
// File:      components/renderers/controls/integer/integer.js
//====================================================================================================================

(function (module) {

  ///<reference path="../../../references.ts"/>
  //# sourceMappingURL=integer.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/controls/integer/integer-renderer.js
//--------------------------------------------------------------------------------------------------------------------

  ///<reference path="../../../references.ts"/>
  var IntegerRenderer = (function () {
      function IntegerRenderer() {
          this.priority = 2;
      }
      IntegerRenderer.prototype.render = function (element, subSchema, schemaPath, services) {
          var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, element);
          control['template'] = "<jsonforms-control>\n          <input type=\"number\" step=\"1\" id=\"" + schemaPath + "\" class=\"form-control jsf-control jsf-control-integer\" " + (element.readOnly ? 'readonly' : '') + " data-jsonforms-validation data-jsonforms-model/>\n        </jsonforms-control>";
          return control;
      };
      IntegerRenderer.prototype.isApplicable = function (uiElement, subSchema, schemaPath) {
          return uiElement.type == 'Control' && subSchema !== undefined && subSchema.type == 'integer';
      };
      return IntegerRenderer;
  })();
  module.run(['RenderService', function (RenderService) {
          RenderService.register(new IntegerRenderer());
      }]);
  //# sourceMappingURL=integer-renderer.js.map

}) (angular.module ('jsonforms.renderers.controls.integer', ['jsonforms.renderers.controls']));



//====================================================================================================================
// Module:    jsonforms.renderers.controls.boolean
// Optimized: Yes
// File:      components/renderers/controls/boolean/boolean.js
//====================================================================================================================

(function (module) {

  ///<reference path="../../../references.ts"/>
  var app = module;
  //# sourceMappingURL=boolean.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/controls/boolean/boolean-renderer.js
//--------------------------------------------------------------------------------------------------------------------

  ///<reference path="../../../references.ts"/>
  var BooleanRenderer = (function () {
      function BooleanRenderer() {
          this.priority = 2;
      }
      BooleanRenderer.prototype.render = function (element, subSchema, schemaPath, services) {
          var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, element);
          control['template'] = "<jsonforms-control>\n          <input type=\"checkbox\" id=\"" + schemaPath + "\" class=\"jsf-control jsf-control-boolean\" " + (element.readOnly ? 'disabled="disabled"' : '') + " data-jsonforms-validation data-jsonforms-model/>\n        </jsonforms-control>";
          return control;
      };
      BooleanRenderer.prototype.isApplicable = function (uiElement, subSchema, schemaPath) {
          return uiElement.type == 'Control' && subSchema !== undefined && subSchema.type == 'boolean';
      };
      return BooleanRenderer;
  })();
  module.run(['RenderService', function (RenderService) {
          RenderService.register(new BooleanRenderer());
      }]);
  //# sourceMappingURL=boolean-renderer.js.map

}) (angular.module ('jsonforms.renderers.controls.boolean', ['jsonforms.renderers.controls']));



//====================================================================================================================
// Module:    jsonforms.renderers.controls.string
// Optimized: Yes
// File:      components/renderers/controls/string/string.js
//====================================================================================================================

(function (module) {

  ///<reference path="../../../references.ts"/>
  //# sourceMappingURL=string.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/controls/string/string-renderer.js
//--------------------------------------------------------------------------------------------------------------------

  ///<reference path="../../../references.ts"/>
  var StringRenderer = (function () {
      function StringRenderer() {
          this.priority = 2;
      }
      StringRenderer.prototype.render = function (element, subSchema, schemaPath, services) {
          var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, element);
          control['template'] = "<jsonforms-control>\n          <input type=\"text\" id=\"" + schemaPath + "\" class=\"form-control jsf-control jsf-control-string\" " + (element.readOnly ? 'readonly' : '') + " data-jsonforms-model data-jsonforms-validation/>\n        </jsonforms-control>";
          return control;
      };
      StringRenderer.prototype.isApplicable = function (uiElement, subSchema, schemaPath) {
          return uiElement.type == 'Control' && subSchema !== undefined && subSchema.type == 'string';
      };
      StringRenderer.inject = ['RenderDescriptionFactory'];
      return StringRenderer;
  })();
  module.run(['RenderService', function (RenderService) {
          RenderService.register(new StringRenderer());
      }]);
  //# sourceMappingURL=string-renderer.js.map

}) (angular.module ('jsonforms.renderers.controls.string', ['jsonforms.renderers.controls']));



//====================================================================================================================
// Module:    jsonforms.renderers.controls.number
// Optimized: Yes
// File:      components/renderers/controls/number/number.js
//====================================================================================================================

(function (module) {

  ///<reference path="../../../references.ts"/>
  //# sourceMappingURL=number.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/controls/number/number-renderer.js
//--------------------------------------------------------------------------------------------------------------------

  ///<reference path="../../../references.ts"/>
  var NumberRenderer = (function () {
      function NumberRenderer() {
          this.priority = 2;
      }
      NumberRenderer.prototype.render = function (element, subSchema, schemaPath, services) {
          var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, element);
          control['template'] = "<jsonforms-control>\n          <input type=\"number\" step=\"0.01\" id=\"" + schemaPath + "\" class=\"form-control jsf-control jsf-control-number\" " + (element.readOnly ? 'readonly' : '') + " data-jsonforms-validation data-jsonforms-model/>\n        </jsonforms-control>";
          return control;
      };
      NumberRenderer.prototype.isApplicable = function (uiElement, subSchema, schemaPath) {
          return uiElement.type == 'Control' && subSchema !== undefined && subSchema.type == 'number';
      };
      return NumberRenderer;
  })();
  module.run(['RenderService', function (RenderService) {
          RenderService.register(new NumberRenderer());
      }]);
  //# sourceMappingURL=number-renderer.js.map

}) (angular.module ('jsonforms.renderers.controls.number', ['jsonforms.renderers.controls']));



//====================================================================================================================
// Module:    jsonforms.renderers.controls.datetime
// Optimized: Yes
// File:      components/renderers/controls/datetime/datetime.js
//====================================================================================================================

(function (module) {

  ///<reference path="../../../references.ts"/>
  //# sourceMappingURL=datetime.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/controls/datetime/datetime-renderer.js
//--------------------------------------------------------------------------------------------------------------------

  ///<reference path="../../../references.ts"/>
  var DatetimeRenderer = (function () {
      function DatetimeRenderer() {
          this.priority = 3;
      }
      DatetimeRenderer.prototype.render = function (element, schema, schemaPath, services) {
          var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, element);
          control['isOpen'] = false;
          control['openDate'] = function ($event) {
              control['isOpen'] = true;
          };
          control['template'] =
              "<jsonforms-control>\n            <div class=\"input-group\">\n              <input type=\"text\" " + (element.readOnly ? 'readonly' : '') + " datepicker-popup=\"dd.MM.yyyy\" close-text=\"Close\" is-open=\"element.isOpen\" id=\"" + schemaPath + "\" class=\"form-control jsf-control jsf-control-datetime\" data-jsonforms-model  data-jsonforms-validation/>\n                 <span class=\"input-group-btn\">\n                   <button type=\"button\" class=\"btn btn-default\" ng-click=\"element.openDate($event)\">\n                     <i class=\"glyphicon glyphicon-calendar\"></i>\n                   </button>\n                 </span>\n            </div>\n            </jsonforms-control>";
          return control;
      };
      DatetimeRenderer.prototype.isApplicable = function (uiElement, subSchema, schemaPath) {
          return uiElement.type == 'Control' && subSchema !== undefined && subSchema.type == "string" &&
              subSchema['format'] != undefined && subSchema['format'] == "date-time";
      };
      return DatetimeRenderer;
  })();
  module.run(['RenderService', function (RenderService) {
          RenderService.register(new DatetimeRenderer());
      }]);
  //# sourceMappingURL=datetime-renderer.js.map

}) (angular.module ('jsonforms.renderers.controls.datetime', ['jsonforms.renderers.controls']));



//====================================================================================================================
// Module:    jsonforms.renderers.controls.enum
// Optimized: Yes
// File:      components/renderers/controls/enum/enum.js
//====================================================================================================================

(function (module) {

  ///<reference path="../../../references.ts"/>
  //# sourceMappingURL=enum.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/controls/enum/enum-renderer.js
//--------------------------------------------------------------------------------------------------------------------

  ///<reference path="../../../references.ts"/>
  var EnumRenderer = (function () {
      function EnumRenderer(pathResolver) {
          this.pathResolver = pathResolver;
          this.priority = 3;
      }
      EnumRenderer.prototype.render = function (element, schema, schemaPath, services) {
          var subSchema = this.pathResolver.resolveSchema(schema, schemaPath);
          var enums = subSchema.enum;
          var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, element);
          control['template'] = "<jsonforms-control>\n          <select  ng-options=\"option as option for option in element.options\" id=\"" + schemaPath + "\" class=\"form-control jsf-control jsf-control-enum\" " + (element.readOnly ? 'disabled' : '') + " data-jsonforms-model data-jsonforms-validation></select>\n        </jsonforms-control>";
          control['options'] = enums;
          return control;
      };
      EnumRenderer.prototype.isApplicable = function (uiElement, subSchema, schemaPath) {
          return uiElement.type == 'Control' && subSchema !== undefined && subSchema.hasOwnProperty('enum');
      };
      return EnumRenderer;
  })();
  module.run(['RenderService', 'PathResolver', function (RenderService, PathResolver) {
          RenderService.register(new EnumRenderer(PathResolver));
      }]);
  //# sourceMappingURL=enum-renderer.js.map

}) (angular.module ('jsonforms.renderers.controls.enum', ['jsonforms.renderers.controls']));



//====================================================================================================================
// Module:    jsonforms.renderers.layouts
// Optimized: Yes
// File:      components/renderers/layouts/layouts.js
//====================================================================================================================

(function (module) {

  ///<reference path="../../references.ts"/>
  //# sourceMappingURL=layouts.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/layouts/layouts-directive.js
//--------------------------------------------------------------------------------------------------------------------

  ///<reference path="../../references.ts"/>
  module.directive('jsonformsLayout', function () {
      return {
          restrict: "E",
          replace: true,
          transclude: true,
          templateUrl: 'components/renderers/layouts/layout.html'
      };
  });
  //# sourceMappingURL=layouts-directive.js.map

}) (angular.module ('jsonforms.renderers.layouts', ['jsonforms.renderers']));



//====================================================================================================================
// Module:    jsonforms.renderers.layouts.vertical
// Optimized: Yes
// File:      components/renderers/layouts/vertical/vertical.js
//====================================================================================================================

(function (module) {

  ///<reference path="../../../references.ts"/>
  //# sourceMappingURL=vertical.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/layouts/vertical/vertical-renderer.js
//--------------------------------------------------------------------------------------------------------------------

  ///<reference path="../../../references.ts"/>
  var VerticalRenderer = (function () {
      function VerticalRenderer(renderService) {
          this.renderService = renderService;
          this.priority = 1;
      }
      VerticalRenderer.prototype.render = function (element, subSchema, schemaPath, services) {
          var renderedElements = JSONForms.RenderDescriptionFactory.renderElements(element.elements, this.renderService, services);
          var template = "<jsonforms-layout class=\"jsf-vertical-layout\">\n              <fieldset>\n                <jsonforms-dynamic-widget ng-repeat=\"child in element.elements\" element=\"child\">\n                </jsonforms-dynamic-widget>\n             </fieldset>\n            </jsonforms-layout>";
          return JSONForms.RenderDescriptionFactory.createContainerDescription(99, renderedElements, template, services, element);
      };
      VerticalRenderer.prototype.isApplicable = function (uiElement, jsonSchema, schemaPath) {
          return uiElement.type == "VerticalLayout";
      };
      return VerticalRenderer;
  })();
  module.run(['RenderService', function (RenderService) {
          RenderService.register(new VerticalRenderer(RenderService));
      }]);
  //# sourceMappingURL=vertical-renderer.js.map

}) (angular.module ('jsonforms.renderers.layouts.vertical', ['jsonforms.renderers.layouts']));



//====================================================================================================================
// Module:    jsonforms.renderers.layouts.group
// Optimized: Yes
// File:      components/renderers/layouts/group/group.js
//====================================================================================================================

(function (module) {

  ///<reference path="../../../references.ts"/>
  //# sourceMappingURL=group.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/layouts/group/group-renderer.js
//--------------------------------------------------------------------------------------------------------------------

  ///<reference path="../../../references.ts"/>
  var GroupRenderer = (function () {
      function GroupRenderer(renderService) {
          this.renderService = renderService;
          this.priority = 1;
      }
      GroupRenderer.prototype.render = function (element, jsonSchema, schemaPath, services) {
          var renderedElements = JSONForms.RenderDescriptionFactory.renderElements(element.elements, this.renderService, services);
          var label = element.label ? element.label : "";
          var template = "<jsonforms-layout class=\"jsf-group\">\n              <fieldset>\n                <legend>" + label + "</legend>\n                <jsonforms-dynamic-widget ng-repeat=\"child in element.elements\" element=\"child\">\n                </jsonforms-dynamic-widget>\n               </fieldset>\n             </jsonforms-layout>";
          return JSONForms.RenderDescriptionFactory.createContainerDescription(99, renderedElements, template, services, element);
      };
      GroupRenderer.prototype.isApplicable = function (uiElement, subSchema, schemaPath) {
          return uiElement.type == "Group";
      };
      return GroupRenderer;
  })();
  module.run(['RenderService', function (RenderService) {
          RenderService.register(new GroupRenderer(RenderService));
      }]);
  //# sourceMappingURL=group-renderer.js.map

}) (angular.module ('jsonforms.renderers.layouts.group', ['jsonforms.renderers.layouts']));



//====================================================================================================================
// Module:    jsonforms.renderers.layouts.horizontal
// Optimized: Yes
// File:      components/renderers/layouts/horizontal/horizontal.js
//====================================================================================================================

(function (module) {

  ///<reference path="../../../references.ts"/>
  //# sourceMappingURL=horizontal.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/layouts/horizontal/horizontal-renderer.js
//--------------------------------------------------------------------------------------------------------------------

  ///<reference path="../../../references.ts"/>
  var HorizontalRenderer = (function () {
      function HorizontalRenderer(renderService) {
          this.renderService = renderService;
          this.priority = 1;
      }
      HorizontalRenderer.prototype.render = function (element, subSchema, schemaPath, services) {
          var maxSize = 99;
          var renderedElements = JSONForms.RenderDescriptionFactory.renderElements(element.elements, this.renderService, services);
          var size = renderedElements.length;
          var individualSize = Math.floor(maxSize / size);
          for (var j = 0; j < renderedElements.length; j++) {
              renderedElements[j].size = individualSize;
          }
          var template = "<jsonforms-layout><fieldset>\n                   <div class=\"row\">\n                     <jsonforms-dynamic-widget ng-repeat=\"child in element.elements\" element=\"child\"></jsonforms-dynamic-widget>\n                   </div>\n                 </fieldset></jsonforms-layout>";
          return JSONForms.RenderDescriptionFactory.createContainerDescription(maxSize, renderedElements, template, services, element);
      };
      ;
      HorizontalRenderer.prototype.isApplicable = function (uiElement, jsonSchema, schemaPath) {
          return uiElement.type == "HorizontalLayout";
      };
      return HorizontalRenderer;
  })();
  module.run(['RenderService', function (RenderService) {
          RenderService.register(new HorizontalRenderer(RenderService));
      }]);
  //# sourceMappingURL=horizontal-renderer.js.map

}) (angular.module ('jsonforms.renderers.layouts.horizontal', ['jsonforms.renderers.layouts']));



//====================================================================================================================
// Module:    jsonforms.renderers.layouts.categories
// Optimized: Yes
// File:      components/renderers/layouts/categories/categories.js
//====================================================================================================================

///<reference path="../../../references.ts"/>
//# sourceMappingURL=categories.js.map
angular.module ('jsonforms.renderers.layouts.categories', ['jsonforms.renderers.layouts']);



//====================================================================================================================
// Module:    jsonforms.renderers.layouts.categories.categorization
// Optimized: Yes
// File:      components/renderers/layouts/categories/categorization/categorization.js
//====================================================================================================================

(function (module) {

  ///<reference path="../../../../references.ts"/>
  //# sourceMappingURL=categorization.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/layouts/categories/categorization/categorization-renderer.js
//--------------------------------------------------------------------------------------------------------------------

  ///<reference path="../../../../references.ts"/>
  var CategorizationRenderer = (function () {
      function CategorizationRenderer(renderService) {
          this.renderService = renderService;
          this.priority = 1;
      }
      CategorizationRenderer.prototype.render = function (element, subSchema, schemaPath, services) {
          var renderedElements = JSONForms.RenderDescriptionFactory.renderElements(element.elements, this.renderService, services);
          var template = "<jsonforms-layout>\n            <tabset>\n                <jsonforms-dynamic-widget ng-repeat=\"child in element.elements\" element=\"child\"></jsonforms-dynamic-widget>\n            </tabset>\n        </jsonforms-layout>";
          return JSONForms.RenderDescriptionFactory.createContainerDescription(99, renderedElements, template, services, element);
      };
      CategorizationRenderer.prototype.isApplicable = function (uiElement, jsonSchema, schemaPath) {
          return uiElement.type == "Categorization";
      };
      return CategorizationRenderer;
  })();
  module.run(['RenderService', function (RenderService) {
          RenderService.register(new CategorizationRenderer(RenderService));
      }]);
  //# sourceMappingURL=categorization-renderer.js.map

}) (angular.module ('jsonforms.renderers.layouts.categories.categorization', ['jsonforms.renderers.layouts.categories']));



//====================================================================================================================
// Module:    jsonforms.renderers.layouts.categories.category
// Optimized: Yes
// File:      components/renderers/layouts/categories/category/category.js
//====================================================================================================================

(function (module) {

  ///<reference path="../../../../references.ts"/>
  //# sourceMappingURL=category.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/layouts/categories/category/category-renderer.js
//--------------------------------------------------------------------------------------------------------------------

  ///<reference path="../../../../references.ts"/>
  var CategoryRenderer = (function () {
      function CategoryRenderer(renderService) {
          this.renderService = renderService;
          this.priority = 1;
      }
      CategoryRenderer.prototype.render = function (element, subSchema, schemaPath, services) {
          var renderedElements = JSONForms.RenderDescriptionFactory.renderElements(element.elements, this.renderService, services);
          var label = element.label;
          var template = "<tab heading=\"" + label + "\">\n            <jsonforms-layout>\n                <fieldset>\n                    <jsonforms-dynamic-widget ng-repeat=\"child in element.elements\" element=\"child\"></jsonforms-dynamic-widget>\n                </fieldset>\n            </jsonforms-layout>\n        </tab>";
          return JSONForms.RenderDescriptionFactory.createContainerDescription(99, renderedElements, template, services, element);
      };
      CategoryRenderer.prototype.isApplicable = function (uiElement, jsonSchema, schemaPath) {
          return uiElement.type == "Category";
      };
      return CategoryRenderer;
  })();
  module.run(['RenderService', function (RenderService) {
          RenderService.register(new CategoryRenderer(RenderService));
      }]);
  //# sourceMappingURL=category-renderer.js.map

}) (angular.module ('jsonforms.renderers.layouts.categories.category', ['jsonforms.renderers.layouts.categories']));



//====================================================================================================================
// Module:    jsonforms.renderers.extras.label
// Optimized: Yes
// File:      components/renderers/extras/label/label.js
//====================================================================================================================

(function (module) {

  ///<reference path="../../../references.ts"/>
  //# sourceMappingURL=label.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/extras/label/label-renderer.js
//--------------------------------------------------------------------------------------------------------------------

  ///<reference path="../../../references.ts"/>
  var LabelRenderer = (function () {
      function LabelRenderer() {
          this.priority = 1;
      }
      LabelRenderer.prototype.render = function (element, schema, schemaPath, services) {
          var text = element['text'];
          var size = 99;
          return {
              "type": "Widget",
              "size": size,
              "template": " <jsonforms-widget><div class=\"jsf-label\">" + text + "</div></jsonforms-widget>"
          };
      };
      LabelRenderer.prototype.isApplicable = function (element) {
          return element.type == "Label";
      };
      return LabelRenderer;
  })();
  module.run(['RenderService', function (RenderService) {
          RenderService.register(new LabelRenderer());
      }]);
  //# sourceMappingURL=label-renderer.js.map

}) (angular.module ('jsonforms.renderers.extras.label', ['jsonforms.renderers']));



//====================================================================================================================
// Module:    jsonforms.form
// Optimized: Yes
// File:      components/form/form.js
//====================================================================================================================

(function (module) {

  ///<reference path="../references.ts"/>
  var app = module;
  //# sourceMappingURL=form.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/form/form-directive.js
//--------------------------------------------------------------------------------------------------------------------

  ///<reference path="../references.ts"/>
  var PathResolver = JSONForms.PathResolver;
  var FormController = (function () {
      function FormController(RenderService, PathResolver, UISchemaGenerator, SchemaGenerator, $q, scope) {
          this.RenderService = RenderService;
          this.PathResolver = PathResolver;
          this.UISchemaGenerator = UISchemaGenerator;
          this.SchemaGenerator = SchemaGenerator;
          this.$q = $q;
          this.scope = scope;
          this.isInitialized = false;
      }
      FormController.prototype.init = function () {
          var _this = this;
          if (this.isInitialized) {
              var children = angular.element(this.element.find('form')).children();
              children.remove();
          }
          this.isInitialized = true;
          var resolvedSchemaDeferred = this.$q.defer();
          var resolvedUISchemaDeferred = this.$q.defer();
          this.$q.all([this.fetchSchema().promise, this.fetchUiSchema().promise]).then(function (values) {
              var schema = values[0];
              var uiSchemaMaybe = values[1];
              var uiSchemaDeferred = _this.$q.defer();
              _this.$q.when(uiSchemaDeferred.promise).then(function (uiSchema) {
                  JsonRefs.resolveRefs(schema, {}, function (err, resolvedSchema) {
                      resolvedSchemaDeferred.resolve(resolvedSchema);
                      resolvedUISchemaDeferred.resolve(uiSchema);
                  });
              });
              if (uiSchemaMaybe === undefined || uiSchemaMaybe === null || uiSchemaMaybe === "") {
                  JsonRefs.resolveRefs(schema, {}, function (err, resolvedSchema) {
                      var uiSchema = _this.UISchemaGenerator.generateDefaultUISchema(resolvedSchema);
                      uiSchemaDeferred.resolve(uiSchema);
                  });
              }
              else {
                  uiSchemaDeferred.resolve(uiSchemaMaybe);
              }
          });
          this.$q.all([resolvedSchemaDeferred.promise, resolvedUISchemaDeferred.promise, this.fetchData()]).then(function (values) {
              var schema = values[0];
              var uiSchema = values[1];
              var data = values[2];
              var services = new JSONForms.Services();
              services.add(new JSONForms.PathResolverService(new PathResolver()));
              services.add(new JSONForms.ScopeProvider(_this.scope));
              services.add(new JSONForms.SchemaProvider(schema));
              services.add(new JSONForms.ValidationService());
              services.add(new JSONForms.RuleService(_this.PathResolver));
              var dataProvider;
              if (FormController.isDataProvider(_this.scope.data)) {
                  dataProvider = _this.scope.data;
              }
              else {
                  dataProvider = new JSONForms.DefaultDataProvider(_this.$q, data);
              }
              services.add(dataProvider);
              _this.elements = [_this.RenderService.render(_this.scope, uiSchema, services)];
          });
      };
      FormController.prototype.fetchSchema = function () {
          if (typeof this.scope.schema === "object") {
              var p = this.$q.defer();
              p.resolve(this.scope.schema);
              return p;
          }
          else if (this.scope.schema !== undefined) {
              return this.scope.schema();
          }
          else {
              var p = this.$q.defer();
              p.resolve(this.SchemaGenerator.generateDefaultSchema(this.scope.data));
              return p;
          }
      };
      FormController.prototype.fetchUiSchema = function () {
          if (FormController.isUiSchemaProvider(this.scope.uiSchema)) {
              return this.scope.uiSchema.getUiSchema();
          }
          else if (typeof this.scope.uiSchema === "object") {
              var p_1 = this.$q.defer();
              p_1.resolve(this.scope.uiSchema);
              return p_1;
          }
          var p = this.$q.defer();
          p.resolve(undefined);
          return p;
      };
      FormController.prototype.fetchData = function () {
          if (FormController.isDataProvider(this.scope.data)) {
              return this.scope.data.fetchData();
          }
          else if (typeof this.scope.data === "object") {
              var p = this.$q.defer();
              p.resolve(this.scope.data);
              return p.promise;
          }
          throw new Error("Either the 'data' or the 'async-data-provider' attribute must be specified.");
      };
      FormController.isDataProvider = function (testMe) {
          return testMe !== undefined && testMe.hasOwnProperty('fetchData');
      };
      FormController.isUiSchemaProvider = function (testMe) {
          return testMe !== undefined && testMe.hasOwnProperty('fetchUiSchema');
      };
      FormController.$inject = ['RenderService', 'PathResolver', 'UISchemaGenerator', 'SchemaGenerator', '$q', '$scope'];
      return FormController;
  })();
  var JsonFormsDirective = (function () {
      function JsonFormsDirective() {
          this.restrict = "E";
          this.replace = true;
          this.templateUrl = 'components/form/form.html';
          this.controller = FormController;
          this.controllerAs = 'vm';
          this.scope = {
              schema: '=',
              uiSchema: '=',
              data: '=',
          };
          this.link = function (scope, el, attrs, ctrl) {
              ctrl.element = el;
              scope.$watchGroup(['data', 'uiSchema'], function (newValue) {
                  if (angular.isDefined(newValue)) {
                      ctrl.init();
                  }
              });
          };
      }
      return JsonFormsDirective;
  })();
  module.directive('jsonforms', function () { return new JsonFormsDirective(); });
  //# sourceMappingURL=form-directive.js.map

}) (angular.module ('jsonforms.form', ['jsonforms.generators', 'jsonforms.generators.schema', 'jsonforms.generators.uischema', 'jsonforms.pathresolver', 'jsonforms.renderers', 'jsonforms.renderers.controls', 'jsonforms.renderers.controls.array', 'jsonforms.renderers.controls.integer', 'jsonforms.renderers.controls.boolean', 'jsonforms.renderers.controls.string', 'jsonforms.renderers.controls.number', 'jsonforms.renderers.controls.datetime', 'jsonforms.renderers.controls.enum', 'jsonforms.renderers.layouts', 'jsonforms.renderers.layouts.vertical', 'jsonforms.renderers.layouts.group', 'jsonforms.renderers.layouts.horizontal', 'jsonforms.renderers.layouts.categories', 'jsonforms.renderers.layouts.categories.categorization', 'jsonforms.renderers.layouts.categories.category', 'jsonforms.renderers.extras.label']));



//====================================================================================================================
// Module:    jsonforms.renderers.controls.reference
// Optimized: Yes
// File:      components/renderers/controls/reference/reference.js
//====================================================================================================================

(function (module) {

  ///<reference path="../../../references.ts"/>
  //# sourceMappingURL=reference.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/controls/reference/reference-renderer.js
//--------------------------------------------------------------------------------------------------------------------

  ///<reference path="../../../references.ts"/>
  var ReferenceRenderer = (function () {
      function ReferenceRenderer(pathResolver) {
          this.pathResolver = pathResolver;
          this.priority = 2;
      }
      ReferenceRenderer.prototype.render = function (element, schema, schemaPath, services) {
          var control = new JSONForms.ControlRenderDescription(schemaPath, services, element);
          var normalizedPath = this.pathResolver.toInstancePath(schemaPath);
          var prefix = element.label ? element.label : "Go to ";
          var linkText = element['href']['label'] ? element['href']['label'] : control.label;
          var data = services.get(JSONForms.ServiceId.DataProvider).getData();
          control['template'] = "<div>" + prefix + " <a href=\"#" + element['href']['url'] + "/" + data[normalizedPath] + "\">" + linkText + "</a></div>";
          return control;
      };
      ReferenceRenderer.prototype.isApplicable = function (uiElement, subSchema, schemaPath) {
          return uiElement.type == "ReferenceControl";
      };
      return ReferenceRenderer;
  })();
  module.run(['RenderService', 'PathResolver', function (RenderService, PathResolver) {
          RenderService.register(new ReferenceRenderer(PathResolver));
      }]);
  //# sourceMappingURL=reference-renderer.js.map

}) (angular.module ('jsonforms.renderers.controls.reference', ['jsonforms.renderers.controls']));



//====================================================================================================================
// Module:    jsonforms.renderers.layouts.masterdetail
// Optimized: Yes
// File:      components/renderers/layouts/masterdetail/masterdetail.js
//====================================================================================================================

(function (module) {

  ///<reference path="../../../references.ts"/>
  //# sourceMappingURL=masterdetail.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/layouts/masterdetail/masterdetail-directives.js
//--------------------------------------------------------------------------------------------------------------------

  ///<reference path="../../../references.ts"/>
  var MasterDetailCollectionDirective = (function () {
      function MasterDetailCollectionDirective() {
          this.restrict = "E";
          this.replace = true;
          this.scope = {
              collection: '=',
              element: '='
          };
          this.template = "\n        <div>\n            <accordion close-others=\"false\">\n                <accordion-group is-open=\"status_attribute.open\" ng-repeat=\"(key, value) in element.filter(collection)\">\n                    <accordion-heading>\n                        {{key}} <i class=\"pull-right glyphicon\" ng-class=\"{'glyphicon-chevron-down': status_attribute.open, 'glyphicon-chevron-right': !status_attribute.open}\"></i>\n                    </accordion-heading>\n                    <accordion close-others=\"false\">\n                        <accordion-group is-open=\"status_object.open\" ng-repeat=\"child in element.instance[key]\">\n                            <accordion-heading>\n                                <span ng-click=\"element.selectedChild=child;element.selectedSchema=value.items;\">{{child.name}}<!-- label provider needed --></span><i class=\"pull-right glyphicon\" ng-class=\"{'glyphicon-chevron-down': status_object.open, 'glyphicon-chevron-right': !status_object.open}\"></i>\n                            </accordion-heading>\n                            <jsonforms-masterdetail-member element=\"element\" member=\"value.items\"></jsonforms-masterdetail-member>\n                        </accordion-group>\n                    </accordion>\n                </accordion-group>\n            </accordion>\n        </div>\n        ";
      }
      return MasterDetailCollectionDirective;
  })();
  var MasterDetailMember = (function () {
      function MasterDetailMember($compile) {
          var _this = this;
          this.$compile = $compile;
          this.restrict = "E";
          this.replace = true;
          this.scope = {
              member: '=',
              element: '='
          };
          this.link = function (scope, element) {
              _this.$compile('<jsonforms-masterdetail-collection collection="member.properties" element="element"></jsonforms-masterdetail-collection>')(scope, function (cloned) {
                  element.replaceWith(cloned);
              });
          };
      }
      return MasterDetailMember;
  })();
  module
      .directive('jsonformsMasterdetailCollection', function () { return new MasterDetailCollectionDirective; })
      .directive('jsonformsMasterdetailMember', function ($compile) { return new MasterDetailMember($compile); });
  //# sourceMappingURL=masterdetail-directives.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/layouts/masterdetail/masterdetail-renderer.js
//--------------------------------------------------------------------------------------------------------------------

  ///<reference path="../../../references.ts"/>
  var MasterDetailRenderer = (function () {
      function MasterDetailRenderer() {
          this.priority = 1;
      }
      MasterDetailRenderer.prototype.render = function (element, subSchema, schemaPath, services) {
          var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, element);
          control['template'] = "\n        <div class=\"row\">\n            <!-- Master -->\n            <div class=\"col-sm-30\">\n                <jsonforms-masterdetail-collection element=\"element\" collection=\"element.schema.properties\"></jsonforms-masterdetail-collection>\n            </div>\n            <!-- Detail -->\n            <div class=\"col-sm-70\">\n                <jsonforms schema=\"element.selectedSchema\" data=\"element.selectedChild\" ng-if=\"element.selectedChild\"></jsonforms>\n            </div>\n        </div>\n        ";
          control['schema'] = subSchema;
          control['filter'] = function (properties) {
              var result = {};
              angular.forEach(properties, function (value, key) {
                  if (value.type == 'array' && value.items.type == 'object') {
                      result[key] = value;
                  }
              });
              return result;
          };
          return control;
      };
      MasterDetailRenderer.prototype.isApplicable = function (uiElement, jsonSchema, schemaPath) {
          return uiElement.type == "MasterDetailLayout" && jsonSchema !== undefined && jsonSchema.type == 'object';
      };
      return MasterDetailRenderer;
  })();
  module.run(['RenderService', function (RenderService) {
          RenderService.register(new MasterDetailRenderer());
      }]);
  //# sourceMappingURL=masterdetail-renderer.js.map

}) (angular.module ('jsonforms.renderers.layouts.masterdetail', ['jsonforms.renderers.layouts']));



//====================================================================================================================
// Module:    jsonforms
// Optimized: Yes
// File:      components/app.js
//====================================================================================================================

///<reference path="./references.ts"/>
//# sourceMappingURL=app.js.map
angular.module ('jsonforms', ['ui.bootstrap', 'ui.validate', 'ui.grid', 'ui.grid.autoResize', 'ui.grid.edit', 'ui.grid.pagination', 'jsonforms.form', 'jsonforms.generators', 'jsonforms.generators.schema', 'jsonforms.generators.uischema', 'jsonforms.pathresolver', 'jsonforms.renderers', 'jsonforms.renderers.controls', 'jsonforms.renderers.controls.array', 'jsonforms.renderers.controls.integer', 'jsonforms.renderers.controls.boolean', 'jsonforms.renderers.controls.reference', 'jsonforms.renderers.controls.string', 'jsonforms.renderers.controls.number', 'jsonforms.renderers.controls.datetime', 'jsonforms.renderers.controls.enum', 'jsonforms.renderers.layouts', 'jsonforms.renderers.layouts.vertical', 'jsonforms.renderers.layouts.horizontal', 'jsonforms.renderers.layouts.categories', 'jsonforms.renderers.layouts.categories.categorization', 'jsonforms.renderers.layouts.categories.category', 'jsonforms.renderers.extras.label', 'jsonforms.renderers.layouts.masterdetail']);



// Source: temp/templates.js
angular.module('jsonforms').run(['$templateCache', function($templateCache) {
$templateCache.put('components/form/form.html',
    "<div><form role=\"form\" class=\"jsf-form rounded\"><jsonforms-dynamic-widget ng-repeat=\"child in vm.elements\" element=\"child\"></jsonforms-dynamic-widget></form></div>"
  );


  $templateCache.put('components/renderers/controls/control.html',
    "<div class=\"col-sm-{{element.size}} form-group top-buffer\" ng-hide=\"element.hide\"><div class=\"row\"><label ng-if=\"element.label\" for=\"element.id\">{{element.label}}</label></div><div class=\"row\" style=\"padding-right: 1em\" ng-transclude></div><div class=\"row\" style=\"padding-right: 1em\"><alert ng-repeat=\"alert in element.alerts\" type=\"{{alert.type}}\" class=\"top-buffer-s jsf-alert\">{{alert.msg}}</alert></div></div>"
  );


  $templateCache.put('components/renderers/layouts/layout.html',
    "<div class=\"col-sm-{{element.size}}\" ng-hide=\"element.hide\" ng-transclude></div>"
  );

}]);
