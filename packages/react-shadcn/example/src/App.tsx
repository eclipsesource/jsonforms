import { useState, useEffect } from 'react';
import { JsonForms } from '@jsonforms/react';
import { shadcnRenderers, shadcnCells, Button } from '@jsonforms/react-shadcn';

const schema = {
  type: 'object',
  required: ['name', 'age'],
  properties: {
    name: {
      type: 'string',
      minLength: 2,
      description: 'Your full name',
    },
    email: {
      type: 'string',
      format: 'email',
      description: 'We will never share your email',
    },
    age: {
      type: 'number',
      minimum: 0,
      maximum: 150,
      description: 'Your age in years',
    },
    newsletter: {
      type: 'boolean',
      description: 'Subscribe to our newsletter',
    },
    country: {
      type: 'string',
      enum: ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'France'],
      description: 'Select your country',
    },
    bio: {
      type: 'string',
      description: 'Tell us about yourself',
    },
    address: {
      type: 'object',
      properties: {
        street: {
          type: 'string',
          description: 'Street address',
        },
        city: {
          type: 'string',
          description: 'City',
        },
        zipCode: {
          type: 'string',
          description: 'Postal code',
        },
      },
    },
  },
};

const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/name',
        },
        {
          type: 'Control',
          scope: '#/properties/email',
        },
      ],
    },
    {
      type: 'HorizontalLayout',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/age',
        },
        {
          type: 'Control',
          scope: '#/properties/country',
        },
      ],
    },
    {
      type: 'Control',
      scope: '#/properties/newsletter',
    },
    {
      type: 'Control',
      scope: '#/properties/bio',
      options: {
        multi: true,
        rows: 5,
        placeholder: 'Tell us about yourself...',
      },
    },
    {
      type: 'Group',
      label: 'Address Information',
      elements: [
        {
          type: 'Control',
          scope: '#/properties/address/properties/street',
        },
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/address/properties/city',
            },
            {
              type: 'Control',
              scope: '#/properties/address/properties/zipCode',
            },
          ],
        },
      ],
    },
  ],
};

const initialData = {
  name: 'John Doe',
  age: 30,
  newsletter: true,
  country: 'USA',
};

type Theme = 'light' | 'dark' | 'system';

function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'system';
    }
    return 'system';
  });

  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (resolvedTheme: 'light' | 'dark') => {
      if (resolvedTheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches ? 'dark' : 'light');

      const handler = (e: MediaQueryListEvent) =>
        applyTheme(e.matches ? 'dark' : 'light');
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      applyTheme(theme);
    }
  }, [theme]);

  const setThemeAndPersist = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return { theme, setTheme: setThemeAndPersist };
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <circle cx='12' cy='12' r='4' />
            <path d='M12 2v2' />
            <path d='M12 20v2' />
            <path d='m4.93 4.93 1.41 1.41' />
            <path d='m17.66 17.66 1.41 1.41' />
            <path d='M2 12h2' />
            <path d='M20 12h2' />
            <path d='m6.34 17.66-1.41 1.41' />
            <path d='m19.07 4.93-1.41 1.41' />
          </svg>
        );
      case 'dark':
        return (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' />
          </svg>
        );
      case 'system':
        return (
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <rect width='20' height='14' x='2' y='3' rx='2' />
            <line x1='8' x2='16' y1='21' y2='21' />
            <line x1='12' x2='12' y1='17' y2='21' />
          </svg>
        );
    }
  };

  return (
    <Button variant='outline' size='sm' onClick={cycleTheme} className='gap-2'>
      {getIcon()}
      <span className='capitalize'>{theme}</span>
    </Button>
  );
}

function App() {
  const [data, setData] = useState(initialData);

  return (
    <div className='min-h-screen p-8 bg-background text-foreground'>
      <div className='max-w-2xl mx-auto'>
        <div className='flex items-center justify-between mb-8'>
          <h1 className='text-3xl font-bold'>JSON Forms shadcn/ui Example</h1>
          <ThemeToggle />
        </div>

        <div className='mb-8 p-6 border rounded-lg bg-card text-card-foreground'>
          <JsonForms
            schema={schema}
            uischema={uischema}
            data={data}
            renderers={shadcnRenderers}
            cells={shadcnCells}
            onChange={({ data }) => setData(data)}
          />
        </div>

        <div className='p-6 border rounded-lg bg-muted text-muted-foreground'>
          <h2 className='text-xl font-semibold mb-4'>Form Data</h2>
          <pre className='text-sm overflow-auto'>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default App;
