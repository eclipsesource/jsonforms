/*
 * Contains functions defining the drag and drop tests for the tree renderer
 * The tests need to be executed in a web component tester environment (see ./tree-renderer.html)
 */

function getSimpleSchema() {
  return {
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
  }
}

function getMultipleSchema() {
  return {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        children: {
          type: 'array',
          items: {
            type: 'object',
            id: 'barmulti',
            properties: { name: { type: 'string' } }
          }
        },
        name: {type: 'string'}
      }
    }
  }
}

function getIncompatibleSchema() {
  return {
    type: 'object',
    properties: {
      persons: {
        type: 'array',
        items: {
          type: 'object',
          id: 'person',
          properties: { name: { type: 'string' } }
        }
      },
      robots: {
        type: 'array',
        items: {
          type: 'object',
          id: 'robot',
          properties: { name: { type: 'string' } }
        }
      },
      name: {type: 'string'}
    }
  }
}

/** Delay between simulated drag and drop events */
var DELAY = 50;

function getUiSchema() {
  return {
    type: 'MasterDetailLayout',
    label: 'FooBar',
    scope: { $ref: '#' }
  }
}

/**
 * Test moving an element inside one list
 */
function sameListDnd(div, done) {
  var jsonForms = document.createElement("json-forms");
  jsonForms.dataSchema = getSimpleSchema();
  jsonForms.uiSchema = getUiSchema();
  var data = {
      name: "Foo",
      children: [
        {name: 'Bar1'},
        {name: 'Bar2'},
        {name: 'Bar3'}
      ]
  };
  jsonForms.data = data;
  div.appendChild(jsonForms);

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
      .delay(DELAY)
      .dragOver(getLabelSpanFromLi(bar2Li))
      .delay(DELAY)
      .dragOver(getLabelSpanFromLi(bar3Li))
      .delay(DELAY)
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
    }, 5 * DELAY);
  }, 500);
}

/**
 * Tests moving an element between two compatible lists
 */
function twoCompatibleListsDnd(div, done) {
  var jsonForms = document.createElement("json-forms");
  jsonForms.dataSchema = getMultipleSchema();
  jsonForms.uiSchema = getUiSchema();
  var data = [
    {
      name: "Foo1",
      children: [
        {name: 'Bar1.1'},
        {name: 'Bar1.2'},
      ]
    },
    {
      name: "Foo2",
      children: [
        {name: 'Bar2.1'},
        {name: 'Bar2.2'},
      ]
    }
  ];
  jsonForms.data = data;
  div.appendChild(jsonForms);

  // need to wait a bit until json forms is rendered
  setTimeout(function() {
    var master = document.getElementsByClassName("jsf-treeMasterDetail-master")[0];
    var foo1Li = master.children[0].children[0];
    var foo2Li = master.children[0].children[1];
    var children1Ul = foo1Li.children[1];
    var children2Ul = foo2Li.children[1];
    assert.strictEqual(children1Ul.children.length, 2);
    assert.strictEqual(children2Ul.children.length, 2);

    // Bar LI elements
    var bar11Li = children1Ul.children[0];
    var bar12Li = children1Ul.children[1];
    var bar21Li = children2Ul.children[0];
    var bar22Li = children2Ul.children[1];

    assert.strictEqual(getChildLabelFromList(children1Ul, 0),"Bar1.1");
    assert.strictEqual(getChildLabelFromList(children1Ul, 1),"Bar1.2");
    assert.strictEqual(getChildLabelFromList(children2Ul, 0),"Bar2.1");
    assert.strictEqual(getChildLabelFromList(children2Ul, 1),"Bar2.2");

    // drag and drop simulation: move Bar1.1 to the beginning of Foo2
    dragMock
      .dragStart(getLabelSpanFromLi(bar11Li))
      .delay(DELAY)
      .dragOver(getLabelSpanFromLi(bar12Li))
      .delay(DELAY)
      .dragOver(getLabelSpanFromLi(bar21Li))
      .delay(DELAY)
      .drop(getLabelSpanFromLi(bar21Li));

    // need to wait because of drag mock delay()
    setTimeout(function() {
      // check that Bar1.1 was moved to the beginning of Foo2
      assert.strictEqual(children1Ul.children.length, 1);
      assert.strictEqual(children2Ul.children.length, 3);
      assert.strictEqual(getChildLabelFromList(children1Ul, 0),"Bar1.2");
      assert.strictEqual(getChildLabelFromList(children2Ul, 0),"Bar1.1");
      assert.strictEqual(getChildLabelFromList(children2Ul, 1),"Bar2.1");
      assert.strictEqual(getChildLabelFromList(children2Ul, 2),"Bar2.2");

      // check data after drag and drop
      assert.strictEqual(data[0].children.length, 1);
      assert.strictEqual(data[1].children.length, 3);
      assert.strictEqual(data[0].children[0].name, "Bar1.2");
      assert.strictEqual(data[1].children[0].name, "Bar1.1");
      assert.strictEqual(data[1].children[1].name, "Bar2.1");
      assert.strictEqual(data[1].children[2].name, "Bar2.2");

      // end async test
      done();
    }, 5 * DELAY);
  }, 500);
}

