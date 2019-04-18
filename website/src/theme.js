import React from 'react'
import { useConfig, ComponentsProvider } from 'docz'
import { components, enhance } from 'docz-theme-default'
import Layout from './components/layout'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { Global } from './components/Global';
import { UnorderedList } from './components/UnorderedList';
import { OrderedList } from './components/OrderedList';
import Loading from './components/Loading';


export const ThemeProvider = ({ children, ...props }) => {
  const config = useConfig()
  const next = (prev) => ({ ...prev, docz: config.themeConfig })

  return (
    <StyledThemeProvider theme={next}>
      <React.Fragment>{children}</React.Fragment>
    </StyledThemeProvider>
  )
}

const map = {
  ...components,
  loading: Loading,
  page: Layout,
  ul: UnorderedList,
  ol: OrderedList,
  notFound: () => <Layout>Not found</Layout>,
}

const Theme = ({ children }) => (
  <ThemeProvider>
    <Global />
    <ComponentsProvider components={map}>{children}</ComponentsProvider>
  </ThemeProvider>
)

//export const enhance2 = theme(
//  config,
//  ({ mode, codemirrorTheme, ...config }) => ({
//    ...config,
//    mode,
//    codemirrorTheme: 'solarized', //codemirrorTheme || `docz-${mode}`,
//    colors: {
//      light,//...get(modes, mode),
//      ...config.colors,
//    },
//  })
//)

export default enhance(Theme)