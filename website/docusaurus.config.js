const path = require('path');

module.exports = {
  title: 'JSON Forms',
  tagline: 'More forms. Less code.',
  url: 'https://jsonforms.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'eclipsesource',
  projectName: 'jsonforms',
  titleDelimiter: '-',
  scripts: [
    {
      src: 'https://static.cloudflareinsights.com/beacon.min.js',
      defer: true,
      'data-cf-beacon':
        '{"token": "b2ec7b485fc04039bf1a9fbd51005477"}',
    },
  ],
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true,
    },
    prism: {
      additionalLanguages: ['json'],
    },
    navbar: {
      title: 'JSON Forms',
      style: 'dark',
      logo: {
        alt: 'JSON Forms Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'examples/basic',
          label: 'Examples',
          activeBasePath: 'examples',
          position: 'left',
        },
        {
          to: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          to: 'faq',
          label: 'FAQ',
          position: 'left',
        },
        {
          to: 'community',
          label: 'Community',
          position: 'left'
        },
        {
          to: 'news',
          label: 'News',
          position: 'left',
        },
        {
          to: 'support',
          label: 'Professional Support',
          position: 'right',
        },
        {
          href: 'https://github.com/eclipsesource/jsonforms',
          className: 'header-github-link',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/eclipsesource/jsonforms',
            },
            {
              label: 'Discourse',
              href: 'https://jsonforms.discourse.group',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Twitter',
              href: 'https://twitter.com/JSONForms',
            },
            {
              label: 'EclipseSource Blog',
              href: 'https://eclipsesource.com/blogs/tag/jsonforms',
            },
          ],
        },
        {
          title: 'Legal',
          items: [
            {
              label: 'Imprint',
              href: 'https://eclipsesource.com/imprint',
            },
            {
              label: 'Privacy Policy',
              href: 'https://www.iubenda.com/privacy-policy/83048734',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} EclipseSource`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        theme: {
          customCss: require.resolve('./src/css/global.css'),
        },
        docs: false,
        blog: false,
        pages: false,
      },
    ],
  ],
  plugins: [
    path.resolve(__dirname, './src/custom-webpack'),
    'docusaurus2-dotenv',
    [
      '@docusaurus/plugin-content-pages',
      {
        path: 'content/pages',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'default',
        breadcrumbs: false,
        path: 'content/docs',
        routeBasePath: 'docs',
        sidebarPath: require.resolve('./src/sidebars/docs.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'examples',
        breadcrumbs: false,
        path: 'content/examples',
        routeBasePath: 'examples',
        sidebarPath: require.resolve('./src/sidebars/examples.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'faq',
        path: 'content/faq',
        routeBasePath: 'faq',
        sidebarPath: require.resolve('./src/sidebars/faq.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'community',
        path: 'content/community',
        routeBasePath: 'community',
        sidebarPath: require.resolve('./src/sidebars/community.js'),
      },
    ],
    [
      '@docusaurus/plugin-content-blog',
      {
        id: 'news',
        path: 'content/news',
        routeBasePath: 'news',
        blogTitle: 'News',
        blogSidebarTitle: 'Latest News',
        showReadingTime: false,
        blogSidebarCount: 'ALL',
      },
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        redirects: [
          {
            to: '/docs/tutorial',
            from: '/docs/tutorial-typescript',
          },
          {
            to: '/docs/integrations/angular',
            from: '/docs/angular',
          },
          {
            to: '/docs/integrations/react',
            from: ['/docs/react', '/docs/integration'],
          },
          {
            to: '/docs/deprecated/redux',
            from: '/docs/redux',
          },
          {
            to: '/docs/deprecated/store',
            from: '/docs/store',
          },
          {
            to: '/docs/deprecated/available-actions',
            from: '/docs/available-actions',
          },
          {
            to: '/docs/tutorial/custom-layouts',
            from: '/docs/custom-layouts',
          },
          {
            to: '/docs/tutorial/custom-renderers',
            from: '/docs/custom-renderers',
          },
          {
            to: '/docs/tutorial/multiple-forms',
            from: '/docs/multiple-forms',
          },
          {
            to: '/examples/basic',
            from: '/examples/person',
          },
          {
            to: '/examples/basic',
            from: '/examples',
          },
          {
            to: '/docs/api',
            from: '/api',
          },
        ],
      },
    ],
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        docsDir: "./content/docs",
        blogDir: "./content/news"
      },
    ]
  ],
};