/**
 * Tests that trying to move an element to an incompatible list does not trigger any changes
 */
function twoIncompatibleListsDnd(div, done) {
  var jsonForms = document.createElement("json-forms");
  jsonForms.dataSchema = getIncompatibleSchema();
  jsonForms.uiSchema = getUiSchema();
  var data = {
      name: "Foo",
      persons: [
        {name: 'P1'},
        {name: 'P2'}
      ],
      robots: [
        {name: 'R1'},
        {name: 'R2'}
      ]
  };
  jsonForms.data = data;
  div.appendChild(jsonForms);

  // need to wait a bit until json forms is rendered
  setTimeout(function() {
    var master = document.getElementsByClassName("jsf-treeMasterDetail-master")[0];

    var fooLi = master.children[0].children[0];
    var personsUl = fooLi.children[1];
    var robotsUl = fooLi.children[2];
    assert.strictEqual(personsUl.children.length, 2);
    assert.strictEqual(robotsUl.children.length, 2);


    // Person LI elements
    var persons1Li = personsUl.children[0];
    var persons2Li = personsUl.children[1];
    var robots1Li = robotsUl.children[0];
    var robots2Li = robotsUl.children[1];

    assert.strictEqual(getChildLabelFromList(personsUl, 0),"P1");
    assert.strictEqual(getChildLabelFromList(personsUl, 1),"P2");
    assert.strictEqual(getChildLabelFromList(robotsUl, 0),"R1");
    assert.strictEqual(getChildLabelFromList(robotsUl, 1),"R2");

    // drag and drop simulation
    dragMock
      .dragStart(getLabelSpanFromLi(persons1Li))
      .delay(DELAY)
      .dragOver(getLabelSpanFromLi(persons2Li))
      .delay(DELAY)
      .dragOver(getLabelSpanFromLi(robots2Li))
      .delay(DELAY)
      .drop(getLabelSpanFromLi(robots2Li));

    // need to wait because of drag mock delay()
    setTimeout(function() {
      // check that outside has changed because the lists are incompatible
      assert.strictEqual(personsUl.children.length, 2);
      assert.strictEqual(robotsUl.children.length, 2);
      assert.strictEqual(getChildLabelFromList(personsUl, 0),"P1");
      assert.strictEqual(getChildLabelFromList(personsUl, 1),"P2");
      assert.strictEqual(getChildLabelFromList(robotsUl, 0),"R1");
      assert.strictEqual(getChildLabelFromList(robotsUl, 1),"R2");

      // check data after drag and drop is still the same
      assert.strictEqual(data.persons.length, 2);
      assert.strictEqual(data.robots.length, 2);
      assert.strictEqual(data.persons[0].name, "P1");
      assert.strictEqual(data.persons[1].name, "P2");
      assert.strictEqual(data.robots[0].name, "R1");
      assert.strictEqual(data.robots[1].name, "R2");

      // end async test
      done();
    }, 500);
  }, 500);
}

/**
 * Tests that moving an item back and forth between two lists works
 */
