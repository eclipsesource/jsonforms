/*!
 * Angular Material Design
 * https://github.com/angular/material
 * @license MIT
 * v1.0.9
 */
goog.provide('ng.material.components.autocomplete');
goog.require('ng.material.components.icon');
goog.require('ng.material.components.virtualRepeat');
goog.require('ng.material.core');
/**
 * @ngdoc module
 * @name material.components.autocomplete
 */
/*
 * @see js folder for autocomplete implementation
 */
angular.module('material.components.autocomplete', [
  'material.core',
  'material.components.icon',
  'material.components.virtualRepeat'
]);

angular
    .module('material.components.autocomplete')
    .controller('MdAutocompleteCtrl', MdAutocompleteCtrl);

var ITEM_HEIGHT   = 41,
    MAX_HEIGHT    = 5.5 * ITEM_HEIGHT,
    MENU_PADDING  = 8,
    INPUT_PADDING = 2; // Padding provided by `md-input-container`

function MdAutocompleteCtrl ($scope, $element, $mdUtil, $mdConstant, $mdTheming, $window,
                             $animate, $rootElement, $attrs, $q) {
  //-- private variables
  var ctrl                 = this,
      itemParts            = $scope.itemsExpr.split(/ in /i),
      itemExpr             = itemParts[ 1 ],
      elements             = null,
      cache                = {},
      noBlur               = false,
      selectedItemWatchers = [],
      hasFocus             = false,
      lastCount            = 0,
      fetchesInProgress    = 0;

  //-- public variables with handlers
  defineProperty('hidden', handleHiddenChange, true);

  //-- public variables
  ctrl.scope      = $scope;
  ctrl.parent     = $scope.$parent;
  ctrl.itemName   = itemParts[ 0 ];
  ctrl.matches    = [];
  ctrl.loading    = false;
  ctrl.hidden     = true;
  ctrl.index      = null;
  ctrl.messages   = [];
  ctrl.id         = $mdUtil.nextUid();
  ctrl.isDisabled = null;
  ctrl.isRequired = null;
  ctrl.isReadonly = null;
  ctrl.hasNotFound = false;

  //-- public methods
  ctrl.keydown                       = keydown;
  ctrl.blur                          = blur;
  ctrl.focus                         = focus;
  ctrl.clear                         = clearValue;
  ctrl.select                        = select;
  ctrl.listEnter                     = onListEnter;
  ctrl.listLeave                     = onListLeave;
  ctrl.mouseUp                       = onMouseup;
  ctrl.getCurrentDisplayValue        = getCurrentDisplayValue;
  ctrl.registerSelectedItemWatcher   = registerSelectedItemWatcher;
  ctrl.unregisterSelectedItemWatcher = unregisterSelectedItemWatcher;
  ctrl.notFoundVisible               = notFoundVisible;
  ctrl.loadingIsVisible              = loadingIsVisible;

  return init();

  //-- initialization methods

  /**
   * Initialize the controller, setup watchers, gather elements
   */
  function init () {
    $mdUtil.initOptionalProperties($scope, $attrs, { searchText: null, selectedItem: null });
    $mdTheming($element);
    configureWatchers();
    $mdUtil.nextTick(function () {
      gatherElements();
      moveDropdown();
      focusElement();
      $element.on('focus', focusElement);
    });
  }

  /**
   * Calculates the dropdown's position and applies the new styles to the menu element
   * @returns {*}
   */
  function positionDropdown () {
    if (!elements) return $mdUtil.nextTick(positionDropdown, false, $scope);
    var hrect  = elements.wrap.getBoundingClientRect(),
        vrect  = elements.snap.getBoundingClientRect(),
        root   = elements.root.getBoundingClientRect(),
        top    = vrect.bottom - root.top,
        bot    = root.bottom - vrect.top,
        left   = hrect.left - root.left,
        width  = hrect.width,
        offset = getVerticalOffset(),
        styles;
    // Adjust the width to account for the padding provided by `md-input-container`
    if ($attrs.mdFloatingLabel) {
      left += INPUT_PADDING;
      width -= INPUT_PADDING * 2;
    }
    styles = {
      left:     left + 'px',
      minWidth: width + 'px',
      maxWidth: Math.max(hrect.right - root.left, root.right - hrect.left) - MENU_PADDING + 'px'
    };
    if (top > bot && root.height - hrect.bottom - MENU_PADDING < MAX_HEIGHT) {
      styles.top       = 'auto';
      styles.bottom    = bot + 'px';
      styles.maxHeight = Math.min(MAX_HEIGHT, hrect.top - root.top - MENU_PADDING) + 'px';
    } else {
      styles.top       = (top - offset) + 'px';
      styles.bottom    = 'auto';
      styles.maxHeight = Math.min(MAX_HEIGHT, root.bottom + $mdUtil.scrollTop() - hrect.bottom - MENU_PADDING) + 'px';
    }

    elements.$.scrollContainer.css(styles);
    $mdUtil.nextTick(correctHorizontalAlignment, false);

    /**
     * Calculates the vertical offset for floating label examples to account for ngMessages
     * @returns {number}
     */
    function getVerticalOffset () {
      var offset = 0;
      var inputContainer = $element.find('md-input-container');
      if (inputContainer.length) {
        var input = inputContainer.find('input');
        offset = inputContainer.prop('offsetHeight');
        offset -= input.prop('offsetTop');
        offset -= input.prop('offsetHeight');
        // add in the height left up top for the floating label text
        offset += inputContainer.prop('offsetTop');
      }
      return offset;
    }

    /**
     * Makes sure that the menu doesn't go off of the screen on either side.
     */
    function correctHorizontalAlignment () {
      var dropdown = elements.scrollContainer.getBoundingClientRect(),
          styles   = {};
      if (dropdown.right > root.right - MENU_PADDING) {
        styles.left = (hrect.right - dropdown.width) + 'px';
      }
      elements.$.scrollContainer.css(styles);
    }
  }

  /**
   * Moves the dropdown menu to the body tag in order to avoid z-index and overflow issues.
   */
  function moveDropdown () {
    if (!elements.$.root.length) return;
    $mdTheming(elements.$.scrollContainer);
    elements.$.scrollContainer.detach();
    elements.$.root.append(elements.$.scrollContainer);
    if ($animate.pin) $animate.pin(elements.$.scrollContainer, $rootElement);
  }

  /**
   * Sends focus to the input element.
   */
  function focusElement () {
    if ($scope.autofocus) elements.input.focus();
  }

  /**
   * Sets up any watchers used by autocomplete
   */
  function configureWatchers () {
    var wait = parseInt($scope.delay, 10) || 0;
    $attrs.$observe('disabled', function (value) { ctrl.isDisabled = $mdUtil.parseAttributeBoolean(value, false); });
    $attrs.$observe('required', function (value) { ctrl.isRequired = $mdUtil.parseAttributeBoolean(value, false); });
    $attrs.$observe('readonly', function (value) { ctrl.isReadonly = $mdUtil.parseAttributeBoolean(value, false); });
    $scope.$watch('searchText', wait ? $mdUtil.debounce(handleSearchText, wait) : handleSearchText);
    $scope.$watch('selectedItem', selectedItemChange);
    angular.element($window).on('resize', positionDropdown);
    $scope.$on('$destroy', cleanup);
  }

  /**
   * Removes any events or leftover elements created by this controller
   */
  function cleanup () {
    if(!ctrl.hidden) {
      $mdUtil.enableScrolling();
    }

    angular.element($window).off('resize', positionDropdown);
    if ( elements ){
      var items = 'ul scroller scrollContainer input'.split(' ');
      angular.forEach(items, function(key){
        elements.$[key].remove();
      });
    }
  }

  /**
   * Gathers all of the elements needed for this controller
   */
  function gatherElements () {
    elements = {
      main:  $element[0],
      scrollContainer: $element[0].getElementsByClassName('md-virtual-repeat-container')[0],
      scroller: $element[0].getElementsByClassName('md-virtual-repeat-scroller')[0],
      ul:    $element.find('ul')[0],
      input: $element.find('input')[0],
      wrap:  $element.find('md-autocomplete-wrap')[0],
      root:  document.body
    };
    elements.li   = elements.ul.getElementsByTagName('li');
    elements.snap = getSnapTarget();
    elements.$    = getAngularElements(elements);
  }

  /**
   * Finds the element that the menu will base its position on
   * @returns {*}
   */
  function getSnapTarget () {
    for (var element = $element; element.length; element = element.parent()) {
      if (angular.isDefined(element.attr('md-autocomplete-snap'))) return element[ 0 ];
    }
    return elements.wrap;
  }

  /**
   * Gathers angular-wrapped versions of each element
   * @param elements
   * @returns {{}}
   */
  function getAngularElements (elements) {
    var obj = {};
    for (var key in elements) {
      if (elements.hasOwnProperty(key)) obj[ key ] = angular.element(elements[ key ]);
    }
    return obj;
  }

  //-- event/change handlers

  /**
   * Handles changes to the `hidden` property.
   * @param hidden
   * @param oldHidden
   */
  function handleHiddenChange (hidden, oldHidden) {
    if (!hidden && oldHidden) {
      positionDropdown();

      if (elements) {
        $mdUtil.nextTick(function () {
          $mdUtil.disableScrollAround(elements.ul);
        }, false, $scope);
      }
    } else if (hidden && !oldHidden) {
      $mdUtil.nextTick(function () {
        $mdUtil.enableScrolling();
      }, false, $scope);
    }
  }

  /**
   * When the user mouses over the dropdown menu, ignore blur events.
   */
  function onListEnter () {
    noBlur = true;
  }

  /**
   * When the user's mouse leaves the menu, blur events may hide the menu again.
   */
  function onListLeave () {
    if (!hasFocus) elements.input.focus();
    noBlur = false;
    ctrl.hidden = shouldHide();
  }

  /**
   * When the mouse button is released, send focus back to the input field.
   */
  function onMouseup () {
    elements.input.focus();
  }

  /**
   * Handles changes to the selected item.
   * @param selectedItem
   * @param previousSelectedItem
   */
  function selectedItemChange (selectedItem, previousSelectedItem) {
    if (selectedItem) {
      getDisplayValue(selectedItem).then(function (val) {
        $scope.searchText = val;
        handleSelectedItemChange(selectedItem, previousSelectedItem);
      });
    }

    if (selectedItem !== previousSelectedItem) announceItemChange();
  }

  /**
   * Use the user-defined expression to announce changes each time a new item is selected
   */
  function announceItemChange () {
    angular.isFunction($scope.itemChange) && $scope.itemChange(getItemAsNameVal($scope.selectedItem));
  }

  /**
   * Use the user-defined expression to announce changes each time the search text is changed
   */
  function announceTextChange () {
    angular.isFunction($scope.textChange) && $scope.textChange();
  }

  /**
   * Calls any external watchers listening for the selected item.  Used in conjunction with
   * `registerSelectedItemWatcher`.
   * @param selectedItem
   * @param previousSelectedItem
   */
  function handleSelectedItemChange (selectedItem, previousSelectedItem) {
    selectedItemWatchers.forEach(function (watcher) { watcher(selectedItem, previousSelectedItem); });
  }

  /**
   * Register a function to be called when the selected item changes.
   * @param cb
   */
  function registerSelectedItemWatcher (cb) {
    if (selectedItemWatchers.indexOf(cb) == -1) {
      selectedItemWatchers.push(cb);
    }
  }

  /**
   * Unregister a function previously registered for selected item changes.
   * @param cb
   */
  function unregisterSelectedItemWatcher (cb) {
    var i = selectedItemWatchers.indexOf(cb);
    if (i != -1) {
      selectedItemWatchers.splice(i, 1);
    }
  }

  /**
   * Handles changes to the searchText property.
   * @param searchText
   * @param previousSearchText
   */
  function handleSearchText (searchText, previousSearchText) {
    ctrl.index = getDefaultIndex();
    // do nothing on init
    if (searchText === previousSearchText) return;

    getDisplayValue($scope.selectedItem).then(function (val) {
      // clear selected item if search text no longer matches it
      if (searchText !== val) {
        $scope.selectedItem = null;

        // trigger change event if available
        if (searchText !== previousSearchText) announceTextChange();

        // cancel results if search text is not long enough
        if (!isMinLengthMet()) {
          ctrl.matches = [];
          setLoading(false);
          updateMessages();
        } else {
          handleQuery();
        }
      }
    });

  }

  /**
   * Handles input blur event, determines if the dropdown should hide.
   */
  function blur () {
    hasFocus = false;
    if (!noBlur) {
      ctrl.hidden = shouldHide();
    }
  }

  /**
   * Force blur on input element
   * @param forceBlur
   */
  function doBlur(forceBlur) {
    if (forceBlur) {
      noBlur = false;
      hasFocus = false;
    }
    elements.input.blur();
  }

  /**
   * Handles input focus event, determines if the dropdown should show.
   */
  function focus () {
    hasFocus = true;
    //-- if searchText is null, let's force it to be a string
    if (!angular.isString($scope.searchText)) $scope.searchText = '';
    ctrl.hidden = shouldHide();
    if (!ctrl.hidden) handleQuery();
  }

  /**
   * Handles keyboard input.
   * @param event
   */
  function keydown (event) {
    switch (event.keyCode) {
      case $mdConstant.KEY_CODE.DOWN_ARROW:
        if (ctrl.loading) return;
        event.stopPropagation();
        event.preventDefault();
        ctrl.index   = Math.min(ctrl.index + 1, ctrl.matches.length - 1);
        updateScroll();
        updateMessages();
        break;
      case $mdConstant.KEY_CODE.UP_ARROW:
        if (ctrl.loading) return;
        event.stopPropagation();
        event.preventDefault();
        ctrl.index   = ctrl.index < 0 ? ctrl.matches.length - 1 : Math.max(0, ctrl.index - 1);
        updateScroll();
        updateMessages();
        break;
      case $mdConstant.KEY_CODE.TAB:
        // If we hit tab, assume that we've left the list so it will close
        onListLeave();

        if (ctrl.hidden || ctrl.loading || ctrl.index < 0 || ctrl.matches.length < 1) return;
        select(ctrl.index);
        break;
      case $mdConstant.KEY_CODE.ENTER:
        if (ctrl.hidden || ctrl.loading || ctrl.index < 0 || ctrl.matches.length < 1) return;
        if (hasSelection()) return;
        event.stopPropagation();
        event.preventDefault();
        select(ctrl.index);
        break;
      case $mdConstant.KEY_CODE.ESCAPE:
        event.stopPropagation();
        event.preventDefault();
        clearValue();

        // Force the component to blur if they hit escape
        doBlur(true);

        break;
      default:
    }
  }

  //-- getters

  /**
   * Returns the minimum length needed to display the dropdown.
   * @returns {*}
   */
  function getMinLength () {
    return angular.isNumber($scope.minLength) ? $scope.minLength : 1;
  }

  /**
   * Returns the display value for an item.
   * @param item
   * @returns {*}
   */
  function getDisplayValue (item) {
    return $q.when(getItemText(item) || item);

    /**
     * Getter function to invoke user-defined expression (in the directive)
     * to convert your object to a single string.
     */
    function getItemText (item) {
      return (item && $scope.itemText) ? $scope.itemText(getItemAsNameVal(item)) : null;
    }
  }

  /**
   * Returns the locals object for compiling item templates.
   * @param item
   * @returns {{}}
   */
  function getItemAsNameVal (item) {
    if (!item) return undefined;

    var locals = {};
    if (ctrl.itemName) locals[ ctrl.itemName ] = item;

    return locals;
  }

  /**
   * Returns the default index based on whether or not autoselect is enabled.
   * @returns {number}
   */
  function getDefaultIndex () {
    return $scope.autoselect ? 0 : -1;
  }

  /**
   * Sets the loading parameter and updates the hidden state.
   * @param value {boolean} Whether or not the component is currently loading.
   */
  function setLoading(value) {
    if (ctrl.loading != value) {
      ctrl.loading = value;
    }

    // Always refresh the hidden variable as something else might have changed
    ctrl.hidden = shouldHide();
  }

  /**
   * Determines if the menu should be hidden.
   * @returns {boolean}
   */
  function shouldHide () {
    if (ctrl.loading && !hasMatches()) return true; // Hide while loading initial matches
    else if (hasSelection()) return true;           // Hide if there is already a selection
    else if (!hasFocus) return true;                // Hide if the input does not have focus
    else return !shouldShow();                      // Defer to standard show logic
  }

  /**
   * Determines if the menu should be shown.
   * @returns {boolean}
   */
  function shouldShow() {
    return (isMinLengthMet() && hasMatches()) || notFoundVisible();
  }

  /**
   * Returns true if the search text has matches.
   * @returns {boolean}
   */
  function hasMatches() {
    return ctrl.matches.length ? true : false;
  }

  /**
   * Returns true if the autocomplete has a valid selection.
   * @returns {boolean}
   */
  function hasSelection() {
    return ctrl.scope.selectedItem ? true : false;
  }

  /**
   * Returns true if the loading indicator is, or should be, visible.
   * @returns {boolean}
   */
  function loadingIsVisible() {
    return ctrl.loading && !hasSelection();
  }

  /**
   * Returns the display value of the current item.
   * @returns {*}
   */
  function getCurrentDisplayValue () {
    return getDisplayValue(ctrl.matches[ ctrl.index ]);
  }

  /**
   * Determines if the minimum length is met by the search text.
   * @returns {*}
   */
  function isMinLengthMet () {
    return ($scope.searchText || '').length >= getMinLength();
  }

  //-- actions

  /**
   * Defines a public property with a handler and a default value.
   * @param key
   * @param handler
   * @param value
   */
  function defineProperty (key, handler, value) {
    Object.defineProperty(ctrl, key, {
      get: function () { return value; },
      set: function (newValue) {
        var oldValue = value;
        value        = newValue;
        handler(newValue, oldValue);
      }
    });
  }

  /**
   * Selects the item at the given index.
   * @param index
   */
  function select (index) {
    //-- force form to update state for validation
    $mdUtil.nextTick(function () {
      getDisplayValue(ctrl.matches[ index ]).then(function (val) {
        var ngModel = elements.$.input.controller('ngModel');
        ngModel.$setViewValue(val);
        ngModel.$render();
      }).finally(function () {
        $scope.selectedItem = ctrl.matches[ index ];
        setLoading(false);
      });
    }, false);
  }

  /**
   * Clears the searchText value and selected item.
   */
  function clearValue () {
    // Set the loading to true so we don't see flashes of content.
    // The flashing will only occour when an async request is running.
    // So the loading process will stop when the results had been retrieved.
    setLoading(true);

    // Reset our variables
    ctrl.index = 0;
    ctrl.matches = [];
    $scope.searchText = '';

    // Per http://www.w3schools.com/jsref/event_oninput.asp
    var eventObj = document.createEvent('CustomEvent');
    eventObj.initCustomEvent('input', true, true, { value: $scope.searchText });
    elements.input.dispatchEvent(eventObj);

    elements.input.focus();
  }

  /**
   * Fetches the results for the provided search text.
   * @param searchText
   */
  function fetchResults (searchText) {
    var items = $scope.$parent.$eval(itemExpr),
        term  = searchText.toLowerCase(),
        isList = angular.isArray(items),
        isPromise = !!items.then; // Every promise should contain a `then` property

    if (isList) handleResults(items);
    else if (isPromise) handleAsyncResults(items);

    function handleAsyncResults(items) {
      if ( !items ) return;

      items = $q.when(items);
      fetchesInProgress++;
      setLoading(true);

      $mdUtil.nextTick(function () {
          items
            .then(handleResults)
            .finally(function(){
              if (--fetchesInProgress === 0) {
                setLoading(false);
              }
            });
      },true, $scope);
    }

    function handleResults (matches) {
      cache[ term ] = matches;
      if ((searchText || '') !== ($scope.searchText || '')) return; //-- just cache the results if old request

      ctrl.matches = matches;
      ctrl.hidden  = shouldHide();

      // If loading is in progress, then we'll end the progress. This is needed for example,
      // when the `clear` button was clicked, because there we always show the loading process, to prevent flashing.
      if (ctrl.loading) setLoading(false);

      if ($scope.selectOnMatch) selectItemOnMatch();

      updateMessages();
      positionDropdown();
    }
  }

  /**
   * Updates the ARIA messages
   */
  function updateMessages () {
    getCurrentDisplayValue().then(function (msg) {
      ctrl.messages = [ getCountMessage(), msg ];
    });
  }

  /**
   * Returns the ARIA message for how many results match the current query.
   * @returns {*}
   */
  function getCountMessage () {
    if (lastCount === ctrl.matches.length) return '';
    lastCount = ctrl.matches.length;
    switch (ctrl.matches.length) {
      case 0:
        return 'There are no matches available.';
      case 1:
        return 'There is 1 match available.';
      default:
        return 'There are ' + ctrl.matches.length + ' matches available.';
    }
  }

  /**
   * Makes sure that the focused element is within view.
   */
  function updateScroll () {
    if (!elements.li[0]) return;
    var height = elements.li[0].offsetHeight,
        top = height * ctrl.index,
        bot = top + height,
        hgt = elements.scroller.clientHeight,
        scrollTop = elements.scroller.scrollTop;
    if (top < scrollTop) {
      scrollTo(top);
    } else if (bot > scrollTop + hgt) {
      scrollTo(bot - hgt);
    }
  }

  function isPromiseFetching() {
    return fetchesInProgress !== 0;
  }

  function scrollTo (offset) {
    elements.$.scrollContainer.controller('mdVirtualRepeatContainer').scrollTo(offset);
  }

  function notFoundVisible () {
    var textLength = (ctrl.scope.searchText || '').length;

    return ctrl.hasNotFound && !hasMatches() && (!ctrl.loading || isPromiseFetching()) && textLength >= getMinLength() && (hasFocus || noBlur) && !hasSelection();
  }

  /**
   * Starts the query to gather the results for the current searchText.  Attempts to return cached
   * results first, then forwards the process to `fetchResults` if necessary.
   */
  function handleQuery () {
    var searchText = $scope.searchText || '',
        term       = searchText.toLowerCase();
    //-- if results are cached, pull in cached results
    if (!$scope.noCache && cache[ term ]) {
      ctrl.matches = cache[ term ];
      updateMessages();
    } else {
      fetchResults(searchText);
    }

    ctrl.hidden = shouldHide();
  }

  /**
   * If there is only one matching item and the search text matches its display value exactly,
   * automatically select that item.  Note: This function is only called if the user uses the
   * `md-select-on-match` flag.
   */
  function selectItemOnMatch () {
    var searchText = $scope.searchText,
        matches    = ctrl.matches,
        item       = matches[ 0 ];
    if (matches.length === 1) getDisplayValue(item).then(function (displayValue) {
      var isMatching = searchText == displayValue;
      if ($scope.matchInsensitive && !isMatching) {
        isMatching = searchText.toLowerCase() == displayValue.toLowerCase();
      }

      if (isMatching) select(0);
    });
  }

}
MdAutocompleteCtrl.$inject = ["$scope", "$element", "$mdUtil", "$mdConstant", "$mdTheming", "$window", "$animate", "$rootElement", "$attrs", "$q"];

