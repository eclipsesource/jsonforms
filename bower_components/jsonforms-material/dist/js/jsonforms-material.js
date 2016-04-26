/*! jsonforms-material - v0.0.1 - 2016-02-03 Copyright (c) EclipseSource Muenchen GmbH and others. */ 
'use strict';
// Source: temp/utils.js
/*! jsonforms-material - v0.0.1 - 2016-02-03 Copyright (c) EclipseSource Muenchen GmbH and others. */ 

// Source: temp/jsonforms-material-module.js
/*! jsonforms-material - v0.0.1 - 2016-02-03 Copyright (c) EclipseSource Muenchen GmbH and others. */ 

// Source: temp/jsonforms-material.js
//====================================================================================================================
// Module:    jsonforms-material.renderers.layouts
// Optimized: Yes
// File:      components/renderers/layouts/layouts.js
//====================================================================================================================

(function (module) {

  //# sourceMappingURL=layouts.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/layouts/layouts-directive.js
//--------------------------------------------------------------------------------------------------------------------

  module.directive('jsonformsMaterialLayout', function () {
      return {
          restrict: "E",
          replace: true,
          transclude: true,
          templateUrl: 'components/renderers/layouts/layout.html'
      };
  });
  //# sourceMappingURL=layouts-directive.js.map

}) (angular.module ('jsonforms-material.renderers.layouts', ['jsonforms.renderers']));



//====================================================================================================================
// Module:    jsonforms-material.renderers.layouts.categories
// Optimized: Yes
// File:      components/renderers/layouts/categories/categories.js
//====================================================================================================================

//# sourceMappingURL=categories.js.map
angular.module ('jsonforms-material.renderers.layouts.categories', ['jsonforms-material.renderers.layouts']);



//====================================================================================================================
// Module:    jsonforms-material.renderers.layouts.categories.categorization
// Optimized: Yes
// File:      components/renderers/layouts/categories/categorization/categorization.js
//====================================================================================================================

(function (module) {

  //# sourceMappingURL=categorization.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/layouts/categories/categorization/categorization-renderer.js
//--------------------------------------------------------------------------------------------------------------------

  var MaterialCategorizationRenderer = (function () {
      function MaterialCategorizationRenderer(renderService) {
          this.renderService = renderService;
          this.priority = 10;
      }
      MaterialCategorizationRenderer.prototype.render = function (element, subSchema, schemaPath, services) {
          var renderedElements = JSONForms.RenderDescriptionFactory.renderElements(element.elements, this.renderService, services);
          var template = "<jsonforms-material-layout>\n            <md-tabs md-border-bottom md-dynamic-height md-autoselect>\n            <!--\n                <dynamic-widget ng-repeat=\"child in element.elements\" element=\"child\"></dynamic-widget>\n            -->\n                <md-tab ng-repeat=\"child in element.elements\" label=\"{{child.label}}\">\n                    <jsonforms-material-layout>\n                        <fieldset>\n                            <md-content layout-padding layout=\"column\">\n                                <jsonforms-dynamic-widget ng-repeat=\"innerchild in child.elements\" element=\"innerchild\"></jsonforms-dynamic-widget>\n                            </md-content>\n                        </fieldset>\n                    </jsonforms-material-layout>\n                </md-tab>\n            </md-tabs>\n        </jsonforms-material-layout>";
          return JSONForms.RenderDescriptionFactory.createContainerDescription(99, renderedElements, template, services, element);
      };
      MaterialCategorizationRenderer.prototype.isApplicable = function (uiElement, jsonSchema, schemaPath) {
          return uiElement.type == "Categorization";
      };
      return MaterialCategorizationRenderer;
  })();
  module.run(['RenderService', function (RenderService) {
          RenderService.register(new MaterialCategorizationRenderer(RenderService));
      }]);
  //# sourceMappingURL=categorization-renderer.js.map

}) (angular.module ('jsonforms-material.renderers.layouts.categories.categorization', ['jsonforms-material.renderers.layouts.categories']));



