/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v1.0.9
 */
(function( window, angular, undefined ){
"use strict";

/**
 * @ngdoc module
 * @name material.components.icon
 * @description
 * Icon
 */
angular.module('material.components.icon', ['material.core']);

angular
  .module('material.components.icon')
  .directive('mdIcon', ['$mdIcon', '$mdTheming', '$mdAria', mdIconDirective]);

/**
 * @ngdoc directive
 * @name mdIcon
 * @module material.components.icon
 *
 * @restrict E
 *
 * @description
 * The `md-icon` directive makes it easier to use vector-based icons in your app (as opposed to
 * raster-based icons types like PNG). The directive supports both icon fonts and SVG icons.
 *
 * Icons should be consider view-only elements that should not be used directly as buttons; instead nest a `<md-icon>`
 * inside a `md-button` to add hover and click features.
 *
 * ### Icon fonts
 * Icon fonts are a technique in which you use a font where the glyphs in the font are
 * your icons instead of text. Benefits include a straightforward way to bundle everything into a
 * single HTTP request, simple scaling, easy color changing, and more.
 *
 * `md-icon` lets you consume an icon font by letting you reference specific icons in that font
 * by name rather than character code.
 *
 * ### SVG
 * For SVGs, the problem with using `<img>` or a CSS `background-image` is that you can't take
 * advantage of some SVG features, such as styling specific parts of the icon with CSS or SVG
 * animation.
 *
 * `md-icon` makes it easier to use SVG icons by *inlining* the SVG into an `<svg>` element in the
 * document. The most straightforward way of referencing an SVG icon is via URL, just like a
 * traditional `<img>`. `$mdIconProvider`, as a convenience, lets you _name_ an icon so you can
 * reference it by name instead of URL throughout your templates.
 *
 * Additionally, you may not want to make separate HTTP requests for every icon, so you can bundle
 * your SVG icons together and pre-load them with $mdIconProvider as an icon set. An icon set can
 * also be given a name, which acts as a namespace for individual icons, so you can reference them
 * like `"social:cake"`.
 *
 * When using SVGs, both external SVGs (via URLs) or sets of SVGs [from icon sets] can be
 * easily loaded and used.When use font-icons, developers must following three (3) simple steps:
 *
 * <ol>
 * <li>Load the font library. e.g.<br/>
 *    &lt;link href="https://fonts.googleapis.com/icon?family=Material+Icons"
 *    rel="stylesheet"&gt;
 * </li>
 * <li> Use either (a) font-icon class names or (b) font ligatures to render the font glyph by using its textual name</li>
 * <li> Use &lt;md-icon md-font-icon="classname" /&gt; or <br/>
 *     use &lt;md-icon md-font-set="font library classname or alias"&gt; textual_name &lt;/md-icon&gt; or <br/>
 *     use &lt;md-icon md-font-set="font library classname or alias"&gt; numerical_character_reference &lt;/md-icon&gt;
 * </li>
 * </ol>
 *
 * Full details for these steps can be found:
 *
 * <ul>
 * <li>http://google.github.io/material-design-icons/</li>
 * <li>http://google.github.io/material-design-icons/#icon-font-for-the-web</li>
 * </ul>
 *
 * The Material Design icon style <code>.material-icons</code> and the icon font references are published in
 * Material Design Icons:
 *
 * <ul>
 * <li>http://www.google.com/design/icons/</li>
 * <li>https://www.google.com/design/icons/#ic_accessibility</li>
 * </ul>
 *
 * <h2 id="material_design_icons">Material Design Icons</h2>
 * Using the Material Design Icon-Selector, developers can easily and quickly search for a Material Design font-icon and
 * determine its textual name and character reference code. Click on any icon to see the slide-up information
 * panel with details regarding a SVG download or information on the font-icon usage.
 *
 * <a href="https://www.google.com/design/icons/#ic_accessibility" target="_blank" style="border-bottom:none;">
 * <img src="https://cloud.githubusercontent.com/assets/210413/7902490/fe8dd14c-0780-11e5-98fb-c821cc6475e6.png"
 *      aria-label="Material Design Icon-Selector" style="max-width:75%;padding-left:10%">
 * </a>
 *
 * <span class="image_caption">
 *  Click on the image above to link to the
 *  <a href="https://www.google.com/design/icons/#ic_accessibility" target="_blank">Material Design Icon-Selector</a>.
 * </span>
 *
 * @param {string} md-font-icon String name of CSS icon associated with the font-face will be used
 * to render the icon. Requires the fonts and the named CSS styles to be preloaded.
 * @param {string} md-font-set CSS style name associated with the font library; which will be assigned as
 * the class for the font-icon ligature. This value may also be an alias that is used to lookup the classname;
 * internally use `$mdIconProvider.fontSet(<alias>)` to determine the style name.
 * @param {string} md-svg-src String URL (or expression) used to load, cache, and display an
 *     external SVG.
 * @param {string} md-svg-icon md-svg-icon String name used for lookup of the icon from the internal cache;
 *     interpolated strings or expressions may also be used. Specific set names can be used with
 *     the syntax `<set name>:<icon name>`.<br/><br/>
 * To use icon sets, developers are required to pre-register the sets using the `$mdIconProvider` service.
 * @param {string=} aria-label Labels icon for accessibility. If an empty string is provided, icon
 * will be hidden from accessibility layer with `aria-hidden="true"`. If there's no aria-label on the icon
 * nor a label on the parent element, a warning will be logged to the console.
 * @param {string=} alt Labels icon for accessibility. If an empty string is provided, icon
 * will be hidden from accessibility layer with `aria-hidden="true"`. If there's no alt on the icon
 * nor a label on the parent element, a warning will be logged to the console.
 *
 * @usage
 * When using SVGs:
 * <hljs lang="html">
 *
 *  <!-- Icon ID; may contain optional icon set prefix; icons must registered using $mdIconProvider -->
 *  <md-icon md-svg-icon="social:android"    aria-label="android " ></md-icon>
 *
 *  <!-- Icon urls; may be preloaded in templateCache -->
 *  <md-icon md-svg-src="/android.svg"       aria-label="android " ></md-icon>
 *  <md-icon md-svg-src="{{ getAndroid() }}" aria-label="android " ></md-icon>
 *
 * </hljs>
 *
 * Use the <code>$mdIconProvider</code> to configure your application with
 * svg iconsets.
 *
 * <hljs lang="js">
 *  angular.module('appSvgIconSets', ['ngMaterial'])
 *    .controller('DemoCtrl', function($scope) {})
 *    .config(function($mdIconProvider) {
 *      $mdIconProvider
 *         .iconSet('social', 'img/icons/sets/social-icons.svg', 24)
 *         .defaultIconSet('img/icons/sets/core-icons.svg', 24);
 *     });
 * </hljs>
 *
 *
 * When using Font Icons with classnames:
 * <hljs lang="html">
 *
 *  <md-icon md-font-icon="android" aria-label="android" ></md-icon>
 *  <md-icon class="icon_home"      aria-label="Home"    ></md-icon>
 *
 * </hljs>
 *
 * When using Material Font Icons with ligatures:
 * <hljs lang="html">
 *  <!--
 *  For Material Design Icons
 *  The class '.material-icons' is auto-added if a style has NOT been specified
 *  since `material-icons` is the default fontset. So your markup:
 *  -->
 *  <md-icon> face </md-icon>
 *  <!-- becomes this at runtime: -->
 *  <md-icon md-font-set="material-icons"> face </md-icon>
 *  <!-- If the fontset does not support ligature names, then we need to use the ligature unicode.-->
 *  <md-icon> &#xE87C; </md-icon>
 *  <!-- The class '.material-icons' must be manually added if other styles are also specified-->
 *  <md-icon class="material-icons md-light md-48"> face </md-icon>
 * </hljs>
 *
 * When using other Font-Icon libraries:
 *
 * <hljs lang="js">
 *  // Specify a font-icon style alias
 *  angular.config(function($mdIconProvider) {
 *    $mdIconProvider.fontSet('md', 'material-icons');
 *  });
 * </hljs>
 *
 * <hljs lang="html">
 *  <md-icon md-font-set="md">favorite</md-icon>
 * </hljs>
 *
 */
function mdIconDirective($mdIcon, $mdTheming, $mdAria ) {

  return {
    restrict: 'E',
    link : postLink
  };


  /**
   * Directive postLink
   * Supports embedded SVGs, font-icons, & external SVGs
   */
  function postLink(scope, element, attr) {
    $mdTheming(element);

    prepareForFontIcon();

    // If using a font-icon, then the textual name of the icon itself
    // provides the aria-label.

    var label = attr.alt || attr.mdFontIcon || attr.mdSvgIcon || element.text();
    var attrName = attr.$normalize(attr.$attr.mdSvgIcon || attr.$attr.mdSvgSrc || '');

    if ( !attr['aria-label'] ) {

      if (label !== '' && !parentsHaveText() ) {

        $mdAria.expect(element, 'aria-label', label);
        $mdAria.expect(element, 'role', 'img');

      } else if ( !element.text() ) {
        // If not a font-icon with ligature, then
        // hide from the accessibility layer.

        $mdAria.expect(element, 'aria-hidden', 'true');
      }
    }

    if (attrName) {
      // Use either pre-configured SVG or URL source, respectively.
      attr.$observe(attrName, function(attrVal) {

        element.empty();
        if (attrVal) {
          $mdIcon(attrVal)
            .then(function(svg) {
              element.empty();
              element.append(svg);
            });
        }

      });
    }

    function parentsHaveText() {
      var parent = element.parent();
      if (parent.attr('aria-label') || parent.text()) {
        return true;
      }
      else if(parent.parent().attr('aria-label') || parent.parent().text()) {
        return true;
      }
      return false;
    }

    function prepareForFontIcon() {
      if (!attr.mdSvgIcon && !attr.mdSvgSrc) {
        if (attr.mdFontIcon) {
          element.addClass('md-font ' + attr.mdFontIcon);
        }
        element.addClass($mdIcon.fontSet(attr.mdFontSet));
      }
    }
  }
}

  angular
    .module('material.components.icon' )
    .provider('$mdIcon', MdIconProvider);

  /**
    * @ngdoc service
    * @name $mdIconProvider
    * @module material.components.icon
    *
    * @description
    * `$mdIconProvider` is used only to register icon IDs with URLs. These configuration features allow
    * icons and icon sets to be pre-registered and associated with source URLs **before** the `<md-icon />`
    * directives are compiled.
    *
    * If using font-icons, the developer is responsible for loading the fonts.
    *
    * If using SVGs, loading of the actual svg files are deferred to on-demand requests and are loaded
    * internally by the `$mdIcon` service using the `$http` service. When an SVG is requested by name/ID,
    * the `$mdIcon` service searches its registry for the associated source URL;
    * that URL is used to on-demand load and parse the SVG dynamically.
    *
    * **Notice:** Most font-icons libraries do not support ligatures (for example `fontawesome`).<br/>
    *  In such cases you are not able to use the icon's ligature name - Like so:
    *
    *  <hljs lang="html">
    *    <md-icon md-font-set="fa">fa-bell</md-icon>
    *  </hljs>
    *
    * You should instead use the given unicode, instead of the ligature name.
    *
    * <p ng-hide="true"> ##// Notice we can't use a hljs element here, because the characters will be escaped.</p>
    *  ```html
    *    <md-icon md-font-set="fa">&#xf0f3</md-icon>
    *  ```
    *
    * All unicode ligatures are prefixed with the `&#x` string.
    *
    * @usage
    * <hljs lang="js">
    *   app.config(function($mdIconProvider) {
    *
    *     // Configure URLs for icons specified by [set:]id.
    *
    *     $mdIconProvider
    *          .defaultFontSet( 'fa' )                   // This sets our default fontset className.
    *          .defaultIconSet('my/app/icons.svg')       // Register a default set of SVG icons
    *          .iconSet('social', 'my/app/social.svg')   // Register a named icon set of SVGs
    *          .icon('android', 'my/app/android.svg')    // Register a specific icon (by name)
    *          .icon('work:chair', 'my/app/chair.svg');  // Register icon in a specific set
    *   });
    * </hljs>
    *
    * SVG icons and icon sets can be easily pre-loaded and cached using either (a) a build process or (b) a runtime
    * **startup** process (shown below):
    *
    * <hljs lang="js">
    *   app.config(function($mdIconProvider) {
    *
    *     // Register a default set of SVG icon definitions
    *     $mdIconProvider.defaultIconSet('my/app/icons.svg')
    *
    *   })
    *   .run(function($http, $templateCache){
    *
    *     // Pre-fetch icons sources by URL and cache in the $templateCache...
    *     // subsequent $http calls will look there first.
    *
    *     var urls = [ 'imy/app/icons.svg', 'img/icons/android.svg'];
    *
    *     angular.forEach(urls, function(url) {
    *       $http.get(url, {cache: $templateCache});
    *     });
    *
    *   });
    *
    * </hljs>
    *
    * NOTE: the loaded SVG data is subsequently cached internally for future requests.
    *
    */

   /**
    * @ngdoc method
    * @name $mdIconProvider#icon
    *
    * @description
    * Register a source URL for a specific icon name; the name may include optional 'icon set' name prefix.
    * These icons  will later be retrieved from the cache using `$mdIcon( <icon name> )`
    *
    * @param {string} id Icon name/id used to register the icon
    * @param {string} url specifies the external location for the data file. Used internally by `$http` to load the
    * data or as part of the lookup in `$templateCache` if pre-loading was configured.
    * @param {number=} viewBoxSize Sets the width and height the icon's viewBox.
    * It is ignored for icons with an existing viewBox. Default size is 24.
    *
    * @returns {obj} an `$mdIconProvider` reference; used to support method call chains for the API
    *
    * @usage
    * <hljs lang="js">
    *   app.config(function($mdIconProvider) {
    *
    *     // Configure URLs for icons specified by [set:]id.
    *
    *     $mdIconProvider
    *          .icon('android', 'my/app/android.svg')    // Register a specific icon (by name)
    *          .icon('work:chair', 'my/app/chair.svg');  // Register icon in a specific set
    *   });
    * </hljs>
    *
    */
   /**
    * @ngdoc method
    * @name $mdIconProvider#iconSet
    *
    * @description
    * Register a source URL for a 'named' set of icons; group of SVG definitions where each definition
    * has an icon id. Individual icons can be subsequently retrieved from this cached set using
    * `$mdIcon(<icon set name>:<icon name>)`
    *
    * @param {string} id Icon name/id used to register the iconset
    * @param {string} url specifies the external location for the data file. Used internally by `$http` to load the
    * data or as part of the lookup in `$templateCache` if pre-loading was configured.
    * @param {number=} viewBoxSize Sets the width and height of the viewBox of all icons in the set.
    * It is ignored for icons with an existing viewBox. All icons in the icon set should be the same size.
    * Default value is 24.
    *
    * @returns {obj} an `$mdIconProvider` reference; used to support method call chains for the API
    *
    *
    * @usage
    * <hljs lang="js">
    *   app.config(function($mdIconProvider) {
    *
    *     // Configure URLs for icons specified by [set:]id.
    *
    *     $mdIconProvider
    *          .iconSet('social', 'my/app/social.svg')   // Register a named icon set
    *   });
    * </hljs>
    *
    */
   /**
    * @ngdoc method
    * @name $mdIconProvider#defaultIconSet
    *
    * @description
    * Register a source URL for the default 'named' set of icons. Unless explicitly registered,
    * subsequent lookups of icons will failover to search this 'default' icon set.
    * Icon can be retrieved from this cached, default set using `$mdIcon(<name>)`
    *
    * @param {string} url specifies the external location for the data file. Used internally by `$http` to load the
    * data or as part of the lookup in `$templateCache` if pre-loading was configured.
    * @param {number=} viewBoxSize Sets the width and height of the viewBox of all icons in the set.
    * It is ignored for icons with an existing viewBox. All icons in the icon set should be the same size.
    * Default value is 24.
    *
    * @returns {obj} an `$mdIconProvider` reference; used to support method call chains for the API
    *
    * @usage
    * <hljs lang="js">
    *   app.config(function($mdIconProvider) {
    *
    *     // Configure URLs for icons specified by [set:]id.
    *
    *     $mdIconProvider
    *          .defaultIconSet( 'my/app/social.svg' )   // Register a default icon set
    *   });
    * </hljs>
    *
    */
  /**
   * @ngdoc method
   * @name $mdIconProvider#defaultFontSet
   *
   * @description
   * When using Font-Icons, Angular Material assumes the the Material Design icons will be used and automatically
   * configures the default font-set == 'material-icons'. Note that the font-set references the font-icon library
   * class style that should be applied to the `<md-icon>`.
   *
   * Configuring the default means that the attributes
   * `md-font-set="material-icons"` or `class="material-icons"` do not need to be explicitly declared on the
   * `<md-icon>` markup. For example:
   *
   *  `<md-icon> face </md-icon>`
   *  will render as
   *  `<span class="material-icons"> face </span>`, and
   *
   *  `<md-icon md-font-set="fa"> face </md-icon>`
   *  will render as
   *  `<span class="fa"> face </span>`
   *
   * @param {string} name of the font-library style that should be applied to the md-icon DOM element
   *
   * @usage
   * <hljs lang="js">
   *   app.config(function($mdIconProvider) {
   *     $mdIconProvider.defaultFontSet( 'fa' );
   *   });
   * </hljs>
   *
   */

  /**
   * @ngdoc method
   * @name $mdIconProvider#fontSet
   *
   * @description
   * When using a font set for `<md-icon>` you must specify the correct font classname in the `md-font-set`
   * attribute. If the fonset className is really long, your markup may become cluttered... an easy
   * solution is to define an `alias` for your fontset:
   *
   * @param {string} alias of the specified fontset.
   * @param {string} className of the fontset.
   *
   * @usage
   * <hljs lang="js">
   *   app.config(function($mdIconProvider) {
   *     // In this case, we set an alias for the `material-icons` fontset.
   *     $mdIconProvider.fontSet('md', 'material-icons');
   *   });
   * </hljs>
   *
   */

   /**
    * @ngdoc method
    * @name $mdIconProvider#defaultViewBoxSize
    *
    * @description
    * While `<md-icon />` markup can also be style with sizing CSS, this method configures
    * the default width **and** height used for all icons; unless overridden by specific CSS.
    * The default sizing is (24px, 24px).
    * @param {number=} viewBoxSize Sets the width and height of the viewBox for an icon or an icon set.
    * All icons in a set should be the same size. The default value is 24.
    *
    * @returns {obj} an `$mdIconProvider` reference; used to support method call chains for the API
    *
    * @usage
    * <hljs lang="js">
    *   app.config(function($mdIconProvider) {
    *
    *     // Configure URLs for icons specified by [set:]id.
    *
    *     $mdIconProvider
    *          .defaultViewBoxSize(36)   // Register a default icon size (width == height)
    *   });
    * </hljs>
    *
    */

 var config = {
   defaultViewBoxSize: 24,
   defaultFontSet: 'material-icons',
   fontSets : [ ]
 };

 function MdIconProvider() { }

 MdIconProvider.prototype = {
   icon : function (id, url, viewBoxSize) {
     if ( id.indexOf(':') == -1 ) id = '$default:' + id;

     config[id] = new ConfigurationItem(url, viewBoxSize );
     return this;
   },

   iconSet : function (id, url, viewBoxSize) {
     config[id] = new ConfigurationItem(url, viewBoxSize );
     return this;
   },

   defaultIconSet : function (url, viewBoxSize) {
     var setName = '$default';

     if ( !config[setName] ) {
       config[setName] = new ConfigurationItem(url, viewBoxSize );
     }

     config[setName].viewBoxSize = viewBoxSize || config.defaultViewBoxSize;

     return this;
   },

   defaultViewBoxSize : function (viewBoxSize) {
     config.defaultViewBoxSize = viewBoxSize;
     return this;
   },

   /**
    * Register an alias name associated with a font-icon library style ;
    */
   fontSet : function fontSet(alias, className) {
    config.fontSets.push({
      alias : alias,
      fontSet : className || alias
    });
    return this;
   },

   /**
    * Specify a default style name associated with a font-icon library
    * fallback to Material Icons.
    *
    */
   defaultFontSet : function defaultFontSet(className) {
    config.defaultFontSet = !className ? '' : className;
    return this;
   },

   defaultIconSize : function defaultIconSize(iconSize) {
     config.defaultIconSize = iconSize;
     return this;
   },

   preloadIcons: function ($templateCache) {
     var iconProvider = this;
     var svgRegistry = [
       {
         id : 'md-tabs-arrow',
         url: 'md-tabs-arrow.svg',
         svg: '<svg version="1.1" x="0px" y="0px" viewBox="0 0 24 24"><g><polygon points="15.4,7.4 14,6 8,12 14,18 15.4,16.6 10.8,12 "/></g></svg>'
       },
       {
         id : 'md-close',
         url: 'md-close.svg',
         svg: '<svg version="1.1" x="0px" y="0px" viewBox="0 0 24 24"><g><path d="M19 6.41l-1.41-1.41-5.59 5.59-5.59-5.59-1.41 1.41 5.59 5.59-5.59 5.59 1.41 1.41 5.59-5.59 5.59 5.59 1.41-1.41-5.59-5.59z"/></g></svg>'
       },
       {
         id:  'md-cancel',
         url: 'md-cancel.svg',
         svg: '<svg version="1.1" x="0px" y="0px" viewBox="0 0 24 24"><g><path d="M12 2c-5.53 0-10 4.47-10 10s4.47 10 10 10 10-4.47 10-10-4.47-10-10-10zm5 13.59l-1.41 1.41-3.59-3.59-3.59 3.59-1.41-1.41 3.59-3.59-3.59-3.59 1.41-1.41 3.59 3.59 3.59-3.59 1.41 1.41-3.59 3.59 3.59 3.59z"/></g></svg>'
       },
       {
         id:  'md-menu',
         url: 'md-menu.svg',
         svg: '<svg version="1.1" x="0px" y="0px" viewBox="0 0 24 24"><path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" /></svg>'
       },
       {
         id:  'md-toggle-arrow',
         url: 'md-toggle-arrow-svg',
         svg: '<svg version="1.1" x="0px" y="0px" viewBox="0 0 48 48"><path d="M24 16l-12 12 2.83 2.83 9.17-9.17 9.17 9.17 2.83-2.83z"/><path d="M0 0h48v48h-48z" fill="none"/></svg>'
       },
       {
         id:  'md-calendar',
         url: 'md-calendar.svg',
         svg: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>'
       }
     ];

     svgRegistry.forEach(function(asset){
       iconProvider.icon(asset.id,  asset.url);
       $templateCache.put(asset.url, asset.svg);
     });

   },

   $get : ['$http', '$q', '$log', '$templateCache', '$mdUtil', function($http, $q, $log, $templateCache, $mdUtil) {
     this.preloadIcons($templateCache);
     return MdIconService(config, $http, $q, $log, $templateCache, $mdUtil);
   }]
 };

   /**
    *  Configuration item stored in the Icon registry; used for lookups
    *  to load if not already cached in the `loaded` cache
    */
   function ConfigurationItem(url, viewBoxSize) {
     this.url = url;
     this.viewBoxSize = viewBoxSize || config.defaultViewBoxSize;
   }

 /**
  * @ngdoc service
  * @name $mdIcon
  * @module material.components.icon
  *
  * @description
  * The `$mdIcon` service is a function used to lookup SVG icons.
  *
  * @param {string} id Query value for a unique Id or URL. If the argument is a URL, then the service will retrieve the icon element
  * from its internal cache or load the icon and cache it first. If the value is not a URL-type string, then an ID lookup is
  * performed. The Id may be a unique icon ID or may include an iconSet ID prefix.
  *
  * For the **id** query to work properly, this means that all id-to-URL mappings must have been previously configured
  * using the `$mdIconProvider`.
  *
  * @returns {obj} Clone of the initial SVG DOM element; which was created from the SVG markup in the SVG data file.
  *
  * @usage
  * <hljs lang="js">
  * function SomeDirective($mdIcon) {
  *
  *   // See if the icon has already been loaded, if not
  *   // then lookup the icon from the registry cache, load and cache
  *   // it for future requests.
  *   // NOTE: ID queries require configuration with $mdIconProvider
  *
  *   $mdIcon('android').then(function(iconEl)    { element.append(iconEl); });
  *   $mdIcon('work:chair').then(function(iconEl) { element.append(iconEl); });
  *
  *   // Load and cache the external SVG using a URL
  *
  *   $mdIcon('img/icons/android.svg').then(function(iconEl) {
  *     element.append(iconEl);
  *   });
  * };
  * </hljs>
  *
  * NOTE: The `<md-icon />  ` directive internally uses the `$mdIcon` service to query, loaded, and instantiate
  * SVG DOM elements.
  */

  /* ngInject */
 function MdIconService(config, $http, $q, $log, $templateCache, $mdUtil) {
   var iconCache = {};
   var urlRegex = /[-\w@:%\+.~#?&//=]{2,}\.[a-z]{2,4}\b(\/[-\w@:%\+.~#?&//=]*)?/i;
   var dataUrlRegex = /^data:image\/svg\+xml[\s*;\w\-\=]*?(base64)?,(.*)$/i;

   Icon.prototype = { clone : cloneSVG, prepare: prepareAndStyle };
   getIcon.fontSet = findRegisteredFontSet;

   // Publish service...
   return getIcon;

   /**
    * Actual $mdIcon service is essentially a lookup function
    */
   function getIcon(id) {
     id = id || '';

     // If already loaded and cached, use a clone of the cached icon.
     // Otherwise either load by URL, or lookup in the registry and then load by URL, and cache.

     if ( iconCache[id] ) return $q.when( transformClone(iconCache[id]) );
     if ( urlRegex.test(id) || dataUrlRegex.test(id) ) return loadByURL(id).then( cacheIcon(id) );
     if ( id.indexOf(':') == -1 ) id = '$default:' + id;

     var load = config[id] ? loadByID : loadFromIconSet;
     return load(id)
         .then( cacheIcon(id) );
   }

   /**
    * Lookup registered fontSet style using its alias...
    * If not found,
    */
   function findRegisteredFontSet(alias) {
      var useDefault = angular.isUndefined(alias) || !(alias && alias.length);
      if ( useDefault ) return config.defaultFontSet;

      var result = alias;
      angular.forEach(config.fontSets, function(it){
        if ( it.alias == alias ) result = it.fontSet || result;
      });

      return result;
   }

   function transformClone(cacheElement) {
     var clone = cacheElement.clone();
     var cacheSuffix = '_cache' + $mdUtil.nextUid();

     // We need to modify for each cached icon the id attributes.
     // This is needed because SVG id's are treated as normal DOM ids
     // and should not have a duplicated id.
     if (clone.id) clone.id += cacheSuffix;
     angular.forEach(clone.querySelectorAll('[id]'), function (item) {
       item.id += cacheSuffix;
     });

     return clone;
   }

   /**
    * Prepare and cache the loaded icon for the specified `id`
    */
   function cacheIcon( id ) {

     return function updateCache( icon ) {
       iconCache[id] = isIcon(icon) ? icon : new Icon(icon, config[id]);

       return iconCache[id].clone();
     };
   }

   /**
    * Lookup the configuration in the registry, if !registered throw an error
    * otherwise load the icon [on-demand] using the registered URL.
    *
    */
   function loadByID(id) {
    var iconConfig = config[id];
     return loadByURL(iconConfig.url).then(function(icon) {
       return new Icon(icon, iconConfig);
     });
   }

   /**
    *    Loads the file as XML and uses querySelector( <id> ) to find
    *    the desired node...
    */
   function loadFromIconSet(id) {
     var setName = id.substring(0, id.lastIndexOf(':')) || '$default';
     var iconSetConfig = config[setName];

     return !iconSetConfig ? announceIdNotFound(id) : loadByURL(iconSetConfig.url).then(extractFromSet);

     function extractFromSet(set) {
       var iconName = id.slice(id.lastIndexOf(':') + 1);
       var icon = set.querySelector('#' + iconName);
       return !icon ? announceIdNotFound(id) : new Icon(icon, iconSetConfig);
     }

     function announceIdNotFound(id) {
       var msg = 'icon ' + id + ' not found';
      $log.warn(msg);

       return $q.reject(msg || id);
     }
   }

   /**
    * Load the icon by URL (may use the $templateCache).
    * Extract the data for later conversion to Icon
    */
   function loadByURL(url) {
     /* Load the icon from embedded data URL. */
     function loadByDataUrl(url) {
       var results = dataUrlRegex.exec(url);
       var isBase64 = /base64/i.test(url);
       var data = isBase64 ? window.atob(results[2]) : results[2];
       return $q.when(angular.element(data)[0]);
     }

     /* Load the icon by URL using HTTP. */
     function loadByHttpUrl(url) {
       return $http
         .get(url, { cache: $templateCache })
         .then(function(response) {
           return angular.element('<div>').append(response.data).find('svg')[0];
         }).catch(announceNotFound);
     }

     return dataUrlRegex.test(url)
       ? loadByDataUrl(url)
       : loadByHttpUrl(url);
   }

   /**
    * Catch HTTP or generic errors not related to incorrect icon IDs.
    */
   function announceNotFound(err) {
     var msg = angular.isString(err) ? err : (err.message || err.data || err.statusText);
     $log.warn(msg);

     return $q.reject(msg);
   }

   /**
    * Check target signature to see if it is an Icon instance.
    */
   function isIcon(target) {
     return angular.isDefined(target.element) && angular.isDefined(target.config);
   }

   /**
    *  Define the Icon class
    */
   function Icon(el, config) {
     if (el && el.tagName != 'svg') {
       el = angular.element('<svg xmlns="http://www.w3.org/2000/svg">').append(el)[0];
     }

     // Inject the namespace if not available...
     if ( !el.getAttribute('xmlns') ) {
       el.setAttribute('xmlns', "http://www.w3.org/2000/svg");
     }

     this.element = el;
     this.config = config;
     this.prepare();
   }

   /**
    *  Prepare the DOM element that will be cached in the
    *  loaded iconCache store.
    */
   function prepareAndStyle() {
     var viewBoxSize = this.config ? this.config.viewBoxSize : config.defaultViewBoxSize;
         angular.forEach({
           'fit'   : '',
           'height': '100%',
           'width' : '100%',
           'preserveAspectRatio': 'xMidYMid meet',
           'viewBox' : this.element.getAttribute('viewBox') || ('0 0 ' + viewBoxSize + ' ' + viewBoxSize),
           'focusable': false // Disable IE11s default behavior to make SVGs focusable
         }, function(val, attr) {
           this.element.setAttribute(attr, val);
         }, this);
   }

   /**
    * Clone the Icon DOM element.
    */
   function cloneSVG(){
     // If the element or any of its children have a style attribute, then a CSP policy without
     // 'unsafe-inline' in the style-src directive, will result in a violation.
     return this.element.cloneNode(true);
   }

 }
 MdIconService.$inject = ["config", "$http", "$q", "$log", "$templateCache", "$mdUtil"];

})(window, window.angular);