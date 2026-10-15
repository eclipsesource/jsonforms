# @jsonforms/standard-schema

Use any [Standard Schema](https://standardschema.dev) library as the validator of JSON Forms: Valibot, Zod, ArkType and every other library implementing the spec.

The adapter gives JSON Forms the two things it needs from a schema written in such a library:

- the **JSON Schema** to render the form from, derived through [Standard JSON Schema](https://standardschema.dev/json-schema);
- a **Form Validator** that validates with the library itself.

Validation runs in the library, so no JSON Schema is compiled at runtime and no code is generated. That makes it work under a Content Security Policy without `unsafe-eval`, which Ajv's runtime compilation needs (see [eclipsesource/jsonforms#1498](https://github.com/eclipsesource/jsonforms/issues/1498)).

## Usage

```ts
import * as v from 'valibot';
import { toStandardJsonSchema } from '@valibot/to-json-schema';
import { fromStandardSchema } from '@jsonforms/standard-schema';

const person = v.object({
  name: v.pipe(v.string(), v.minLength(2)),
  age: v.optional(v.pipe(v.number(), v.integer(), v.minValue(18))),
});

const { jsonSchema, validator } = fromStandardSchema(person, {
  // Valibot exposes Standard JSON Schema through a separate package.
  // Zod 4.2+ and ArkType 2.1.28+ implement it on the schema itself, so the
  // option can be left out for them.
  jsonSchema: toStandardJsonSchema(person),
});
```

Then pass both to JSON Forms:

```tsx
<JsonForms
  schema={jsonSchema}
  validator={validator}
  data={data}
  renderers={renderers}
/>
```

```html
<json-forms
  :schema="jsonSchema"
  :validator="validator"
  :data="data"
  :renderers="renderers"
/>
<jsonforms
  [schema]="jsonSchema"
  [validator]="validator"
  [data]="data"
  [renderers]="renderers"
></jsonforms>
```

### Options

| Option       | Default      | Meaning                                                                                 |
| ------------ | ------------ | --------------------------------------------------------------------------------------- |
| `target`     | `'draft-07'` | JSON Schema dialect to derive. `draft-07` is what JSON Forms' default Ajv understands.  |
| `io`         | `'input'`    | Derive the schema's input type (what the user enters) or its output type.               |
| `jsonSchema` |              | A Standard JSON Schema object, or a ready JSON Schema, when the schema has none itself. |
| `keyFor`     |              | Override how a library issue maps to a JSON Schema keyword (drives `error.<keyword>`).  |

### How issues become JSON Forms errors

Each library issue becomes a JSON Forms `ValidationIssue`: its path turns into a JSON Pointer, and its kind is mapped to the JSON Schema keyword JSON Forms uses for translation (`minLength`, `minimum`, `pattern`, `format`, `enum`, `const`, `required`, ...). Valibot, Zod and ArkType issue shapes are recognised; anything else is reported as `custom`. JSON Forms core resolves the `parentSchema` of each error from the derived JSON Schema, so error placement and i18n work as with Ajv.

### Rules

Rule conditions in the UI schema are JSON Schema fragments. The library cannot evaluate them, so JSON Forms core evaluates them itself with its built-in schema matcher (`type`, `enum`, `const`, `required`, `minimum`, `maximum`, `pattern`, `not`, ...), again without code generation. Rules with `ValidateFunctionCondition` work as always.

### Limits

- Synchronous schemas only. JSON Forms 3.x validates synchronously; a schema returning a Promise throws on the first validation. Run asynchronous validation in a middleware and dispatch `updateErrors`.
- The validator is bound to the schema you pass. Call `fromStandardSchema` again when the schema changes.
- `format` is not evaluated in rule conditions.

## Proving the Content Security Policy case

1. Build an example app, for example `pnpm lerna run build:examples-app --scope=@jsonforms/vue-vanilla`.
2. Serve it with a policy that forbids `unsafe-eval`:

   ```sh
   node packages/standard-schema/scripts/serve-csp.cjs packages/vue-vanilla/example/dist 9091
   ```

3. Open <http://localhost:9091/> and pick the **Standard Schema (Valibot)** example: typing invalid values shows errors, rules work.
4. Pick any other example: the browser console reports that Ajv's schema compilation was blocked by the policy.

## License

MIT
