import has from 'lodash/has';
import React from 'react';
import { Icon } from '@material-ui/core';
import { Work } from '@material-ui/icons';
import { JsonSchema } from '@jsonforms/core';

const isUserGroup = (schema: JsonSchema) => has(schema.properties, 'users');
const isTask = (schema: JsonSchema) => has(schema.properties, 'done');
const isUser = (schema: JsonSchema) => has(schema.properties, 'birthday');

export const imageProvider = (schema: JsonSchema): React.ReactElement<any> | string => {

    if (isTask(schema)) {
         return 'icon task';
    } else if (isUserGroup(schema)) {
        return (
            <Icon
                className={'icon userGroup'}
                fontSize={'inherit'}
            />
        );
    } else if (isUser(schema)) {
        return <Work/>;
    }

    return (<Icon />);
};