function backAndForthDnd(div, done) {
    var jsonForms = document.createElement("json-forms");
    jsonForms.dataSchema = getMultipleSchema();
    jsonForms.uiSchema = getUiSchema();
    var data = [
      {
        name: "Foo1",
        children: [
          {name: 'Bar1.1'},
          {name: 'Bar1.2'},
        ]
      },
      {
        name: "Foo2",
        children: [
          {name: 'Bar2.1'},
          {name: 'Bar2.2'},
        ]
      }
    ];
    jsonForms.data = data;
    div.appendChild(jsonForms);

    // need to wait a bit until json forms is rendered
    setTimeout(function() {
      var master = document.getElementsByClassName("jsf-treeMasterDetail-master")[0];
      var foo1Li = master.children[0].children[0];
      var foo2Li = master.children[0].children[1];
      var children1Ul = foo1Li.children[1];
      var children2Ul = foo2Li.children[1];
      assert.strictEqual(children1Ul.children.length, 2);
      assert.strictEqual(children2Ul.children.length, 2);

      // Bar LI elements
      var bar11Li = children1Ul.children[0];
      var bar12Li = children1Ul.children[1];
      var bar21Li = children2Ul.children[0];
      var bar22Li = children2Ul.children[1];

      assert.strictEqual(getChildLabelFromList(children1Ul, 0),"Bar1.1");
      assert.strictEqual(getChildLabelFromList(children1Ul, 1),"Bar1.2");
      assert.strictEqual(getChildLabelFromList(children2Ul, 0),"Bar2.1");
      assert.strictEqual(getChildLabelFromList(children2Ul, 1),"Bar2.2");

      // drag and drop simulation: move Bar1.1 to the beginning of Foo2
      dragMock
        .dragStart(getLabelSpanFromLi(bar11Li))
        .delay(DELAY)
        .dragOver(getLabelSpanFromLi(bar12Li))
        .delay(DELAY)
        .dragOver(getLabelSpanFromLi(bar21Li))
        .delay(DELAY)
        .drop(getLabelSpanFromLi(bar21Li));

      // need to wait because of drag mock delay()
      setTimeout(function() {
        // check that Bar1.1 was moved to the beginning of Foo2
        assert.strictEqual(children1Ul.children.length, 1);
        assert.strictEqual(children2Ul.children.length, 3);
        assert.strictEqual(getChildLabelFromList(children1Ul, 0),"Bar1.2");
        assert.strictEqual(getChildLabelFromList(children2Ul, 0),"Bar1.1");
        assert.strictEqual(getChildLabelFromList(children2Ul, 1),"Bar2.1");
        assert.strictEqual(getChildLabelFromList(children2Ul, 2),"Bar2.2");

        // check data after drag and drop
        assert.strictEqual(data[0].children.length, 1);
        assert.strictEqual(data[1].children.length, 3);
        assert.strictEqual(data[0].children[0].name, "Bar1.2");
        assert.strictEqual(data[1].children[0].name, "Bar1.1");
        assert.strictEqual(data[1].children[1].name, "Bar2.1");
        assert.strictEqual(data[1].children[2].name, "Bar2.2");

        // drag and drop simulation: move Bar1.1 back to the beginning of Foo1
        dragMock
          .dragStart(getLabelSpanFromLi(bar11Li))
          .delay(DELAY)
          .dragOver(getLabelSpanFromLi(bar12Li))
          .delay(DELAY)
          .drop(getLabelSpanFromLi(bar12Li));

        setTimeout(function() {
          // check that Bar1.1 was moved back to the beginning of Foo1
          assert.strictEqual(children1Ul.children.length, 2);
          assert.strictEqual(children2Ul.children.length, 2);
          assert.strictEqual(getChildLabelFromList(children1Ul, 0),"Bar1.1");
          assert.strictEqual(getChildLabelFromList(children1Ul, 1),"Bar1.2");
          assert.strictEqual(getChildLabelFromList(children2Ul, 0),"Bar2.1");
          assert.strictEqual(getChildLabelFromList(children2Ul, 1),"Bar2.2");

          // check data after drag and drop
          assert.strictEqual(data[0].children.length, 2);
          assert.strictEqual(data[1].children.length, 2);
          assert.strictEqual(data[0].children[0].name, "Bar1.1");
          assert.strictEqual(data[0].children[1].name, "Bar1.2");
          assert.strictEqual(data[1].children[0].name, "Bar2.1");
          assert.strictEqual(data[1].children[1].name, "Bar2.2");

          // end async test
          done();
        }, 4 * DELAY);
      }, 5 * DELAY);
    }, 500);
}

/**
 * Tests that an element does not move when it's dragged over a compatible element and dropped outside json forms
 */
