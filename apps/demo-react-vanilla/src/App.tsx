import { useMemo, useState } from 'react';
import type { FormValidator } from '@jsonforms/core';
import { JsonForms } from '@jsonforms/react';
import { vanillaRenderers } from '@jsonforms/react-vanilla';
import { allExamples, exampleGroups, findExample } from '@jsonforms/examples';
import type {
  AjvVersion,
  EngineChoice,
  ValidationChoice,
  ValidationSettings,
} from '@jsonforms/demo-shared';
import {
  ajvVersionChoices,
  createValidator,
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
  const [ajvVersion, setAjvVersion] = useState<AjvVersion>('default');
  const [ajvAsync, setAjvAsync] = useState(false);
  const [engineChoice, setEngineChoice] = useState<EngineChoice>('local');
  const [responseDelayMs, setResponseDelayMs] = useState(0);
  const [rejectChangesPercent, setRejectChangesPercent] = useState(0);
  const [showIssuesOnTouch, setShowIssuesOnTouch] = useState(false);
  const [data, setData] = useState<unknown>(example.data);
  const [tab, setTab] = useState(0);

  const validationSettings = useMemo<ValidationSettings>(
    () => ({ choice: validation, ajvVersion, ajvAsync }),
    [validation, ajvVersion, ajvAsync],
  );
  const validatorResult = useMemo<{
    validator?: FormValidator;
    error?: string;
  }>(() => {
    try {
      return {
        validator: createValidator(validationSettings, example.schema),
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : String(error) };
    }
  }, [validationSettings, example]);
  const config = useMemo(() => ({ showIssuesOnTouch }), [showIssuesOnTouch]);
  const simulation = useMemo(
    () => ({ responseDelayMs, rejectChangesPercent }),
    [responseDelayMs, rejectChangesPercent],
  );

  const formKey = [
    example.id,
    validation,
    ajvVersion,
    ajvAsync,
    engineChoice,
    responseDelayMs,
    rejectChangesPercent,
    showIssuesOnTouch,
  ].join(':');
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
        <aside className="app-panel app-sidebar">
          <h2>Settings</h2>
          <h3 className="app-group-heading">Validation</h3>
          <label className="app-field">
            Validator
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
          {validation === 'ajv' && (
            <>
              <label className="app-field">
                AJV version
                <select
                  value={ajvVersion}
                  onChange={(event) =>
                    setAjvVersion(event.target.value as AjvVersion)
                  }
                >
                  {ajvVersionChoices.map((choice) => (
                    <option key={choice.id} value={choice.id}>
                      {choice.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="app-checkbox">
                <input
                  type="checkbox"
                  checked={ajvAsync}
                  onChange={(event) => setAjvAsync(event.target.checked)}
                />
                Async
              </label>
            </>
          )}
          <h3 className="app-group-heading">Engine</h3>
          <label className="app-field">
            Location
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
          {engineChoice === 'worker' && (
            <>
              <label className="app-field">
                Artificial delay (ms)
                <input
                  type="number"
                  min={0}
                  step={50}
                  value={responseDelayMs}
                  onChange={(event) =>
                    setResponseDelayMs(
                      Math.max(0, Number(event.target.value) || 0),
                    )
                  }
                />
              </label>
              <label className="app-field">
                Reject changes (%)
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={10}
                  value={rejectChangesPercent}
                  onChange={(event) =>
                    setRejectChangesPercent(
                      Math.min(
                        100,
                        Math.max(0, Number(event.target.value) || 0),
                      ),
                    )
                  }
                />
              </label>
            </>
          )}
          <h3 className="app-group-heading">Config</h3>
          <label className="app-checkbox">
            <input
              type="checkbox"
              checked={showIssuesOnTouch}
              onChange={(event) => setShowIssuesOnTouch(event.target.checked)}
            />
            Show issues only after touch
          </label>
        </aside>
        <section className="app-panel app-panel--form">
          <h2>{example.title}</h2>
          {example.description !== undefined && (
            <p className="app-description">{example.description}</p>
          )}
          {validatorResult.error !== undefined ? (
            <p className="app-error">
              Creating the validator failed: {validatorResult.error}
            </p>
          ) : engineChoice === 'worker' ? (
            <RemoteEngineForm
              key={formKey}
              inputs={{
                schema: example.schema,
                uischema: example.uischema,
                data: example.data,
                validation: validationSettings,
                config,
              }}
              simulation={simulation}
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
              validator={validatorResult.validator}
              config={config}
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
