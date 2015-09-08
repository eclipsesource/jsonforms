'use strict';

dojo.require("dojox.json.ref");

describe('Dojox Json referencing', function() {

  it('supports referencing by id', function() {
    var jsonString = '{\
      id: "1",\
      refersTo: {\
          refersTo:\
          {$ref: "1"}\
        }\
    }';
    var jsonObject = dojox.json.ref.fromJson(jsonString)

    expect(jsonObject.refersTo.refersTo).toBe(jsonObject);
    expect(jsonObject.refersTo.refersTo.id).toBe(jsonObject.id);
  });

  it('supports referencing by path', function() {
    var jsonString = '{\
      refersTo: {\
        refersTo: {\
          $ref: "#refersTo"\
        }\
      }\
    }';
    var jsonObject = dojox.json.ref.fromJson(jsonString)

    expect(jsonObject.refersTo.refersTo).toBe(jsonObject.refersTo);
    expect(jsonObject.refersTo.refersTo).not.toBe(jsonObject);
  });

  it('supports referencing by path in arrays', function() {
    var jsonString = '{\
      refersTo: [\
        { refersTo: [{$ref: "#refersTo.1"}] },\
        { refersTo: [{$ref: "#refersTo.0"}] }\
      ]\
    }';
    var jsonObject = dojox.json.ref.fromJson(jsonString)

    expect(jsonObject.refersTo[0].refersTo[0]).toBe(jsonObject.refersTo[1]);
  });

  it('supports assigning unique ids', function() {
    var jsonString = '{\
      id: "1",\
      refersTo: [\
        { refersTo: [{$ref: "#refersTo.1"}] },\
        { refersTo: [{$ref: "#refersTo.0"}] }\
      ]\
    }';
    // we set the flag to false, so no unique ids are assigned
    var jsonObject = dojox.json.ref.fromJson(jsonString, {assignAbsoluteIds:false})
    expect(jsonObject.__id).toBeUndefined();

    // now we set the flag to true, so unique ids are assigned
    var jsonObject = dojox.json.ref.fromJson(jsonString, {assignAbsoluteIds:true})
    expect(jsonObject.__id).toBeDefined();
  });

  it('supports calling a function when resolving', function() {
    var jsonString = '{\
      refersTo: {$ref: "http://localhost:9876/test"}\
    }';
    var spy = jasmine.createSpy();
    var jsonObject = dojox.json.ref.fromJson(jsonString, {loader:spy } );

    expect(spy).not.toHaveBeenCalled();
    jsonObject.refersTo._loadObject.call();
    expect(spy).toHaveBeenCalled();
  });

});
