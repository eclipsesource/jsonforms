'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('Test Local App', function() {

  it('check app title', function(){
    browser.get('embed-index.html#/localdemo');
    expect(browser.getTitle()).toEqual('JSONForms');
  });

});