//====================================================================================================================
// Module:    jsonforms-material.renderers.layouts.categories.category
// Optimized: Yes
// File:      components/renderers/layouts/categories/category/category.js
//====================================================================================================================

(function (module) {

  //# sourceMappingURL=category.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/layouts/categories/category/category-renderer.js
//--------------------------------------------------------------------------------------------------------------------

  var MaterialCategoryRenderer = (function () {
      function MaterialCategoryRenderer(renderService) {
          this.renderService = renderService;
          this.priority = 10;
      }
      MaterialCategoryRenderer.prototype.render = function (element, subSchema, schemaPath, services) {
          var renderedElements = JSONForms.RenderDescriptionFactory.renderElements(element.elements, this.renderService, services);
          var label = element.label;
          var template = "\n        <!--\n            <md-tab label=\"{{element.label}}\">\n                <jsonforms-material-layout>\n                    <fieldset>\n                        <md-content layout-padding layout=\"column\">\n                            <dynamic-widget ng-repeat=\"child in element.elements\" element=\"child\"></dynamic-widget>\n                        </md-content>\n                    </fieldset>\n                </jsonforms-material-layout>\n            </md-tab>\n        -->\n        ";
          var result = JSONForms.RenderDescriptionFactory.createContainerDescription(99, renderedElements, template, services, element);
          result['label'] = label;
          return result;
      };
      MaterialCategoryRenderer.prototype.isApplicable = function (uiElement, jsonSchema, schemaPath) {
          return uiElement.type == "Category";
      };
      return MaterialCategoryRenderer;
  })();
  module.run(['RenderService', function (RenderService) {
          RenderService.register(new MaterialCategoryRenderer(RenderService));
      }]);
  //# sourceMappingURL=category-renderer.js.map

}) (angular.module ('jsonforms-material.renderers.layouts.categories.category', ['jsonforms-material.renderers.layouts.categories']));



//====================================================================================================================
// Module:    jsonforms-material.renderers.layouts.group
// Optimized: Yes
// File:      components/renderers/layouts/group/group.js
//====================================================================================================================

(function (module) {

  //# sourceMappingURL=group.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/layouts/group/group-renderer.js
//--------------------------------------------------------------------------------------------------------------------

  var MaterialGroupRenderer = (function () {
      function MaterialGroupRenderer(renderService) {
          this.renderService = renderService;
          this.priority = 10;
      }
      MaterialGroupRenderer.prototype.render = function (element, jsonSchema, schemaPath, services) {
          var renderedElements = JSONForms.RenderDescriptionFactory.renderElements(element.elements, this.renderService, services);
          var label = element.label ? element.label : "";
          var template = "\n        <jsonforms-material-layout class=\"jsf-group\">\n            <fieldset>\n                <legend>" + label + "</legend>\n                <div layout-padding layout=\"column\">\n                    <jsonforms-dynamic-widget ng-repeat=\"child in element.elements\" element=\"child\"></jsonforms-dynamic-widget>\n                </div>\n            </fieldset>\n        </jsonforms-material-layout>\n        ";
          return JSONForms.RenderDescriptionFactory.createContainerDescription(99, renderedElements, template, services, element);
      };
      MaterialGroupRenderer.prototype.isApplicable = function (uiElement, subSchema, schemaPath) {
          return uiElement.type == "Group";
      };
      return MaterialGroupRenderer;
  })();
  module.run(['RenderService', function (RenderService) {
          RenderService.register(new MaterialGroupRenderer(RenderService));
      }]);
  //# sourceMappingURL=group-renderer.js.map

}) (angular.module ('jsonforms-material.renderers.layouts.group', ['jsonforms-material.renderers.layouts']));



//====================================================================================================================
// Module:    jsonforms-material.renderers.layouts.vertical
// Optimized: Yes
// File:      components/renderers/layouts/vertical/vertical.js
//====================================================================================================================

