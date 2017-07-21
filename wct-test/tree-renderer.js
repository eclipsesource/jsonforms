/*
 * Contains functions defining the drag and drop tests for the tree renderer
 * The tests need to be executed in a web component tester environment (see ./tree-renderer.html)
 */
var simpleSchema = {
  type: 'object',
  properties: {
    children: {
      type: 'array',
      items: {
        type: 'object',
        id: 'bar',
        properties: { name: { type: 'string' } }
      }
    },
    name: {type: 'string'}
  }
};

var uiSchema = {
  type: 'MasterDetailLayout',
  label: 'FooBar',
  scope: { $ref: '#' }
};

function sameListDnd(done) {
    var jsonForms = document.createElement("json-forms");
    jsonForms.dataSchema = simpleSchema;
    jsonForms.uiSchema = uiSchema;
    var data = {
        name: "Foo",
        children: [
          {name: 'Bar1'},
          {name: 'Bar2'},
          {name: 'Bar3'}
        ]
    };
    jsonForms.data = data;
    document.body.appendChild(jsonForms);

    // need to wait a bit until json forms is rendered
    setTimeout(function() {
      var master = document.getElementsByClassName("jsf-treeMasterDetail-master")[0];
      var fooLi = master.children[0].children[0];
      var childrenUl = fooLi.children[1];
      assert.strictEqual(childrenUl.children.length, 3);

      // Bar1 to Bar3 LI elements
      var bar1Li = childrenUl.children[0];
      var bar2Li = childrenUl.children[1];
      var bar3Li = childrenUl.children[2];

      assert.strictEqual(getChildLabelFromList(childrenUl, 0),"Bar1");
      assert.strictEqual(getChildLabelFromList(childrenUl, 1),"Bar2");
      assert.strictEqual(getChildLabelFromList(childrenUl, 2),"Bar3");

      // drag and drop simulation
      dragMock
        .dragStart(getLabelSpanFromLi(bar1Li))
        .delay(100)
        .dragOver(getLabelSpanFromLi(bar2Li))
        .delay(100)
        .dragOver(getLabelSpanFromLi(bar3Li))
        .delay(100)
        .drop(getLabelSpanFromLi(bar3Li));

      // need to wait because of drag mock delay()
      setTimeout(function() {
        // check list after drag and drop
        assert.strictEqual(childrenUl.children.length, 3);
        assert.strictEqual(getChildLabelFromList(childrenUl, 0),"Bar2");
        assert.strictEqual(getChildLabelFromList(childrenUl, 1),"Bar3");
        assert.strictEqual(getChildLabelFromList(childrenUl, 2),"Bar1");

        // check data after drag and drop
        assert.strictEqual(data.children[0].name, "Bar2");
        assert.strictEqual(data.children[1].name, "Bar3");
        assert.strictEqual(data.children[2].name, "Bar1");

        // end async test
        done();
      }, 500);
    }, 500);
}

function getChildLabelFromList(list, index) {
  return getLabelSpanFromLi(list.children[index]).textContent;
}

function getLabelSpanFromLi(li) {
  //       ->   div    ->  span  ->  span.label
  return li.children[0].children[0].children[0];
}


function getOffset(el) {
  el = el.getBoundingClientRect();
  return {
    left: el.left + window.scrollX,
    top: el.top + window.scrollY
  }
}
