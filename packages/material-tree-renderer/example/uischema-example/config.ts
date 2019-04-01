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
export const labelProvider = {
  '#root': 'label',
  '#elements': '',
  '#horizontallayout': '',
  '#verticallayout': '',
  '#categorization': '',
  '#control': 'label',
  '#category': 'label',
  '#group': 'label',
  '#rule': '',
  '#scope': '',
  '#labelObject': '',
  '#options': ''
};

export const imageProvider = {
  '#root': 'task',
  '#elements': 'task',
  '#categorization': 'task',
  '#control': 'task',
  '#category': 'task',
  '#group': 'task',
  '#rule': 'task',
  '#scope': 'task',
  '#labelObject': 'task',
  '#options': 'task',
  '#horizontallayout': 'task',
  '#verticallayout': 'task'
};

export const modelMapping = {
  attribute: 'type',
  mapping: {
    root: '#root',
    elements: '#elements',
    HorizontalLayout: '#horizontallayout',
    VerticalLayout: '#verticallayout',
    Categorization: '#categorization',
    Control: '#control',
    Category: '#category',
    Group: '#group',
    rule: '#rule',
    scope: '#scope',
    labelObject: '#labelObject',
    options: '#options'
  }
};

export const detailSchemata = {};
