import { createGlobalStyle } from 'styled-components'
import getter from 'lodash/get';

export const get = (val, defaultValue) => (p) =>
  getter(p, `theme.docz.${val}`, defaultValue)

//  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro:400,600');
//  @import url('https://fonts.googleapis.com/css?family=Inconsolata');
export const Global = createGlobalStyle`
  @import url('https://unpkg.com/codemirror@5.42.0/lib/codemirror.css');
  @import url('https://unpkg.com/codemirror@5.42.0/theme/solarized.css');
  .icon-link {
    display: none;
  }
  body {
    margin: 0;
    padding: 0;
    ${get('styles.body')};
  }
  .with-overlay {
    overflow: hidden;
  }
  html,
  body,
  #root {
    height: 100%;
    min-height: 100%;
  }
`