import * as React from 'react';
import * as _ from 'lodash';
import { Icon } from '@material-ui/core';
import { Work } from '@material-ui/icons';
import { JsonSchema } from '@jsonforms/core';

const isUserGroup = (schema: JsonSchema) => _.has(schema.properties, 'users');
const isTask = (schema: JsonSchema) => _.has(schema.properties, 'done');
const isUser = (schema: JsonSchema) => _.has(schema.properties, 'birthday');

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