angular
    .module('material.components.autocomplete')
    .directive('mdAutocomplete', MdAutocomplete);

/**
 * @ngdoc directive
 * @name mdAutocomplete
 * @module material.components.autocomplete
 *
 * @description
 * `<md-autocomplete>` is a special input component with a drop-down of all possible matches to a
 *     custom query. This component allows you to provide real-time suggestions as the user types
 *     in the input area.
 *
 * To start, you will need to specify the required parameters and provide a template for your
 *     results. The content inside `md-autocomplete` will be treated as a template.
 *
 * In more complex cases, you may want to include other content such as a message to display when
 *     no matches were found.  You can do this by wrapping your template in `md-item-template` and
 *     adding a tag for `md-not-found`.  An example of this is shown below.
 *
 * ### Validation
 *
 * You can use `ng-messages` to include validation the same way that you would normally validate;
 *     however, if you want to replicate a standard input with a floating label, you will have to
 *     do the following:
 *
 * - Make sure that your template is wrapped in `md-item-template`
 * - Add your `ng-messages` code inside of `md-autocomplete`
 * - Add your validation properties to `md-autocomplete` (ie. `required`)
 * - Add a `name` to `md-autocomplete` (to be used on the generated `input`)
 *
 * There is an example below of how this should look.
 *
 *
 * @param {expression} md-items An expression in the format of `item in items` to iterate over
 *     matches for your search.
 * @param {expression=} md-selected-item-change An expression to be run each time a new item is
 *     selected
 * @param {expression=} md-search-text-change An expression to be run each time the search text
 *     updates
 * @param {expression=} md-search-text A model to bind the search query text to
 * @param {object=} md-selected-item A model to bind the selected item to
 * @param {expression=} md-item-text An expression that will convert your object to a single string.
 * @param {string=} placeholder Placeholder text that will be forwarded to the input.
 * @param {boolean=} md-no-cache Disables the internal caching that happens in autocomplete
 * @param {boolean=} ng-disabled Determines whether or not to disable the input field
 * @param {number=} md-min-length Specifies the minimum length of text before autocomplete will
 *     make suggestions
 * @param {number=} md-delay Specifies the amount of time (in milliseconds) to wait before looking
 *     for results
 * @param {boolean=} md-autofocus If true, the autocomplete will be automatically focused when a `$mdDialog`,
 *     `$mdBottomsheet` or `$mdSidenav`, which contains the autocomplete, is opening. <br/><br/>
 *     Also the autocomplete will immediately focus the input element.
 * @param {boolean=} md-no-asterisk When present, asterisk will not be appended to the floating label
 * @param {boolean=} md-autoselect If true, the first item will be selected by default
 * @param {string=} md-menu-class This will be applied to the dropdown menu for styling
 * @param {string=} md-floating-label This will add a floating label to autocomplete and wrap it in
 *     `md-input-container`
 * @param {string=} md-input-name The name attribute given to the input element to be used with
 *     FormController
 * @param {string=} md-select-on-focus When present the inputs text will be automatically selected
 *     on focus.
 * @param {string=} md-input-id An ID to be added to the input element
 * @param {number=} md-input-minlength The minimum length for the input's value for validation
 * @param {number=} md-input-maxlength The maximum length for the input's value for validation
 * @param {boolean=} md-select-on-match When set, autocomplete will automatically select exact
 *     the item if the search text is an exact match
 * @param {boolean=} md-match-case-insensitive When set and using `md-select-on-match`, autocomplete
 *     will select on case-insensitive match
 *
 * @usage
 * ### Basic Example
 * <hljs lang="html">
 *   <md-autocomplete
 *       md-selected-item="selectedItem"
 *       md-search-text="searchText"
 *       md-items="item in getMatches(searchText)"
 *       md-item-text="item.display">
 *     <span md-highlight-text="searchText">{{item.display}}</span>
 *   </md-autocomplete>
 * </hljs>
 *
 * ### Example with "not found" message
 * <hljs lang="html">
 * <md-autocomplete
 *     md-selected-item="selectedItem"
 *     md-search-text="searchText"
 *     md-items="item in getMatches(searchText)"
 *     md-item-text="item.display">
 *   <md-item-template>
 *     <span md-highlight-text="searchText">{{item.display}}</span>
 *   </md-item-template>
 *   <md-not-found>
 *     No matches found.
 *   </md-not-found>
 * </md-autocomplete>
 * </hljs>
 *
 * In this example, our code utilizes `md-item-template` and `md-not-found` to specify the
 *     different parts that make up our component.
 *
 * ### Example with validation
 * <hljs lang="html">
 * <form name="autocompleteForm">
 *   <md-autocomplete
 *       required
 *       md-input-name="autocomplete"
 *       md-selected-item="selectedItem"
 *       md-search-text="searchText"
 *       md-items="item in getMatches(searchText)"
 *       md-item-text="item.display">
 *     <md-item-template>
 *       <span md-highlight-text="searchText">{{item.display}}</span>
 *     </md-item-template>
 *     <div ng-messages="autocompleteForm.autocomplete.$error">
 *       <div ng-message="required">This field is required</div>
 *     </div>
 *   </md-autocomplete>
 * </form>
 * </hljs>
 *
 * In this example, our code utilizes `md-item-template` and `md-not-found` to specify the
 *     different parts that make up our component.
 */

