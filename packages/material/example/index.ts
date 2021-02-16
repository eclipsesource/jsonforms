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
import { renderExample } from '../../example/src/index';
import { materialCells } from '../src';
import { extendedMaterialRenderers } from '../src/extended';
import { ExampleExtension } from './CustomAutocomplete';
import { ReactExampleDescription } from '../../example/src/util';

const addCustomAutocompleteControl = (examples: ReactExampleDescription[]) => {
  return examples.map(example => {
    if(example.name === 'enum'){
      const adjustedExample = Object.assign({}, example, {
        customReactExtension: ExampleExtension
      })
      return adjustedExample;
    }
    return example;
  });
};

renderExample(
  extendedMaterialRenderers,
  materialCells,
  addCustomAutocompleteControl
);
