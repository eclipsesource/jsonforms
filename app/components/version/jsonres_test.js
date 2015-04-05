'use strict';

describe('ResolvingJsonParser', function() {

  it('marks proxies', function() {
    var jsonString = '{\
      property: "value",\
      refersTo: {$ref: "http://localhost:9876/test"}\
    }';
    var parser = new ResolvingJsonParser();
    var jsonObject = parser.fromJson(jsonString)

    expect(jsonObject.isProxy()).toBe(false);
    expect(jsonObject.refersTo.isProxy()).toBe(true);
  });

  it('enables to call resolve() on proxies', function() {
    var jsonString = '{\
      property: "value",\
      refersTo: {$ref: "http://localhost:9876/test"}\
    }';
    var resultionResult = function() {
      return '{subProperty: "subValue"}';
    };
    var parser = createParserWithMockResolver(resultionResult);
    var jsonObject = parser.fromJson(jsonString)
    jsonObject.refersTo.resolve();

    expect(jsonObject.refersTo.subProperty).toBe("subValue");
  });

  it('unmarks proxy after resolution', function() {
    var jsonString = '{\
      property: "value",\
      refersTo: {$ref: "http://localhost:9876/test"}\
    }';
    var resultionResult = function() {
      return '{subProperty: "subValue"}';
    };
    var parser = createParserWithMockResolver(resultionResult);
    var jsonObject = parser.fromJson(jsonString)

    expect(jsonObject.refersTo.isProxy()).toBe(true);
    jsonObject.refersTo.resolve();
    expect(jsonObject.refersTo.isProxy()).toBe(false);
  });

  function createParserWithMockResolver(resultionResult) {
    var mockResolver = new Resolver(new AbsolutReferenceToUrlMapper());
    mockResolver.fetchUrlBody = function() {
      return resultionResult.call();
    };
    var parser = new ResolvingJsonParser();
    parser.resolver = mockResolver;
    return parser;
  }

});
