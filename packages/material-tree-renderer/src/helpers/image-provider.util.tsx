import * as React from 'react';
import * as _ from 'lodash';
import { Icon } from '@material-ui/core';

export const wrapImageIfNecessary =
    (el: React.ReactElement<any> | string): React.ReactElement<any> => {

    if (_.isString(el)) {
        return (<Icon className={el} fontSize={'inherit'}/>);
    }

    return el as React.ReactElement<any>;
};
