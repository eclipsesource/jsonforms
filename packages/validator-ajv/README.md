# @jsonforms/validator-ajv

[AJV](https://ajv.js.org/)-backed `FormValidator` implementation for JSON Forms 4.x.

`@jsonforms/core` deliberately has no validation dependency — validation is a pluggable
service. This package provides the default JSON Schema validator:

```ts
import { createFormEngine, jsonSchemaSource } from '@jsonforms/core';
import { ajvValidator } from '@jsonforms/validator-ajv';

const engine = createFormEngine({
  schemaSource: jsonSchemaSource(schema),
  validator: ajvValidator(schema),
  data,
});
```

Environments that cannot run AJV (e.g. CSP without `unsafe-eval`) can implement
`FormValidator` differently — precompiled standalone validators, custom validators, or
server-side validation.
