import { useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import type { FormValidator, PresentationModel } from '@jsonforms/core';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers } from '@jsonforms/react-material';
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
  const [model, setModel] = useState<PresentationModel | undefined>(undefined);
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
    {
      label: 'Presentation Model',
      content: JSON.stringify(model, null, 2),
    },
  ];

  return (
    <>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6">JSON Forms 4</Typography>
          <Typography variant="body2" sx={{ ml: 2, opacity: 0.75 }}>
            React Material renderer set
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          sx={{ alignItems: 'flex-start' }}
        >
          <Card
            variant="outlined"
            sx={{ width: { xs: '100%', md: 280 }, flexShrink: 0 }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Settings
              </Typography>
              <Stack spacing={2}>
                <Typography variant="subtitle2">Validation</Typography>
                <FormControl size="small" fullWidth>
                  <InputLabel id="validation-select-label">
                    Validator
                  </InputLabel>
                  <Select
                    labelId="validation-select-label"
                    label="Validator"
                    value={validation}
                    onChange={(event) =>
                      setValidation(event.target.value as ValidationChoice)
                    }
                  >
                    {validationChoices.map((choice) => (
                      <MenuItem key={choice.id} value={choice.id}>
                        {choice.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {validation === 'ajv' && (
                  <>
                    <FormControl size="small" fullWidth>
                      <InputLabel id="ajv-version-select-label">
                        AJV version
                      </InputLabel>
                      <Select
                        labelId="ajv-version-select-label"
                        label="AJV version"
                        value={ajvVersion}
                        onChange={(event) =>
                          setAjvVersion(event.target.value as AjvVersion)
                        }
                      >
                        {ajvVersionChoices.map((choice) => (
                          <MenuItem key={choice.id} value={choice.id}>
                            {choice.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={ajvAsync}
                          onChange={(_event, checked) => setAjvAsync(checked)}
                        />
                      }
                      label="Async"
                    />
                  </>
                )}
                <Divider />
                <Typography variant="subtitle2">Engine</Typography>
                <FormControl size="small" fullWidth>
                  <InputLabel id="engine-select-label">Location</InputLabel>
                  <Select
                    labelId="engine-select-label"
                    label="Location"
                    value={engineChoice}
                    onChange={(event) =>
                      setEngineChoice(event.target.value as EngineChoice)
                    }
                  >
                    {engineChoices.map((choice) => (
                      <MenuItem key={choice.id} value={choice.id}>
                        {choice.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {engineChoice === 'worker' && (
                  <>
                    <TextField
                      size="small"
                      fullWidth
                      type="number"
                      label="Artificial delay (ms)"
                      value={responseDelayMs}
                      onChange={(event) =>
                        setResponseDelayMs(
                          Math.max(0, Number(event.target.value) || 0),
                        )
                      }
                      slotProps={{ htmlInput: { min: 0, step: 50 } }}
                    />
                    <TextField
                      size="small"
                      fullWidth
                      type="number"
                      label="Reject changes (%)"
                      value={rejectChangesPercent}
                      onChange={(event) =>
                        setRejectChangesPercent(
                          Math.min(
                            100,
                            Math.max(0, Number(event.target.value) || 0),
                          ),
                        )
                      }
                      slotProps={{ htmlInput: { min: 0, max: 100, step: 10 } }}
                    />
                  </>
                )}
                <Divider />
                <Typography variant="subtitle2">Config</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showIssuesOnTouch}
                      onChange={(_event, checked) =>
                        setShowIssuesOnTouch(checked)
                      }
                    />
                  }
                  label="Show issues only after touch"
                />
              </Stack>
            </CardContent>
          </Card>
          <Stack spacing={3} sx={{ flex: 1, minWidth: 0, width: '100%' }}>
            <FormControl size="small" sx={{ maxWidth: 360 }}>
              <InputLabel id="example-select-label">Example</InputLabel>
              <Select
                labelId="example-select-label"
                label="Example"
                value={exampleId}
                onChange={(event) => setExampleId(event.target.value)}
              >
                {exampleGroups.flatMap((group) => [
                  <ListSubheader key={group.id}>{group.title}</ListSubheader>,
                  ...group.examples.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.title}
                    </MenuItem>
                  )),
                ])}
              </Select>
            </FormControl>
            <Stack
              direction={{ xs: 'column', lg: 'row' }}
              spacing={3}
              sx={{ alignItems: 'flex-start' }}
            >
              <Card variant="outlined" sx={{ flex: 3, width: '100%' }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {example.title}
                  </Typography>
                  {example.description !== undefined && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {example.description}
                    </Typography>
                  )}
                  {validatorResult.error !== undefined ? (
                    <Alert severity="error">
                      Creating the validator failed: {validatorResult.error}
                    </Alert>
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
                      renderers={materialRenderers}
                      onChange={(event) => {
                        setData(event.data);
                        setModel(event.model);
                      }}
                      fallback={
                        <Typography variant="body2">
                          Starting server engine…
                        </Typography>
                      }
                    />
                  ) : (
                    <JsonForms
                      key={formKey}
                      schema={example.schema}
                      uischema={example.uischema}
                      data={example.data}
                      validator={validatorResult.validator}
                      config={config}
                      renderers={materialRenderers}
                      onChange={(event) => {
                        setData(event.data);
                        setModel(event.model);
                      }}
                    />
                  )}
                </CardContent>
              </Card>
              <Card variant="outlined" sx={{ flex: 2, width: '100%' }}>
                <Tabs
                  value={tab}
                  onChange={(_event, value: number) => setTab(value)}
                  variant="scrollable"
                  scrollButtons="auto"
                >
                  {panels.map((panel) => (
                    <Tab key={panel.label} label={panel.label} />
                  ))}
                </Tabs>
                <CardContent>
                  <Box
                    component="pre"
                    sx={{
                      m: 0,
                      fontSize: 13,
                      lineHeight: 1.5,
                      overflow: 'auto',
                    }}
                  >
                    {panels[tab]?.content}
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </>
  );
};
