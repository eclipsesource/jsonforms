import test from 'ava';
import '../helpers/setup';
/*tslint:disable:ordered-imports*/
import {DataService } from '../../src/core/data.service';
/*tslint:enable:ordered-imports*/
import {Runtime} from '../../src/core/runtime';
import {JsonSchema} from '../../src/models/jsonSchema';
import {Categorization, ControlElement, Layout} from '../../src/models/uischema';
import {
  CategorizationRenderer,
  categorizationTester
} from '../../src/renderers/additional/categorization-renderer';
import {testNotifyAboutVisibiltyWhenDisconnected} from './base.control.tests';

test.beforeEach(t => {
  t.context.data = { };
  t.context.uiSchema = {
    type: 'Categorization',
    elements: [
      {
        type: 'Category',
        label: 'B'
      },
    ]
  };
});

test('CategorizationTester', t => {
  t.is(categorizationTester(undefined, undefined), -1);
  t.is(categorizationTester(null, undefined), -1);
  t.is(categorizationTester({type: 'Foo'}, undefined), -1);
  t.is(categorizationTester({type: 'Categorization'}, undefined), -1);
});

test('apply tester with null elements and no schema', t => {
  const uiSchema: Layout = {
    type: 'Categorization',
    elements: null
  };
  t.is(
      categorizationTester(
          uiSchema,
          undefined
      ),
      -1
  );
});

test('apply tester with empty elements and no schema', t => {
  const uiSchema: Layout = {
    type: 'Categorization',
    elements: []
  };
  t.is(
      categorizationTester(
          uiSchema,
          undefined
      ),
      -1
  );
});

test('apply tester with single unknown element and no schema', t => {
  const uiSchema: Layout = {
    type: 'Categorization',
    elements: [
      {
        type: 'Foo'
      },
    ]
  };
  t.is(
      categorizationTester(
          uiSchema,
          undefined
      ),
      -1
  );
});

test('apply tester with single category and no schema', t => {
  const categorization =  {
    type: 'Categorization',
    elements: [
      {
        type: 'Category'
      }
    ]
  };
  t.is(
      categorizationTester(
          categorization,
          undefined
      ),
      1
  );
});

test('apply tester with nested categorization and single category and no schema', t => {
  const nestedCategorization: Layout = {
    type: 'Categorization',
    elements: [
      {
        type: 'Category'
      }
    ]
  };
  const categorization: Layout = {
    type: 'Categorization',
    elements: [nestedCategorization]
  };
  t.is(
      categorizationTester(
          categorization,
          undefined),
      1
  );
});

test('apply tester with nested categorizations, but no category and no schema', t => {
  const categorization: Layout = {
    type: 'Categorization',
    elements: [
      {
        type: 'Categorization'
      }
    ]
  };
  t.is(
      categorizationTester(
          categorization,
          undefined
      ),
      -1
  );
});

test('apply tester with nested categorizations, null elements and no schema', t => {
  const categorization = {
    type: 'Categorization',
    elements: [
      {
        type: 'Categorization',
        elements: null
      }
    ]
  };
  t.is(
      categorizationTester(
          categorization,
          undefined
      ),
      -1
  );
});

test('apply tester with nested categorizations, empty elements and no schema', t => {
  const categorization = {
    type: 'Categorization',
    elements: [
      {
        type: 'Categorization',
        elements: []
      }
    ]
  };
  t.is(
      categorizationTester(
          categorization,
          undefined
      ),
      -1
  );
});

test('CategorizationRenderer static', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      }
    }
  };
  const renderer: CategorizationRenderer = new CategorizationRenderer();
  const data = {'name': 'Foo'};
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);

  const nameControl: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/name'
    }
  };
  const categorization: Categorization = {
    type: 'Categorization',
    label: 'Root',
    elements: [
      {
        type: 'Categorization',
        label: 'Bar',
        elements: [
          {
            type: 'Category',
            label: 'A',
            elements: [nameControl]
          }
        ]
      },
      {
        type: 'Category',
        label: 'B',
        elements: [nameControl]
      }
    ]
  };

  renderer.setUiSchema(categorization);
  const result = renderer.render();
  t.is(result.className, 'jsf-categorization');
  t.is(result.childNodes.length, 2);
  // master tree
  const master = result.children[0] as HTMLDivElement; // <-- TODO needed?
  t.is(master.className, 'jsf-categorization-master');
  t.is(master.children.length, 1);
  const ul = master.children[0];
  t.is(ul.children.length, 2);
  const liA = ul.children[0];
  t.is(liA.className, 'jsf-category-group');
  t.is(liA.children.length, 2);
  const spanA = liA.children[0];
  t.is(spanA.textContent, 'Bar');
  const innerUlA = liA.children[1];
  t.is(innerUlA.className, 'jsf-category-subcategories');
  t.is(innerUlA.children.length, 1);
  const innerLiA = innerUlA.children[0];
  t.is(innerLiA.children.length, 1);
  const innerSpanA = innerLiA.children[0];
  t.is(innerSpanA.textContent, 'A');
  const liB = ul.children[1];
  t.not(liB.className, 'jsf-category-group');
  t.is(liB.children.length, 1);
  const spanB = liB.children[0];
  t.is(spanB.textContent, 'B');
  // detail
  const detail = result.children[1] as HTMLDivElement;
  t.is(detail.className, 'jsf-categorization-detail');
  t.is(detail.children.length, 1);
  t.is(detail.children.item(0).tagName, 'DIV');
  t.is(detail.children.item(0).children.length, 1);
  t.is(detail.children.item(0).children.item(0).tagName, 'JSON-FORMS');
});

