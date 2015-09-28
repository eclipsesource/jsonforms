## Release Notes

### v0.2.0 (2015-05012)

* Replace file loading with [path-loader](https://github.com/whitlockjc/path-loader)

### v0.1.10 (2015-04-16)

* Fixed an issue due to difference in superagent in browser vs. Node.js

### v0.1.9 (2015-04-16)

* Fixed a browser build issue

### v0.1.8 (2015-04-16)

* Updated `isRemotePointer` to only return `true` for explicit URLs or relative paths

### v0.1.7 (2015-04-16)

* Added support in `resolveRefs` to alter a remote request prior to sending the request _(Useful for authentication)_
_(Issue #12)_
* Added support in `resolveRefs` to process the remote request responses
* Fixed bug in `resolveRefs` where multiple remote references resulted in callback being called multiple times
* Updated `isRemotePointer` to handle relative references and file URL references _(Issue #9)_
* Updated `resolveRefs` to return resolution metadata _(What references were resolved, where they were located and what
they resolved to)_
