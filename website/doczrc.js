import { css } from 'docz-plugin-css'

export default {
  title: "JSON Forms",
  plugins: [
    css({
      preprocessor: "postcss",
      cssmodules: true,
      loaderOpts: {
        /* whatever your preprocessor loader accept */
      }
    })
  ],
  public: "public",
  indexHtml: "public/index.html",
  htmlContext: {
    favicon: 'public/favicon.ico',
    head: {
      links: [
        {
          rel: "stylesheet",
          href:
            "https://cdnjs.cloudflare.com/ajax/libs/prism/1.6.0/themes/prism-solarizedlight.min.css"
        }
      ]
    }
  },
  theme: "src/theme",
  themeConfig: {
    colors: {
      link: "rgb(17, 179, 187)"
    }
  }
};
