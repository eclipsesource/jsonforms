import { rankWith, scopeEndsWith } from '@jsonforms/core';

export default rankWith(Number.MAX_VALUE, scopeEndsWith('rating'));