function MdAutocomplete () {

  return {
    controller:   'MdAutocompleteCtrl',
    controllerAs: '$mdAutocompleteCtrl',
    scope:        {
      inputName:        '@mdInputName',
      inputMinlength:   '@mdInputMinlength',
      inputMaxlength:   '@mdInputMaxlength',
      searchText:       '=?mdSearchText',
      selectedItem:     '=?mdSelectedItem',
      itemsExpr:        '@mdItems',
      itemText:         '&mdItemText',
      placeholder:      '@placeholder',
      noCache:          '=?mdNoCache',
      selectOnMatch:    '=?mdSelectOnMatch',
      matchInsensitive: '=?mdMatchCaseInsensitive',
      itemChange:       '&?mdSelectedItemChange',
      textChange:       '&?mdSearchTextChange',
      minLength:        '=?mdMinLength',
      delay:            '=?mdDelay',
      autofocus:        '=?mdAutofocus',
      floatingLabel:    '@?mdFloatingLabel',
      autoselect:       '=?mdAutoselect',
      menuClass:        '@?mdMenuClass',
      inputId:          '@?mdInputId'
    },
    link: function(scope, element, attrs, controller) {
      // Retrieve the state of using a md-not-found template by using our attribute, which will
      // be added to the element in the template function.
      controller.hasNotFound = !!element.attr('md-has-not-found');
    },
    template:     function (element, attr) {
      var noItemsTemplate = getNoItemsTemplate(),
          itemTemplate    = getItemTemplate(),
          leftover        = element.html(),
          tabindex        = attr.tabindex;

      // Set our attribute for the link function above which runs later.
      // We will set an attribute, because otherwise the stored variables will be trashed when
      // removing the element is hidden while retrieving the template. For example when using ngIf.
      if (noItemsTemplate) element.attr('md-has-not-found', true);

      // Always set our tabindex of the autocomplete directive to -1, because our input
      // will hold the actual tabindex.
      element.attr('tabindex', '-1');

      return '\
        <md-autocomplete-wrap\
            layout="row"\
            ng-class="{ \'md-whiteframe-z1\': !floatingLabel, \'md-menu-showing\': !$mdAutocompleteCtrl.hidden }"\
            role="listbox">\
          ' + getInputElement() + '\
          <md-progress-linear\
              class="' + (attr.mdFloatingLabel ? 'md-inline' : '') + '"\
              ng-if="$mdAutocompleteCtrl.loadingIsVisible()"\
              md-mode="indeterminate"></md-progress-linear>\
          <md-virtual-repeat-container\
              md-auto-shrink\
              md-auto-shrink-min="1"\
              ng-mouseenter="$mdAutocompleteCtrl.listEnter()"\
              ng-mouseleave="$mdAutocompleteCtrl.listLeave()"\
              ng-mouseup="$mdAutocompleteCtrl.mouseUp()"\
              ng-hide="$mdAutocompleteCtrl.hidden"\
              class="md-autocomplete-suggestions-container md-whiteframe-z1"\
              ng-class="{ \'md-not-found\': $mdAutocompleteCtrl.notFoundVisible() }"\
              role="presentation">\
            <ul class="md-autocomplete-suggestions"\
                ng-class="::menuClass"\
                id="ul-{{$mdAutocompleteCtrl.id}}">\
              <li md-virtual-repeat="item in $mdAutocompleteCtrl.matches"\
                  ng-class="{ selected: $index === $mdAutocompleteCtrl.index }"\
                  ng-click="$mdAutocompleteCtrl.select($index)"\
                  md-extra-name="$mdAutocompleteCtrl.itemName">\
                  ' + itemTemplate + '\
                  </li>' + noItemsTemplate + '\
            </ul>\
          </md-virtual-repeat-container>\
        </md-autocomplete-wrap>\
        <aria-status\
            class="md-visually-hidden"\
            role="status"\
            aria-live="assertive">\
          <p ng-repeat="message in $mdAutocompleteCtrl.messages track by $index" ng-if="message">{{message}}</p>\
        </aria-status>';

      function getItemTemplate() {
        var templateTag = element.find('md-item-template').detach(),
            html = templateTag.length ? templateTag.html() : element.html();
        if (!templateTag.length) element.empty();
        return '<md-autocomplete-parent-scope md-autocomplete-replace>' + html + '</md-autocomplete-parent-scope>';
      }

      function getNoItemsTemplate() {
        var templateTag = element.find('md-not-found').detach(),
            template = templateTag.length ? templateTag.html() : '';
        return template
            ? '<li ng-if="$mdAutocompleteCtrl.notFoundVisible()"\
                         md-autocomplete-parent-scope>' + template + '</li>'
            : '';

      }

      function getInputElement () {
        if (attr.mdFloatingLabel) {
          return '\
            <md-input-container flex ng-if="floatingLabel">\
              <label>{{floatingLabel}}</label>\
              <input type="search"\
                  ' + (tabindex != null ? 'tabindex="' + tabindex + '"' : '') + '\
                  id="{{ inputId || \'fl-input-\' + $mdAutocompleteCtrl.id }}"\
                  name="{{inputName}}"\
                  autocomplete="off"\
                  ng-required="$mdAutocompleteCtrl.isRequired"\
                  ng-readonly="$mdAutocompleteCtrl.isReadonly"\
                  ng-minlength="inputMinlength"\
                  ng-maxlength="inputMaxlength"\
                  ng-disabled="$mdAutocompleteCtrl.isDisabled"\
                  ng-model="$mdAutocompleteCtrl.scope.searchText"\
                  ng-keydown="$mdAutocompleteCtrl.keydown($event)"\
                  ng-blur="$mdAutocompleteCtrl.blur()"\
                  ' + (attr.mdNoAsterisk != null ? 'md-no-asterisk="' + attr.mdNoAsterisk + '"' : '') + '\
                  ng-focus="$mdAutocompleteCtrl.focus()"\
                  aria-owns="ul-{{$mdAutocompleteCtrl.id}}"\
                  ' + (attr.mdSelectOnFocus != null ? 'md-select-on-focus=""' : '') + '\
                  aria-label="{{floatingLabel}}"\
                  aria-autocomplete="list"\
                  aria-haspopup="true"\
                  aria-activedescendant=""\
                  aria-expanded="{{!$mdAutocompleteCtrl.hidden}}"/>\
              <div md-autocomplete-parent-scope md-autocomplete-replace>' + leftover + '</div>\
            </md-input-container>';
        } else {
          return '\
            <input flex type="search"\
                ' + (tabindex != null ? 'tabindex="' + tabindex + '"' : '') + '\
                id="{{ inputId || \'input-\' + $mdAutocompleteCtrl.id }}"\
                name="{{inputName}}"\
                ng-if="!floatingLabel"\
                autocomplete="off"\
                ng-required="$mdAutocompleteCtrl.isRequired"\
                ng-disabled="$mdAutocompleteCtrl.isDisabled"\
                ng-readonly="$mdAutocompleteCtrl.isReadonly"\
                ng-model="$mdAutocompleteCtrl.scope.searchText"\
                ng-keydown="$mdAutocompleteCtrl.keydown($event)"\
                ng-blur="$mdAutocompleteCtrl.blur()"\
                ng-focus="$mdAutocompleteCtrl.focus()"\
                placeholder="{{placeholder}}"\
                aria-owns="ul-{{$mdAutocompleteCtrl.id}}"\
                ' + (attr.mdSelectOnFocus != null ? 'md-select-on-focus=""' : '') + '\
                aria-label="{{placeholder}}"\
                aria-autocomplete="list"\
                aria-haspopup="true"\
                aria-activedescendant=""\
                aria-expanded="{{!$mdAutocompleteCtrl.hidden}}"/>\
            <button\
                type="button"\
                tabindex="-1"\
                ng-if="$mdAutocompleteCtrl.scope.searchText && !$mdAutocompleteCtrl.isDisabled"\
                ng-click="$mdAutocompleteCtrl.clear()">\
              <md-icon md-svg-icon="md-close"></md-icon>\
              <span class="md-visually-hidden">Clear</span>\
            </button>\
                ';
        }
      }
    }
  };
}

