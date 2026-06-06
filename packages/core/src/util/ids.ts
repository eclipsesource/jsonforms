/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/

interface PrefixState {
  used: Set<number>;
  next: number;
}

const idSlots = new Map<string, { prefix: string; index: number }>();
const prefixStates = new Map<string, PrefixState>();

const makeId = (idBase: string, iteration: number) =>
  iteration <= 1 ? idBase : idBase + iteration.toString();

export const createId = (proposedId: string) => {
  if (proposedId === undefined) {
    // failsafe to avoid endless loops in error cases
    proposedId = 'undefined';
  }
  let state = prefixStates.get(proposedId);
  if (state === undefined) {
    state = { used: new Set<number>(), next: 0 };
    prefixStates.set(proposedId, state);
  }
  // Start from the smallest index that hasn't been allocated for this prefix.
  // Holes left by removeId reset `next`, so released ids are reused.
  let tries = state.next;
  while (state.used.has(tries) || idSlots.has(makeId(proposedId, tries))) {
    tries++;
  }
  const newId = makeId(proposedId, tries);
  state.used.add(tries);
  state.next = tries + 1;
  idSlots.set(newId, { prefix: proposedId, index: tries });
  return newId;
};

export const removeId = (id: string) => {
  const slot = idSlots.get(id);
  if (slot === undefined) {
    return false;
  }
  idSlots.delete(id);
  const state = prefixStates.get(slot.prefix);
  if (state !== undefined) {
    state.used.delete(slot.index);
    if (slot.index < state.next) {
      state.next = slot.index;
    }
    if (state.used.size === 0) {
      prefixStates.delete(slot.prefix);
    }
  }
  return true;
};

export const clearAllIds = () => {
  idSlots.clear();
  prefixStates.clear();
};

/**
 * Mutable registry of the ID generation functions used internally by JSON Forms.
 *
 * Adopters can override one or more of these methods to provide a custom HTML
 * ID strategy (e.g. for performance reasons or to integrate with an existing
 * scheme). Reassigning the methods only affects callers that go through this
 * object; the standalone `createId`, `removeId` and `clearAllIds` exports
 * always invoke the default implementations.
 *
 * @example
 * ```ts
 * import { Id } from '@jsonforms/core';
 *
 * let next = 0;
 * Id.createId = () => `jf-${next++}`;
 * Id.removeId = () => true;
 * Id.clearAllIds = () => {
 *   next = 0;
 * };
 * ```
 */
export const Id: {
  createId: (proposedId: string) => string;
  removeId: (id: string) => boolean;
  clearAllIds: () => void;
} = {
  createId,
  removeId,
  clearAllIds,
};
