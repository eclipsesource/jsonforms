describe('uiValidate', function () {
  'use strict';

  var scope, compileAndDigest;

  var trueValidator = function () {
    return true;
  };

  var falseValidator = function () {
    return false;
  };

  var passedValueValidator = function (valueToValidate) {
    return valueToValidate;
  };

  var undefinedValidator = function () {
    return undefined;
  };

  beforeEach(module('ui.validate'));
  beforeEach(inject(function ($rootScope, $compile) {

    scope = $rootScope.$new();
    compileAndDigest = function (inputHtml, scope) {
      var inputElm = angular.element(inputHtml);
      var formElm = angular.element('<form name="form"></form>');
      formElm.append(inputElm);
      $compile(formElm)(scope);
      scope.$digest();

      return inputElm;
    };
  }));

  describe('initial validation', function () {

    it('should mark input as valid if initial model is valid', inject(function () {

      scope.validate = trueValidator;
      compileAndDigest('<input name="input" ng-model="value" ui-validate="\'validate($value)\'">', scope);
      expect(scope.form.input.$valid).toBe(true);
      expect(scope.form.input.$error).toEqual({});
    }));

    it('should mark input as invalid if initial model is invalid', inject(function () {

      scope.validate = falseValidator;
      compileAndDigest('<input name="input" ng-model="value" ui-validate="\'validate($value)\'">', scope);
      expect(scope.form.input.$valid).toBe(false);
      expect(scope.form.input.$error).toEqual({ validator: true });
    }));

    it('should not corrupt the NgModelController and the FormController if the validator returns undefined', inject(function () {

      scope.validate = undefinedValidator;
      compileAndDigest('<input name="input" ng-model="value" ui-validate="\'validate($value)\'">', scope);
      expect(scope.form.input.$valid).toBe(false);
      expect(scope.form.$valid).toBe(false);
      expect(scope.form.input.$error).toEqual({ validator: true });
    }));
    
  });

  describe('validation on model change', function () {

    it('should change valid state in response to model changes', inject(function () {

      scope.value = false;
      scope.validate = passedValueValidator;
      compileAndDigest('<input name="input" ng-model="value" ui-validate="\'validate($value)\'">', scope);
      expect(scope.form.input.$valid).toBe(false);

      scope.$apply('value = true');
      expect(scope.form.input.$valid).toBe(true);
    }));
  });

  describe('validation on element change', function () {

    var sniffer;
    beforeEach(inject(function ($sniffer) {
      sniffer = $sniffer;
    }));

    it('should change valid state in response to element events', function () {

      scope.value = false;
      scope.validate = passedValueValidator;
      var inputElm = compileAndDigest('<input name="input" ng-model="value" ui-validate="\'validate($value)\'">', scope);
      expect(scope.form.input.$valid).toBe(false);

      inputElm.val('true');
      inputElm.trigger((sniffer.hasEvent('input') ? 'input' : 'change'));

      expect(scope.form.input.$valid).toBe(true);
    });
  });

  describe('multiple validators with custom keys', function () {

    it('should support multiple validators with custom keys', function () {

      scope.validate1 = trueValidator;
      scope.validate2 = falseValidator;

      compileAndDigest('<input name="input" ng-model="value" ui-validate="{key1 : \'validate1($value)\', key2 : \'validate2($value)\'}">', scope);
      expect(scope.form.input.$valid).toBe(false);
      expect(scope.form.input.$error.key1).toBeUndefined();
      expect(scope.form.input.$error.key2).toBe(true);
    });
  });

  describe('uiValidateWatch', function(){
    function validateWatch(watchMe) {
      return watchMe;
    }
    beforeEach(function(){
      scope.validateWatch = validateWatch;
    });

    it('should watch the string and refire the single validator', function () {
      scope.watchMe = false;
      compileAndDigest('<input name="input" ng-model="value" ui-validate="\'validateWatch(watchMe)\'" ui-validate-watch="\'watchMe\'">', scope);
      expect(scope.form.input.$valid).toBe(false);
      expect(scope.form.input.$error.validator).toBe(true);
      scope.$apply('watchMe=true');
      expect(scope.form.input.$valid).toBe(true);
      expect(scope.form.input.$error.validator).toBeUndefined();
    });

    it('should watch the object deeply and refire the single validator', function () {
      scope.watchMe = { test: false };
      compileAndDigest('<input name="input" ng-model="value" ui-validate="\'watchMe.test==true\'" ui-validate-watch="\'watchMe\'" ui-validate-watch-object-equality="true">', scope);
      expect(scope.form.input.$valid).toBe(false);
      expect(scope.form.input.$error.validator).toBe(true);
      scope.$apply('watchMe.test=true');
      expect(scope.form.input.$valid).toBe(true);
      expect(scope.form.input.$error.validator).toBeUndefined();
    });

    it('should watch the array and refire the single validator', function () {
      scope.watchMe = [];
      compileAndDigest('<input name="input" ng-model="value" ui-validate="\'watchMe.length > 0\'" ui-validate-watch-collection="\'watchMe\'">', scope);
      expect(scope.form.input.$valid).toBe(false);
      expect(scope.form.input.$error.validator).toBe(true);
      scope.$apply('watchMe.push(1)');
      expect(scope.form.input.$valid).toBe(true);
      expect(scope.form.input.$error.validator).toBeUndefined();
    });

    it('should watch the string and refire all validators', function () {
      scope.watchMe = false;
      compileAndDigest('<input name="input" ng-model="value" ui-validate="{foo:\'validateWatch(watchMe)\',bar:\'validateWatch(watchMe)\'}" ui-validate-watch="\'watchMe\'">', scope);
      expect(scope.form.input.$valid).toBe(false);
      expect(scope.form.input.$error.foo).toBe(true);
      expect(scope.form.input.$error.bar).toBe(true);
      scope.$apply('watchMe=true');
      expect(scope.form.input.$valid).toBe(true);
      expect(scope.form.input.$error.foo).toBeUndefined();
      expect(scope.form.input.$error.bar).toBeUndefined();
    });

    it('should watch the all object attributes and each respective validator', function () {
      scope.watchFoo = false;
      scope.watchBar = false;
      compileAndDigest('<input name="input" ng-model="value" ui-validate="{foo:\'validateWatch(watchFoo)\',bar:\'validateWatch(watchBar)\'}" ui-validate-watch="{foo:\'watchFoo\',bar:\'watchBar\'}">', scope);
      expect(scope.form.input.$valid).toBe(false);
      expect(scope.form.input.$error.foo).toBe(true);
      expect(scope.form.input.$error.bar).toBe(true);
      scope.$apply('watchFoo=true');
      expect(scope.form.input.$valid).toBe(false);
      expect(scope.form.input.$error.foo).toBeUndefined();
      expect(scope.form.input.$error.bar).toBe(true);
      scope.$apply('watchBar=true');
      scope.$apply('watchFoo=false');
      expect(scope.form.input.$valid).toBe(false);
      expect(scope.form.input.$error.foo).toBe(true);
      expect(scope.form.input.$error.bar).toBeUndefined();
      scope.$apply('watchFoo=true');
      expect(scope.form.input.$valid).toBe(true);
      expect(scope.form.input.$error.foo).toBeUndefined();
      expect(scope.form.input.$error.bar).toBeUndefined();
    });

  });

  describe('error cases', function () {
    it('should fail if ngModel not present', inject(function () {
      expect(function () {
        compileAndDigest('<input name="input" ui-validate="\'validate($value)\'">', scope);
      }).toThrow();
    }));
    it('should have no effect if validate expression is empty', inject(function () {
      compileAndDigest('<input ng-model="value" ui-validate="">', scope);
    }));
  });

  describe('additional scope variables', function () {

    it('should pass name of the field to the scope', function () {
      scope.validate = function () { return true; };
      spyOn(scope, 'validate').and.callThrough();

      compileAndDigest('<input name="firstname" ng-model="value" ui-validate="\'validate($name)\'">', scope);
      expect(scope.validate).toHaveBeenCalledWith('firstname');

      scope.validate.calls.reset();

      compileAndDigest('<input name="lastname" ng-model="value" ui-validate-async="\'validate($name)\'">', scope);
      expect(scope.validate).toHaveBeenCalledWith('lastname');
    });

  });

});
