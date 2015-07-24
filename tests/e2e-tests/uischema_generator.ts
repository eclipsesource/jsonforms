/// <reference path="../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="../../typings/angularjs/angular.d.ts"/>
/// <reference path="../../typings/angularjs/angular-mocks.d.ts"/>
/// <reference path="../../js/services.ts"/>
/// <reference path="../../typings/schemas/uischema.d.ts"/>
/// <reference path="../../typings/angular-protractor/angular-protractor.d.ts"/>

describe('Test UI Schema Generator', function() {

    it('check if forms are generated', function(){
        browser.get('embed-index.html#/defaultui');

        //sanity check
        expect(browser.getTitle()).toEqual('JSONForms');

        //check if any inputs were rendered
        expect(element(by.css("input")).isPresent()).toBe(true);

        //check if exactly two inputs were rendered
        expect(element.all(by.css("input")).count()).toEqual(2);
    });

});