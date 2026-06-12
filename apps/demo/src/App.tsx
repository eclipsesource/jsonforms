import { useMemo, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { JsonForms } from '@jsonforms/react';
import { materialRenderers } from '@jsonforms/react-material';
import { ajvValidator } from '@jsonforms/validator-ajv';
import { initialData, personSchema, personUISchema } from './person';

export const App = () => {
  const [data, setData] = useState<unknown>(initialData);
  const [tab, setTab] = useState(0);
  const validator = useMemo(() => ajvValidator(personSchema), []);

  const panels = [
    { label: 'Data', content: data },
    { label: 'JSON Schema', content: personSchema },
    { label: 'UI Schema', content: personUISchema },
  ];

  return (
    <>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6">JSON Forms 4</Typography>
          <Typography variant="body2" sx={{ ml: 2, opacity: 0.75 }}>
            Presentation-model MVP demo
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          sx={{ alignItems: 'flex-start' }}
        >
          <Card variant="outlined" sx={{ flex: 3, width: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Form
              </Typography>
              <JsonForms
                schema={personSchema}
                uischema={personUISchema}
                data={initialData}
                validator={validator}
                renderers={materialRenderers}
                onChange={(event) => setData(event.data)}
              />
            </CardContent>
          </Card>
          <Card variant="outlined" sx={{ flex: 2, width: '100%' }}>
            <Tabs
              value={tab}
              onChange={(_event, value: number) => setTab(value)}
            >
              {panels.map((panel) => (
                <Tab key={panel.label} label={panel.label} />
              ))}
            </Tabs>
            <CardContent>
              <Box
                component="pre"
                sx={{ m: 0, fontSize: 13, lineHeight: 1.5, overflow: 'auto' }}
              >
                {JSON.stringify(panels[tab]?.content, null, 2)}
              </Box>
            </CardContent>
          </Card>
        </Stack>
      </Container>
    </>
  );
};
