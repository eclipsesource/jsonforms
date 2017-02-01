'use strict';

require('jsonforms/dist/jsonforms.css');
require('jsonforms/dist/jsonforms-material.css');

require('jsonforms');
require('jsonforms/material/jsonforms-material');
require('jsonforms/dist/ts-build/examples/jsonforms-examples');


require('./arrays.controller');
require('./async.controller');
require('./categories.controller');
require('./custom.controller');
//require('./custom.jsf');
require('./generate-schema.controller');
require('./generate-ui.controller');
require('./layouts.controller');
require('./live-edit.controller');
require('./masterdetail.controller');
require('./person.controller');
require('./remote-ref.controller');
require('./rule.controller');

// Dependencies are specified in router in Router
angular.module('examples', []);
