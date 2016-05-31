# angular-marked

[![NPM version][npm-badge]][npm]
[![Downloads][download-badge]][npm]
![Downloads][bower-badge]

[![Build Status][travis-image]][travis-url]
[![Codacy Badge][codacy-badge]][Codacy]

[![js-semistandard-style][standard-badge]][semistandard]
[![License][license-badge]][MIT License]

AngularJS Markdown using [marked](https://github.com/chjj/marked).

**Please note:** neither this directive nor marked (by default) implement sanitization. As always, sanitizing is necessary for user-generated content.

## Install

`bower install angular-marked`

or

`npm install angular-marked`

or

`jspm install angular-marked=npm:angular-marked`

Depending on your setup you may need include script tags in your html:

```html
<script src="bower_components/marked/lib/marked.js"></script>
<script src="bower_components/angular-marked/dist/angular-marked.js"></script>
```

## Usage

```js
var app = angular.module('example-app', ['hc.marked']);
```

### Set default options (optional)

```js
app.config(['markedProvider', function (markedProvider) {
  markedProvider.setOptions({gfm: true});
}]);
```

Example using [highlight.js Javascript syntax highlighter](http://highlightjs.org/) (must include highlight.js script).

```js
app.config(['markedProvider', function (markedProvider) {
  markedProvider.setOptions({
    gfm: true,
    tables: true,
    highlight: function (code, lang) {
      if (lang) {
        return hljs.highlight(lang, code, true).value;
      } else {
        return hljs.highlightAuto(code).value;
      }
    }
  });
}]);

```

### Override Rendered Markdown Links

Example overriding the way custom markdown links are displayed to open in new windows:

```js
app.config(['markedProvider', function (markedProvider) {
  markedProvider.setRenderer({
    link: function(href, title, text) {
      return "<a href='" + href + "'" + (title ? " title='" + title + "'" : '') + " target='_blank'>" + text + "</a>";
    }
  });
}]);
```

### Use as a directive

```html
<marked>
  # Markdown directive
  *It works!*  
</marked>
```

Bind the markdown input to a scope variable:

```html
<div marked="my_markdown">
</div>
<!-- Uses $scope.my_markdown -->
```

Include a markdown file:

```html
<div marked src="'README.md'">
</div>
<!-- Uses markdown content from README.md -->
```

Or a template (great for md that includes code blocks):

```html
<script type="text/ng-template" id="tpl.md">
  ## Markdown

  **Code blocks**

      This is <b>bold</b>

  **Ampersands**

  Star Trek & Star Wars
</script>

<div marked src="'tpl.md'"></div>
<!-- Uses markdown content from tpl.md -->
```

Use ```compile``` attribute to support AngularJS directives inside markdown.

```html
<script type="text/ng-template" id="tpl.md">
  ## Markdown

  **This will go through $compile and will be effective**

  <button ng-click="doClick()"></button>

</script>

<div ng-controller="ClickHandler">
    <div marked src="'tpl.md'" compile="true"></div>
</div>
```

```javascript
.controller('ClickHandler', function() {
  this.doClick = function() {
    ...
  };
})
```

### As a service

```js
app.controller('myCtrl', ['marked', function (marked) {
  $scope.html = marked('#TEST');
}]);
```

## Testing

Install npm and bower dependencies:

```sh
npm install
bower install
npm test
```

## Why?

I wanted to use `marked` instead of `showdown` as used in `angular-markdown-directive` as well as expose the option to globally set defaults.  Yes, it is probably best to avoid creating a bunch of angular wrapper modules... but I use this enough across multiple projects to make it worth while for me.  Use it if you like.  Pull requests are welcome.

## Acknowledgments
Based on [angular-markdown-directive](https://github.com/btford/angular-markdown-directive) by [briantford](http://briantford.com/) which, in turn, is based on [this excellent tutorial](http://blog.angularjs.org/2012/05/custom-components-part-1.html) by [@johnlinquist](https://twitter.com/johnlindquist).

## License
Copyright (c) 2013-2015 Jayson Harshbarger

[MIT License]

[npm]: https://npmjs.org/package/angular-marked
[bower]: https://npmjs.org/package/angular-marked
[semistandard]: https://github.com/Flet/semistandard
[Codacy]: https://www.codacy.com/app/hypercubed/angular-marked
[MIT License]: http://en.wikipedia.org/wiki/MIT_License
[travis-url]: https://travis-ci.org/Hypercubed/angular-marked

[travis-image]: https://img.shields.io/travis/Hypercubed/angular-marked.svg
[npm-badge]: https://img.shields.io/npm/v/angular-marked.svg
[bower-badge]: https://img.shields.io/bower/v/angular-marked.svg
[standard-badge]: https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg
[download-badge]: http://img.shields.io/npm/dm/angular-marked.svg
[codacy-badge]: https://api.codacy.com/project/badge/grade/eef9605446ce4555bebb1c55f7b93e2b
[license-badge]: https://img.shields.io/badge/license-MIT-blue.svg
