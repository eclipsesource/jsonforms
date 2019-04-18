import React from 'react';
import Button from '@material-ui/core/Button';
import { Link } from 'docz';

export default ({ to, label }) => {
    return (<Button variant='contained' component={Link} to={to} color='primary'>{label}</Button>);
}