angular
  .module('material.components.autocomplete')
  .directive('mdAutocompleteParentScope', MdAutocompleteItemScopeDirective);

function MdAutocompleteItemScopeDirective($compile, $mdUtil) {
  return {
    restrict: 'AE',
    compile: compile,
    terminal: true,
    transclude: 'element'
  };

  function compile(tElement, tAttr, transclude) {
    return function postLink(scope, element, attr) {
      var ctrl = scope.$mdAutocompleteCtrl;
      var newScope = ctrl.parent.$new();
      var itemName = ctrl.itemName;

      // Watch for changes to our scope's variables and copy them to the new scope
      watchVariable('$index', '$index');
      watchVariable('item', itemName);

      // Ensure that $digest calls on our scope trigger $digest on newScope.
      connectScopes();

      // Link the element against newScope.
      transclude(newScope, function(clone) {
        element.after(clone);
      });

      /**
       * Creates a watcher for variables that are copied from the parent scope
       * @param variable
       * @param alias
       */
      function watchVariable(variable, alias) {
        newScope[alias] = scope[variable];

        scope.$watch(variable, function(value) {
          $mdUtil.nextTick(function() {
            newScope[alias] = value;
          });
        });
      }

      /**
       * Creates watchers on scope and newScope that ensure that for any
       * $digest of scope, newScope is also $digested.
       */
      function connectScopes() {
        var scopeDigesting = false;
        var newScopeDigesting = false;

        scope.$watch(function() {
          if (newScopeDigesting || scopeDigesting) {
            return;
          }

          scopeDigesting = true;
          scope.$$postDigest(function() {
            if (!newScopeDigesting) {
              newScope.$digest();
            }

            scopeDigesting = newScopeDigesting = false;
          });
        });

        newScope.$watch(function() {
          newScopeDigesting = true;
        });
      }
    };
  }
}
MdAutocompleteItemScopeDirective.$inject = ["$compile", "$mdUtil"];
angular
    .module('material.components.autocomplete')
    .controller('MdHighlightCtrl', MdHighlightCtrl);