(function (module) {

  //# sourceMappingURL=vertical.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/layouts/vertical/vertical-renderer.js
//--------------------------------------------------------------------------------------------------------------------

  var MaterialVerticalRenderer = (function () {
      function MaterialVerticalRenderer(renderService) {
          this.renderService = renderService;
          this.priority = 10;
      }
      MaterialVerticalRenderer.prototype.render = function (element, subSchema, schemaPath, services) {
          var renderedElements = JSONForms.RenderDescriptionFactory.renderElements(element.elements, this.renderService, services);
          var template = "\n            <jsonforms-material-layout>\n                <fieldset>\n                    <div layout-padding layout=\"column\">\n                        <jsonforms-dynamic-widget ng-repeat=\"child in element.elements\" element=\"child\"></jsonforms-dynamic-widget>\n                    </div>\n                </fieldset>\n            </jsonforms-material-layout>\n            ";
          return JSONForms.RenderDescriptionFactory.createContainerDescription(99, renderedElements, template, services, element);
      };
      MaterialVerticalRenderer.prototype.isApplicable = function (uiElement, jsonSchema, schemaPath) {
          return uiElement.type == "VerticalLayout";
      };
      return MaterialVerticalRenderer;
  })();
  module.run(['RenderService', function (RenderService) {
          RenderService.register(new MaterialVerticalRenderer(RenderService));
      }]);
  //# sourceMappingURL=vertical-renderer.js.map

}) (angular.module ('jsonforms-material.renderers.layouts.vertical', ['jsonforms-material.renderers.layouts']));



//====================================================================================================================
// Module:    jsonforms-material.renderers.layouts.horizontal
// Optimized: Yes
// File:      components/renderers/layouts/horizontal/horizontal.js
//====================================================================================================================

(function (module) {

  //# sourceMappingURL=horizontal.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/layouts/horizontal/horizontal-renderer.js
//--------------------------------------------------------------------------------------------------------------------

  var MaterialHorizontalRenderer = (function () {
      function MaterialHorizontalRenderer(renderService) {
          this.renderService = renderService;
          this.priority = 10;
      }
      MaterialHorizontalRenderer.prototype.render = function (element, subSchema, schemaPath, services) {
          var maxSize = 99;
          var renderedElements = JSONForms.RenderDescriptionFactory.renderElements(element.elements, this.renderService, services);
          var size = renderedElements.length;
          var individualSize = Math.floor(maxSize / size);
          for (var j = 0; j < renderedElements.length; j++) {
              renderedElements[j].size = individualSize;
          }
          var template = "\n        <jsonforms-material-layout>\n            <fieldset>\n                <div layout-padding layout=\"row\" layout-sm=\"column\">\n                    <jsonforms-dynamic-widget ng-repeat=\"child in element.elements\" element=\"child\"></jsonforms-dynamic-widget>\n                </div>\n            </fieldset>\n        </jsonforms-material-layout>\n        ";
          return JSONForms.RenderDescriptionFactory.createContainerDescription(maxSize, renderedElements, template, services, element);
      };
      ;
      MaterialHorizontalRenderer.prototype.isApplicable = function (uiElement, jsonSchema, schemaPath) {
          return uiElement.type == "HorizontalLayout";
      };
      return MaterialHorizontalRenderer;
  })();
  module.run(['RenderService', function (RenderService) {
          RenderService.register(new MaterialHorizontalRenderer(RenderService));
      }]);
  //# sourceMappingURL=horizontal-renderer.js.map

}) (angular.module ('jsonforms-material.renderers.layouts.horizontal', ['jsonforms-material.renderers.layouts']));



//====================================================================================================================
// Module:    jsonforms-material.renderers.controls
// Optimized: Yes
// File:      components/renderers/controls/controls.js
//====================================================================================================================

