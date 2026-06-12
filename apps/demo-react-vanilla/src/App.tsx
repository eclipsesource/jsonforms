import { useMemo, useState } from 'react';
import { JsonForms } from '@jsonforms/react';
import { vanillaRenderers } from '@jsonforms/react-vanilla';
import { allExamples, exampleGroups, findExample } from '@jsonforms/examples';
import type { EngineChoice, ValidationChoice } from '@jsonforms/demo-shared';
import {
  createValidator,
  describeEngine,
  describeValidator,
  engineChoices,
  validationChoices,
} from '@jsonforms/demo-shared';
import { RemoteEngineForm } from './RemoteEngineForm';

const firstExample = allExamples[0];
if (firstExample === undefined) {
  throw new Error('No examples available.');
}

export const App = () => {
  const [exampleId, setExampleId] = useState(firstExample.id);
  const example = findExample(exampleId) ?? firstExample;
  const [validation, setValidation] = useState<ValidationChoice>('ajv');
  const [engineChoice, setEngineChoice] = useState<EngineChoice>('local');
  const [data, setData] = useState<unknown>(example.data);
  const [tab, setTab] = useState(0);
  const validator = useMemo(
    () => createValidator(validation, example.schema),
    [validation, example],
  );

  const formKey = `${example.id}:${validation}:${engineChoice}`;
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
        <label className="app-select">
          Validation{' '}
          <select
            value={validation}
            onChange={(event) =>
              setValidation(event.target.value as ValidationChoice)
            }
          >
            {validationChoices.map((choice) => (
              <option key={choice.id} value={choice.id}>
                {choice.label}
              </option>
            ))}
          </select>
        </label>
        <label className="app-select">
          Engine{' '}
          <select
            value={engineChoice}
            onChange={(event) =>
              setEngineChoice(event.target.value as EngineChoice)
            }
          >
            {engineChoices.map((choice) => (
              <option key={choice.id} value={choice.id}>
                {choice.label}
              </option>
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
          <p className="app-validator">
            Validation: {describeValidator(validation, example.schema)}
            <br />
            Engine: {describeEngine(engineChoice)}
          </p>
          {engineChoice === 'worker' ? (
            <RemoteEngineForm
              key={formKey}
              inputs={{
                schema: example.schema,
                uischema: example.uischema,
                data: example.data,
                validation,
              }}
              renderers={vanillaRenderers}
              onChange={(event) => setData(event.data)}
              fallback={<p>Starting server engine…</p>}
            />
          ) : (
            <JsonForms
              key={formKey}
              schema={example.schema}
              uischema={example.uischema}
              data={example.data}
              validator={validator}
              renderers={vanillaRenderers}
              onChange={(event) => setData(event.data)}
            />
          )}
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