function MdHighlightCtrl ($scope, $element, $attrs) {
  this.init = init;

  function init (termExpr, unsafeTextExpr) {
    var text = null,
        regex = null,
        flags = $attrs.mdHighlightFlags || '',
        watcher = $scope.$watch(function($scope) {
          return {
            term: termExpr($scope),
            unsafeText: unsafeTextExpr($scope)
          };
        }, function (state, prevState) {
          if (text === null || state.unsafeText !== prevState.unsafeText) {
            text = angular.element('<div>').text(state.unsafeText).html()
          }
          if (regex === null || state.term !== prevState.term) {
            regex = getRegExp(state.term, flags);
          }

          $element.html(text.replace(regex, '<span class="highlight">$&</span>'));
        }, true);
    $element.on('$destroy', watcher);
  }

  function sanitize (term) {
    return term && term.replace(/[\\\^\$\*\+\?\.\(\)\|\{}\[\]]/g, '\\$&');
  }

  function getRegExp (text, flags) {
    var str = '';
    if (flags.indexOf('^') >= 1) str += '^';
    str += text;
    if (flags.indexOf('$') >= 1) str += '$';
    return new RegExp(sanitize(str), flags.replace(/[\$\^]/g, ''));
  }
}
MdHighlightCtrl.$inject = ["$scope", "$element", "$attrs"];