(function (module) {

  //# sourceMappingURL=controls.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/controls/controls-directive.js
//--------------------------------------------------------------------------------------------------------------------

  var MaterialControlDirective = (function () {
      function MaterialControlDirective() {
          this.restrict = "E";
          this.replace = true;
          this.transclude = true;
          this.templateUrl = 'components/renderers/controls/control.html';
      }
      return MaterialControlDirective;
  })();
  module.directive('jsonformsMaterialControl', function () { return new MaterialControlDirective; });
  //# sourceMappingURL=controls-directive.js.map

}) (angular.module ('jsonforms-material.renderers.controls', ['jsonforms.renderers']));



//====================================================================================================================
// Module:    jsonforms-material.renderers.controls.boolean
// Optimized: Yes
// File:      components/renderers/controls/boolean/boolean.js
//====================================================================================================================

(function (module) {

  var app = module;
  //# sourceMappingURL=boolean.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/controls/boolean/boolean-renderer.js
//--------------------------------------------------------------------------------------------------------------------

  var MaterialBooleanRenderer = (function () {
      function MaterialBooleanRenderer() {
          this.priority = 10;
      }
      MaterialBooleanRenderer.prototype.render = function (element, subSchema, schemaPath, services) {
          var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, element);
          var label = element.label ? element.label : "";
          control['template'] =
              "\n        <!--the css class is a temporary fix for https://github.com/angular/material/issues/1268-->\n        <md-input-container flex class=\"md-input-has-value\">\n            <label ng-if=\"element.label\" for=\"{{element.id}}\">{{element.label}}</label>\n            <md-checkbox id=\"" + schemaPath + "\" class=\"md-primary\" aria-label=\"{{element.label}}\" data-jsonforms-validation data-jsonforms-model/></md-checkbox>\n        </md-input-container>\n        ";
          return control;
      };
      MaterialBooleanRenderer.prototype.isApplicable = function (uiElement, subSchema, schemaPath) {
          return uiElement.type == 'Control' && subSchema !== undefined && subSchema.type == 'boolean';
      };
      return MaterialBooleanRenderer;
  })();
  module.run(['RenderService', function (RenderService) {
          RenderService.register(new MaterialBooleanRenderer());
      }]);
  //# sourceMappingURL=boolean-renderer.js.map

}) (angular.module ('jsonforms-material.renderers.controls.boolean', ['jsonforms-material.renderers.controls']));



//====================================================================================================================
// Module:    jsonforms-material.renderers.controls.datetime
// Optimized: Yes
// File:      components/renderers/controls/datetime/datetime.js
//====================================================================================================================

(function (module) {

  //# sourceMappingURL=datetime.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/controls/datetime/datetime-renderer.js
//--------------------------------------------------------------------------------------------------------------------

  var MaterialDatetimeRenderer = (function () {
      function MaterialDatetimeRenderer() {
          this.priority = 10;
      }
      MaterialDatetimeRenderer.prototype.render = function (element, subSchema, schemaPath, services) {
          var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, element);
          var label = element.label ? element.label : "";
          control['template'] =
              "\n        <!--the css class is a temporary fix for https://github.com/angular/material/issues/4233-->\n        <div flex class=\"material-jsf-input-container\">\n            <label ng-if=\"element.label\" for=\"{{element.id}}\">{{element.label}}</label>\n            <md-datepicker id=\"" + schemaPath + "\" data-jsonforms-model md-placeholder=\"{{element.label}}\"></md-datepicker>\n        </div>\n        ";
          return control;
      };
      MaterialDatetimeRenderer.prototype.isApplicable = function (uiElement, subSchema, schemaPath) {
          return uiElement.type == 'Control' && subSchema !== undefined && subSchema.type == "string" &&
              subSchema['format'] != undefined && subSchema['format'] == "date-time";
      };
      return MaterialDatetimeRenderer;
  })();
  module.run(['RenderService', function (RenderService) {
          RenderService.register(new MaterialDatetimeRenderer());
      }]);
  //# sourceMappingURL=datetime-renderer.js.map

}) (angular.module ('jsonforms-material.renderers.controls.datetime', ['jsonforms-material.renderers.controls']));