function dragOutsideJsonForms(div, done) {
  var jsonForms = document.createElement("json-forms");
  var outside = document.createElement("button");
  outside.textContent = "outside";
  jsonForms.dataSchema = getSimpleSchema();
  jsonForms.uiSchema = getUiSchema();
  var data = {
      name: "Foo",
      children: [
        {name: 'Bar1'},
        {name: 'Bar2'}
      ]
  };
  jsonForms.data = data;
  div.appendChild(jsonForms);
  div.appendChild(outside);

  // need to wait a bit until json forms is rendered
  setTimeout(function() {
    var master = document.getElementsByClassName("jsf-treeMasterDetail-master")[0];
    var fooLi = master.children[0].children[0];
    var childrenUl = fooLi.children[1];
    assert.strictEqual(childrenUl.children.length, 2);

    // Bar1 to Bar2 LI elements
    var bar1Li = childrenUl.children[0];
    var bar2Li = childrenUl.children[1];

    assert.strictEqual(getChildLabelFromList(childrenUl, 0),"Bar1");
    assert.strictEqual(getChildLabelFromList(childrenUl, 1),"Bar2");

    // drag and drop simulation to the button outside json forms
    dragMock
      .dragStart(getLabelSpanFromLi(bar1Li))
      .delay(DELAY)
      .dragOver(getLabelSpanFromLi(bar2Li))
      .delay(DELAY)
      .dragOver(outside)
      .delay(DELAY)
      .drop(outside);

    // need to wait because of drag mock delay()
    setTimeout(function() {
      // check list after drag and drop
      assert.strictEqual(childrenUl.children.length, 2);
      assert.strictEqual(getChildLabelFromList(childrenUl, 0),"Bar1");
      assert.strictEqual(getChildLabelFromList(childrenUl, 1),"Bar2");

      // check data after drag and drop
      assert.strictEqual(data.children[0].name, "Bar1");
      assert.strictEqual(data.children[1].name, "Bar2");

      // end async test
      done();
    }, 5 * DELAY);
  }, 500);
}

/**
 * Tests moving an element to a compatible empty list
 */
function intoCompatibleEmptyList(div, done) {
  var jsonForms = document.createElement("json-forms");
  jsonForms.dataSchema = getMultipleSchema();
  jsonForms.uiSchema = getUiSchema();
  var data = [
    {
      name: "Foo1",
      children: [
        {name: 'Bar1.1'},
        {name: 'Bar1.2'},
      ]
    },
    {
      name: "Foo2",
      children: []
    }
  ];
  jsonForms.data = data;
  div.appendChild(jsonForms);

  // need to wait a bit until json forms is rendered
  setTimeout(function() {
    var master = document.getElementsByClassName("jsf-treeMasterDetail-master")[0];
    var foo1Li = master.children[0].children[0];
    var foo2Li = master.children[0].children[1];
    var children1Ul = foo1Li.children[1];
    var children2Ul = foo2Li.children[1];

    assert.strictEqual(children1Ul.children.length, 2);
    assert.strictEqual(children2Ul.children.length, 0);

    // Bar LI elements
    var bar11Li = children1Ul.children[0];
    var bar12Li = children1Ul.children[1];

    assert.strictEqual(getChildLabelFromList(children1Ul, 0),"Bar1.1");
    assert.strictEqual(getChildLabelFromList(children1Ul, 1),"Bar1.2");

    // drag and drop simulation: move Bar1.1 to the empty list in Foo2
    dragMock
      .dragStart(getLabelSpanFromLi(bar11Li))
      .delay(DELAY)
      .dragOver(getLabelSpanFromLi(bar12Li))
      .delay(DELAY)
      .dragOver(children2Ul)
      .delay(DELAY)
      .drop(children2Ul);

    // need to wait because of drag mock delay()
    setTimeout(function() {
      // check that Bar1.1 was moved to the beginning of Foo2
      assert.strictEqual(children1Ul.children.length, 1);
      assert.strictEqual(children2Ul.children.length, 1);
      assert.strictEqual(getChildLabelFromList(children1Ul, 0),"Bar1.2");
      assert.strictEqual(getChildLabelFromList(children2Ul, 0),"Bar1.1");

      // check data after drag and drop
      assert.strictEqual(data[0].children.length, 1);
      assert.strictEqual(data[1].children.length, 1);
      assert.strictEqual(data[0].children[0].name, "Bar1.2");
      assert.strictEqual(data[1].children[0].name, "Bar1.1");

      // end async test
      done();
    }, 5 * DELAY);
  }, 500);
}

function getChildLabelFromList(list, index) {
  return getLabelSpanFromLi(list.children[index]).textContent;
}

function getLabelSpanFromLi(li) {
  //       ->   div    ->  span  ->  span.label
  return li.children[0].children[0].children[0];
}