angular
    .module('material.components.autocomplete')
    .directive('mdHighlightText', MdHighlight);

/**
 * @ngdoc directive
 * @name mdHighlightText
 * @module material.components.autocomplete
 *
 * @description
 * The `md-highlight-text` directive allows you to specify text that should be highlighted within
 *     an element.  Highlighted text will be wrapped in `<span class="highlight"></span>` which can
 *     be styled through CSS.  Please note that child elements may not be used with this directive.
 *
 * @param {string} md-highlight-text A model to be searched for
 * @param {string=} md-highlight-flags A list of flags (loosely based on JavaScript RexExp flags).
 * #### **Supported flags**:
 * - `g`: Find all matches within the provided text
 * - `i`: Ignore case when searching for matches
 * - `$`: Only match if the text ends with the search term
 * - `^`: Only match if the text begins with the search term
 *
 * @usage
 * <hljs lang="html">
 * <input placeholder="Enter a search term..." ng-model="searchTerm" type="text" />
 * <ul>
 *   <li ng-repeat="result in results" md-highlight-text="searchTerm">
 *     {{result.text}}
 *   </li>
 * </ul>
 * </hljs>
 */

function MdHighlight ($interpolate, $parse) {
  return {
    terminal: true,
    controller: 'MdHighlightCtrl',
    compile: function mdHighlightCompile(tElement, tAttr) {
      var termExpr = $parse(tAttr.mdHighlightText);
      var unsafeTextExpr = $interpolate(tElement.html());

      return function mdHighlightLink(scope, element, attr, ctrl) {
        ctrl.init(termExpr, unsafeTextExpr);
      };
    }
  };
}
MdHighlight.$inject = ["$interpolate", "$parse"];

ng.material.components.autocomplete = angular.module("material.components.autocomplete");