//====================================================================================================================
// Module:    jsonforms-material.renderers.controls.enum
// Optimized: Yes
// File:      components/renderers/controls/enum/enum.js
//====================================================================================================================

(function (module) {

  //# sourceMappingURL=enum.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/controls/enum/enum-renderer.js
//--------------------------------------------------------------------------------------------------------------------

  var MaterialEnumRenderer = (function () {
      function MaterialEnumRenderer(pathResolver) {
          this.pathResolver = pathResolver;
          this.priority = 11;
      }
      MaterialEnumRenderer.prototype.render = function (element, schema, schemaPath, services) {
          var subSchema = this.pathResolver.resolveSchema(schema, schemaPath);
          var enums = subSchema.enum;
          var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, element);
          control['template'] =
              "<md-input-container flex>\n            <label ng-if=\"element.label\" for=\"{{element.id}}\">{{element.label}}</label>\n            <md-select data-jsonforms-model aria-label=\"{{element.label}}\">\n              <md-option ng-repeat=\"option in element.options\" value=\"{{option}}\" id=\"" + schemaPath + "\">\n                {{option}}\n              </md-option>\n            </md-select>\n        </md-input-container>\n        ";
          control['options'] = enums;
          return control;
      };
      MaterialEnumRenderer.prototype.isApplicable = function (uiElement, subSchema, schemaPath) {
          return uiElement.type == 'Control' && subSchema !== undefined && subSchema.hasOwnProperty('enum');
      };
      return MaterialEnumRenderer;
  })();
  module.run(['RenderService', 'PathResolver', function (RenderService, PathResolver) {
          RenderService.register(new MaterialEnumRenderer(PathResolver));
      }]);
  //# sourceMappingURL=enum-renderer.js.map

}) (angular.module ('jsonforms-material.renderers.controls.enum', ['jsonforms-material.renderers.controls']));



//====================================================================================================================
// Module:    jsonforms-material.renderers.controls.integer
// Optimized: Yes
// File:      components/renderers/controls/integer/integer.js
//====================================================================================================================

(function (module) {

  //# sourceMappingURL=integer.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/controls/integer/integer-renderer.js
//--------------------------------------------------------------------------------------------------------------------

  var MaterialIntegerRenderer = (function () {
      function MaterialIntegerRenderer() {
          this.priority = 10;
      }
      MaterialIntegerRenderer.prototype.render = function (element, subSchema, schemaPath, services) {
          var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, element);
          control['template'] = "<jsonforms-material-control><input type=\"number\" step=\"1\" id=\"" + schemaPath + "\" aria-label=\"{{element.label}}\" data-jsonforms-validation data-jsonforms-model/></jsonforms-material-control>";
          return control;
      };
      MaterialIntegerRenderer.prototype.isApplicable = function (uiElement, subSchema, schemaPath) {
          return uiElement.type == 'Control' && subSchema !== undefined && subSchema.type == 'integer';
      };
      return MaterialIntegerRenderer;
  })();
  module.run(['RenderService', function (RenderService) {
          RenderService.register(new MaterialIntegerRenderer());
      }]);
  //# sourceMappingURL=integer-renderer.js.map

}) (angular.module ('jsonforms-material.renderers.controls.integer', ['jsonforms-material.renderers.controls']));



//====================================================================================================================
// Module:    jsonforms-material.renderers.controls.number
// Optimized: Yes
// File:      components/renderers/controls/number/number.js
//====================================================================================================================

