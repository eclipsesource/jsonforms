import React from 'react';
import { Provider } from 'react-redux';
import { JsonForms } from '@jsonforms/react';
import { layout } from '@jsonforms/examples';
import {createJsonFormsStore} from "../../../../common/store";
import { Demo } from "../../../../components/common"

export const Layouts = {
  horizontal: layout.uischemaHorizontal
};