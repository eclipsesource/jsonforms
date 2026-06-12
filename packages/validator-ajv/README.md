# @jsonforms/validator-ajv

[AJV](https://ajv.js.org/)-backed `FormValidator` implementations for JSON Forms 4.x.

`@jsonforms/core` deliberately has no validation dependency — validation is a pluggable
service. This package provides AJV adapters with **strict bundle hygiene**: you only ever
bundle the AJV build you actually import.

## Entry points

### `@jsonforms/validator-ajv` — bring your own AJV (no runtime AJV import)

The base entry imports AJV _types only_. Pass any AJV instance — any draft build, any
configuration, custom keywords, your own formats:

```ts
import Ajv2020 from 'ajv/dist/2020';
import { ajvValidator } from '@jsonforms/validator-ajv';

const validator = ajvValidator(schema, new Ajv2020({ allErrors: true }));
```

It also offers `compiledAjvValidator(validateFn)` for validate functions precompiled with
AJV's standalone code generation — for CSP environments without `unsafe-eval`, this involves
no AJV runtime at all — and `ajvErrorsToIssues(errors)` to map raw AJV errors yourself.

### `@jsonforms/validator-ajv/draft-07` · `…/draft-2019` · `…/draft-2020` — batteries included

Each preset entry imports exactly one AJV build plus `ajv-formats`, preconfigured with
form-friendly options (`allErrors`, lenient strict mode):

```ts
import { ajvValidator } from '@jsonforms/validator-ajv/draft-2020';

const validator = ajvValidator(schema); // optionally: ajvValidator(schema, ajvOptions)
```

Importing `…/draft-2020` will never pull the draft-07 build into your bundle, and vice
versa. Each preset also exports its `createAjv(options?)` if you need the configured
instance for other purposes (e.g. as a `ConditionEvaluator` backend later).

## Usage with the engine

```ts
import { createFormEngine, jsonSchemaSource } from '@jsonforms/core';
import { ajvValidator } from '@jsonforms/validator-ajv/draft-07';

const engine = createFormEngine({
  schemaSource: jsonSchemaSource(schema),
  validator: ajvValidator(schema),
  data,
});
```

Environments that cannot run AJV at all can implement `FormValidator` differently — custom
validators, other libraries, or server-side validation (sync or async).
