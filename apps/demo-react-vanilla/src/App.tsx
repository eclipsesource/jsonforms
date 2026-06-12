import { useMemo, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { vanillaRenderers } from '@jsonforms/react-vanilla';
import { ajvValidator } from '@jsonforms/validator-ajv';
import { allExamples, exampleGroups, findExample } from '@jsonforms/examples';

const firstExample = allExamples[0];
if (firstExample === undefined) {
  throw new Error('No examples available.');
}

export const App = () => {
  const [exampleId, setExampleId] = useState(firstExample.id);
  const example = findExample(exampleId) ?? firstExample;
  const [data, setData] = useState<unknown>(example.data);
  const [tab, setTab] = useState(0);
  const validator = useMemo(() => ajvValidator(example.schema), [example]);

  const panels = [
    { label: 'Data', content: JSON.stringify(data, null, 2) },
    { label: 'JSON Schema', content: JSON.stringify(example.schema, null, 2) },
    {
      label: 'UI Schema',
      content: example.uischema
        ? JSON.stringify(example.uischema, null, 2)
        : '// no UI schema — generated from the JSON Schema',
    },
  ];

  return (
    <>
      <header className="app-header">
        <h1>JSON Forms 4</h1>
        <span className="app-subtitle">React Vanilla renderer set</span>
        <label className="app-example-select">
          Example{' '}
          <select
            value={exampleId}
            onChange={(event) => setExampleId(event.target.value)}
          >
            {exampleGroups.map((group) => (
              <optgroup key={group.id} label={group.title}>
                {group.examples.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
      </header>
      <main className="app-main">
        <section className="app-panel app-panel--form">
          <h2>{example.title}</h2>
          {example.description !== undefined && (
            <p className="app-description">{example.description}</p>
          )}
          <JsonForms
            key={example.id}
            schema={example.schema}
            uischema={example.uischema}
            data={example.data}
            validator={validator}
            renderers={vanillaRenderers}
            onChange={(event) => setData(event.data)}
          />
        </section>
        <section className="app-panel app-panel--inspector">
          <div className="app-tabs" role="tablist">
            {panels.map((panel, index) => (
              <button
                key={panel.label}
                role="tab"
                aria-selected={tab === index}
                className={
                  tab === index ? 'app-tab app-tab--active' : 'app-tab'
                }
                onClick={() => setTab(index)}
              >
                {panel.label}
              </button>
            ))}
          </div>
          <pre className="app-json">{panels[tab]?.content}</pre>
        </section>
      </main>
    </>
  );
};