(function (module) {

  //# sourceMappingURL=number.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/controls/number/number-renderer.js
//--------------------------------------------------------------------------------------------------------------------

  var MaterialNumberRenderer = (function () {
      function MaterialNumberRenderer() {
          this.priority = 10;
      }
      MaterialNumberRenderer.prototype.render = function (element, subSchema, schemaPath, services) {
          var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, element);
          control['template'] = "<jsonforms-material-control><input type=\"number\" step=\"0.01\" id=\"" + schemaPath + "\" aria-label=\"{{element.label}}\" data-jsonforms-validation data-jsonforms-model/></jsonforms-material-control>";
          return control;
      };
      MaterialNumberRenderer.prototype.isApplicable = function (uiElement, subSchema, schemaPath) {
          return uiElement.type == 'Control' && subSchema !== undefined && subSchema.type == 'number';
      };
      return MaterialNumberRenderer;
  })();
  module.run(['RenderService', function (RenderService) {
          RenderService.register(new MaterialNumberRenderer());
      }]);
  //# sourceMappingURL=number-renderer.js.map

}) (angular.module ('jsonforms-material.renderers.controls.number', ['jsonforms-material.renderers.controls']));



//====================================================================================================================
// Module:    jsonforms-material.renderers.controls.string
// Optimized: Yes
// File:      components/renderers/controls/string/string.js
//====================================================================================================================

(function (module) {

  //# sourceMappingURL=string.js.map
//--------------------------------------------------------------------------------------------------------------------
// File: components/renderers/controls/string/string-renderer.js
//--------------------------------------------------------------------------------------------------------------------

  var MaterialStringRenderer = (function () {
      function MaterialStringRenderer() {
          this.priority = 10;
      }
      MaterialStringRenderer.prototype.render = function (element, subSchema, schemaPath, services) {
          var control = JSONForms.RenderDescriptionFactory.createControlDescription(schemaPath, services, element);
          control['template'] = "<jsonforms-material-control><input type=\"text\" id=\"" + schemaPath + "\" aria-label=\"{{element.label}}\" data-jsonforms-model data-jsonforms-validation/></jsonforms-material-control>";
          return control;
      };
      MaterialStringRenderer.prototype.isApplicable = function (uiElement, subSchema, schemaPath) {
          return uiElement.type == 'Control' && subSchema !== undefined && subSchema.type == 'string';
      };
      MaterialStringRenderer.inject = ['RenderDescriptionFactory'];
      return MaterialStringRenderer;
  })();
  module.run(['RenderService', function (RenderService) {
          RenderService.register(new MaterialStringRenderer());
      }]);
  //# sourceMappingURL=string-renderer.js.map

}) (angular.module ('jsonforms-material.renderers.controls.string', ['jsonforms-material.renderers.controls']));



//====================================================================================================================
// Module:    jsonforms-material
// Optimized: Yes
// File:      components/app.js
//====================================================================================================================

//# sourceMappingURL=app.js.map
angular.module ('jsonforms-material', ['jsonforms', 'jsonforms.renderers', 'jsonforms-material.renderers.layouts', 'jsonforms-material.renderers.layouts.categories', 'jsonforms-material.renderers.layouts.categories.categorization', 'jsonforms-material.renderers.layouts.categories.category', 'jsonforms-material.renderers.layouts.group', 'jsonforms-material.renderers.layouts.vertical', 'jsonforms-material.renderers.layouts.horizontal', 'jsonforms-material.renderers.controls', 'jsonforms-material.renderers.controls.boolean', 'jsonforms-material.renderers.controls.datetime', 'jsonforms-material.renderers.controls.enum', 'jsonforms-material.renderers.controls.integer', 'jsonforms-material.renderers.controls.number', 'jsonforms-material.renderers.controls.string']);



// Source: temp/templates.js
angular.module('jsonforms-material').run(['$templateCache', function($templateCache) {
$templateCache.put('components/renderers/controls/control.html',
    "<md-input-container flex><label ng-if=\"element.label\" for=\"{{element.id}}\">{{element.label}}</label><ng-transclude></ng-transclude><div ng-messages=\"{{element.label}}.$error\" role=\"alert\"><div ng-repeat=\"errorMessage in element.alerts\"><!-- use ng-message-exp for a message whose key is given by an expression --><div ng-message-exp=\"errorMessage.type\">{{ errorMessage.msg }}</div></div></div></md-input-container>"
  );


  $templateCache.put('components/renderers/layouts/layout.html',
    "<div flex ng-transclude></div>"
  );

}]);
