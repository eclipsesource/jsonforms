//
// jsonres.js -- Enhances resolution capabilities of dojox.json.ref.
//
// Copyright (c) 2015 EclipseSource Munich GmbH and others.
//
// Contributors:
// (c) 2015 Philip Langer - initial API and implementation

var ResolvingJsonParser = function () {
  // To be able to access this in a function
  var thisParser = this;

  // Setting default implementation of resolver and mapper
  // Clients may overwrite this
  this.resolver = new Resolver(new AbsolutReferenceToUrlMapper());

  this.fromJson = function (/*String*/ str,/*Object?*/ args) {
    var args = {
      assignAbsoluteIds : false,
      loader : function() {
        this.resolve();
      }
    };
    var rootObject =  dojox.json.ref.fromJson(str, args);
    addResolutionCapabilities(rootObject, true);
    return rootObject;
  };

  function addResolutionCapabilities(jsonObject, traverseChildren) {
    if (!isObject(jsonObject) || hasResolutionCapabilities(jsonObject)) {
      return;
    }

    jsonObject[ResolvingJsonParser.parserProperty] = thisParser;
    injectIsProxyFunction(jsonObject);
    injectResolveFunction(jsonObject);

    if (traverseChildren) {
      addResolutionCapabilitiesToChildren(jsonObject);
    }
  }

  function hasResolutionCapabilities(jsonObject) {
    return jsonObject.isProxy !== undefined;
  };

  function injectIsProxyFunction(jsonObject) {
    jsonObject.isProxy = function() {
      return this[ResolvingJsonParser.referenceProperty] !== undefined;
    };
  };

  function injectResolveFunction(jsonObject) {
    jsonObject.resolve = function() {
      this[ResolvingJsonParser.parserProperty].resolver.resolve(this);
    };
  };

  function addResolutionCapabilitiesToChildren(jsonObject) {
    for (var property in jsonObject) {
      if (shouldFollowPropertyOnRecursion(jsonObject, property)) {
        var value = jsonObject[property];
        if (isObjectArray(value)) {
          for (var item in value) {
            addResolutionCapabilities(item, true);
          }
        } else if (isObject(value)) {
          addResolutionCapabilities(value, true);
        }
      }
    }
  };

  function shouldFollowPropertyOnRecursion(object, property) {
    return object.hasOwnProperty(property)
      && property.indexOf("_") !== 0
      && property !== ResolvingJsonParser.referenceProperty
      && property !== ResolvingJsonParser.parserProperty;
  };

  function isObjectArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  };

  function isObject(value) {
    return value !== null && typeof value === 'object';
  };
};

ResolvingJsonParser.referenceProperty = '$ref';
ResolvingJsonParser.parserProperty = '__parser';

var Resolver = function (referenceToUrlMapper) {

  var referenceToUrlMapper = referenceToUrlMapper;

  this.resolve = function(/*Object*/ jsonObject) {
    if (!jsonObject || !jsonObject.isProxy()) {
      return jsonObject;
    }

    var reference = jsonObject[ResolvingJsonParser.referenceProperty];
    var url = referenceToUrlMapper.getUrl(reference);
    var result = this.fetchUrlBody(url);

    var parser = jsonObject[ResolvingJsonParser.parserProperty];
    var jsonResult = parser.fromJson(result);
    return mixInObject(clearReferenceProperty(jsonObject), jsonResult);
  }

  this.fetchUrlBody = function(/*String*/ url) {
    // TODO implement fetching from remote
    return "{}";
  }

  function mixInObject(mainObject, toBeMixedIn) {
    for (var property in toBeMixedIn) {
      mainObject[property] = toBeMixedIn[property];
    }
    return mainObject;
  }

  function clearReferenceProperty(object) {
    object[ResolvingJsonParser.referenceProperty] = undefined;
    return object;
  }

}

var AbsolutReferenceToUrlMapper = function () {

  this.getUrl = function(/*String*/ reference) {
    return reference;
  }

}
