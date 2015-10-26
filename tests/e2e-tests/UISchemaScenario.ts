/// <reference path="../references.ts"/>

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