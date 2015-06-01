//
// jsonres.js -- Enhances resolution capabilities of dojox.json.ref.
//
// Copyright (c) 2015 EclipseSource Munich GmbH and others.
//
// Contributors:
// (c) 2015 Philip Langer - initial API and implementation

var ResolvingJsonParser = function (resolver) {
  // To be able to access this instance in functions later on
  var thisParser = this;

  // Setting default implementation of resolver and mapper
  if (resolver === undefined) {
    this.resolver = new Resolver(new AbsolutReferenceToUrlMapper());
  } else {
    this.resolver = resolver;
  }

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

    jsonObject[ResolvingJsonParser.PARSER_PROPERTY] = thisParser;
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
      return this[ResolvingJsonParser.REFERENCE_PROPERTY] !== undefined;
    };
  };

  function injectResolveFunction(jsonObject) {
    jsonObject.resolve = function() {
      this[ResolvingJsonParser.PARSER_PROPERTY].resolver.resolve(this);
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
      && property !== ResolvingJsonParser.REFERENCE_PROPERTY
      && property !== ResolvingJsonParser.PARSER_PROPERTY;
  };

  function isObjectArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  };

  function isObject(value) {
    return value instanceof Object && !(value instanceof Function);
  };
};

ResolvingJsonParser.REFERENCE_PROPERTY = '$ref';
ResolvingJsonParser.PARSER_PROPERTY = '__parser';

var Resolver = function (referenceToUrlMapper) {

  this.resolve = function(/*Object*/ jsonObject) {
    if (!jsonObject || !jsonObject.isProxy()) {
      return jsonObject;
    }

    var reference = jsonObject[ResolvingJsonParser.REFERENCE_PROPERTY];
    var url = referenceToUrlMapper.getUrl(reference);
    var result = this.fetchUrlBody(url);

    var parser = jsonObject[ResolvingJsonParser.PARSER_PROPERTY];
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
    object[ResolvingJsonParser.REFERENCE_PROPERTY] = undefined;
    return object;
  }

}

var AbsolutReferenceToUrlMapper = function () {

  this.getUrl = function(/*String*/ reference) {
    return reference;
  }

}
