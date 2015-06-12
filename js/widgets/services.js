angular.module('jsonForms.services', [])

    .provider('BindingService', function() {

    var bindings = {};

    this.addBinding = function(id, element) {
        bindings[id] = element;
    };

    this.binding = function(id) {
        return bindings[id];
    };

    this.all = function(ignoreUndefined) {
        var data = {};
        for (var key in bindings) {
            var value = bindings[key];
            if (value != null || (value == null && !ignoreUndefined)) {
                data[key] = value;
            }
        }
        return data;
    };

    this.$get = function() {
        var that = this;
        return {
            add: that.addBinding,
            binding: that.binding,
            all: that.all
        }
    };
}).factory('EndpointMapping', function() {
        var mapping = {};
        var uiSchemaMapping = {};
        var urlMapping = {};

        var elements = {};

        return {
            //TODO
            registerElement: function(element, schema, data) {
                console.log("Adding schema " + schema());
                console.log("Adding data " + data());
              elements[element] = {
                  schema: schema(),
                  data: data()
              };
            },
            getElement: function(element) {
                return elements[element];
            },
            registerSchema: function(schemaType, schema) {
                console.log("Registered schema for " + schemaType);
                mapping[schemaType] = schema;
                // TODO: naive
                mapping[schemaType + "s"] = {
                    "type": "array",
                    "items": schema
                };
                console.log("multi " + mapping[schemaType + "s"]);
            },
            registerUISchema: function(schemaType, uiSchema) {
                uiSchemaMapping[schemaType] = uiSchema;
            },
            registerUrl: function(schemaType, url) {
                console.log("Registered " + url + " for type " + schemaType);
                urlMapping[schemaType] = url;
            },
            getSchema: function(schemaId) {
                console.log("Fetching schema for " + schemaId);
                return mapping[schemaId];
            },
            getUiSchema: function(schemaId, isMulti) {
                if (isMulti) {
                    return uiSchemaMapping[schemaId.substring(0, schemaId.length - 2)];
                }
                return uiSchemaMapping[schemaId];
            },
            getInstanceDataUrl: function(schemaId) {
                return urlMapping[schemaId];
            }
        };
    }
).provider('RenderService', function() {

    /**
     * Maps viewmodel types to renderers
     */
    var renderers = {};

    this.addRenderer = function(renderer) {
        renderers[renderer.id] = renderer.render;
    };

    this.$get = function() {
        var that = this;
        return {
            // can be made private?
            createUiElement: function(displayName, path, type, value) {
                return {
                    displayname: displayName,
                    id: path,
                    value: value,
                    type: type.type,
                    options: type.enum,
                    isOpen: false,
                    alerts: []
                };
            },
            hasRendererFor: function(element) {
                return renderers.hasOwnProperty(element.type);
            },
            render: function (element, model, instance, $scope) {
                var renderer = renderers[element.type];
                return renderer(element, model, instance, $scope);
            },
            renderAll: function(schema, viewModel, instance, $scope) {
                var result = [];

                if (viewModel.elements === undefined) {
                    return result;
                }

                var elements = viewModel.elements;

                for (var i = 0; i < elements.length; i++) {

                    var element = elements[i];

                    if (this.hasRendererFor(element)) {
                        var renderedElement = this.render(element, schema, instance, $scope);
                        result.push(renderedElement);
                    }
                }

                return result;
            },
            register: function (renderer) {
                that.addRenderer(renderer);
            },
            unregister: function () {

            }
        }
    };
});
