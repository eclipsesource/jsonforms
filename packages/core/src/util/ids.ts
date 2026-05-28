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

const usedIds: Set<string> = new Set<string>();

const makeId = (idBase: string, iteration: number) =>
  iteration <= 1 ? idBase : idBase + iteration.toString();

const isUniqueId = (idBase: string, iteration: number) => {
  const newID = makeId(idBase, iteration);
  return !usedIds.has(newID);
};

export const createId = (proposedId: string) => {
  if (proposedId === undefined) {
    // failsafe to avoid endless loops in error cases
    proposedId = 'undefined';
  }
  let tries = 0;
  while (!isUniqueId(proposedId, tries)) {
    tries++;
  }
  const newID = makeId(proposedId, tries);
  usedIds.add(newID);
  return newID;
};

export const removeId = (id: string) => usedIds.delete(id);

export const clearAllIds = () => usedIds.clear();

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