test('CategorizationRenderer dynamic', t => {
  const schema: JsonSchema = {
    type: 'object',
    properties: {
      name: {
        type: 'string'
      }
    }
  };
  const renderer: CategorizationRenderer = new CategorizationRenderer();
  const data = {'name': 'Foo'};
  renderer.setDataService(new DataService(data));
  renderer.setDataSchema(schema);

  const nameControl: ControlElement = {
    type: 'Control',
    scope: {
      $ref: '#/properties/name'
    }
  };
  const categorization: Categorization = {
    type: 'Categorization',
    label: 'Root',
    elements: [
      {
        type: 'Categorization',
        label: 'Bar',
        elements: [
          {
            type: 'Category',
            label: 'A',
            elements: [nameControl]
          },
        ]
      },
      {
        type: 'Category',
        label: 'B',
        elements: [nameControl, nameControl]
      },
      {
        type: 'Category',
        label: 'C',
        elements: undefined
      },
      {
        type: 'Category',
        label: 'D',
        elements: null
      },
    ]
  };
  renderer.setUiSchema(categorization);
  const result = renderer.render();
  t.is(result.className, 'jsf-categorization');
  t.is(result.childNodes.length, 2);
  // master tree
  const master = result.children[0] as HTMLDivElement; // <-- TODO needed?
  t.is(master.children.length, 1);
  const ul = master.children[0];
  t.is(ul.children.length, 4);
  const liB = ul.children[1] as HTMLLIElement;
  const liC = ul.children[2] as HTMLLIElement;
  const liD = ul.children[3] as HTMLLIElement;
  // detail
  const detail = result.children[1] as HTMLDivElement;
  t.is(detail.children.length, 1);
  t.is(detail.children.item(0).tagName, 'DIV');
  t.is(detail.children.item(0).children.length, 1);
  t.is(detail.children.item(0).children.item(0).tagName, 'JSON-FORMS');

  liB.click();
  t.is(detail.children.length, 1);
  t.is(detail.children.item(0).tagName, 'DIV');
  t.is(detail.children.item(0).children.length, 2);
  t.is(detail.children.item(0).children.item(0).tagName, 'JSON-FORMS');
  t.is(detail.children.item(0).children.item(1).tagName, 'JSON-FORMS');

  liC.click();
  t.is(detail.children.length, 1);
  t.is(detail.children.item(0).tagName, 'DIV');
  t.is(detail.children.item(0).children.length, 0);
  liD.click();
  t.is(detail.children.length, 1);
  t.is(detail.children.item(0).tagName, 'DIV');
  t.is(detail.children.item(0).children.length, 0);
});

test('CategorizationRenderer notify visible', t => {
  const renderer: CategorizationRenderer = new CategorizationRenderer();
  const categorization: Categorization = {
    type: 'Categorization',
    label: '',
    elements: [
      {
        type: 'Category',
        label: 'B',
        elements: []
      }
    ]
  };
  renderer.setUiSchema(categorization);
  renderer.connectedCallback();
  const runtime = categorization.runtime as Runtime;
  runtime.visible = false;
  t.is(renderer.hidden, true);
});

test('CategorizationRenderer notify disabled', t => {
  const renderer: CategorizationRenderer = new CategorizationRenderer();
  const categorization: Categorization = {
    type: 'Categorization',
    label: '',
    elements: [
      {
        type: 'Category',
        label: 'B',
        elements: []
      }
    ]
  };
  renderer.setUiSchema(categorization);
  renderer.connectedCallback();
  const runtime = categorization.runtime as Runtime;
  runtime.enabled = false;
  t.is(renderer.getAttribute('disabled'), 'true');
});

test('CategorizationRenderer notify enabled', t => {
  const renderer: CategorizationRenderer = new CategorizationRenderer();
  const categorization: Categorization = {
    type: 'Categorization',
    label: '',
    elements: [
      {
        type: 'Category',
        label: 'B',
        elements: []
      }
    ]
  };
  renderer.setUiSchema(categorization);
  renderer.connectedCallback();
  const runtime = categorization.runtime as Runtime;
  runtime.enabled = true;
  t.false(renderer.hasAttribute('disabled'));
});

test('CategorizationRenderer disconnected no notify visible', t => {
  testNotifyAboutVisibiltyWhenDisconnected(t, new CategorizationRenderer());
});
