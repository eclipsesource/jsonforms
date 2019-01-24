import isString from 'lodash/isString';
import React from 'react';
import { Icon } from '@material-ui/core';

export const wrapImageIfNecessary =
    (el: React.ReactElement<any> | string): React.ReactElement<any> => {

    if (isString(el)) {
        return (<Icon className={el} fontSize={'inherit'}/>);
    }

    return el as React.ReactElement<any>;
};
