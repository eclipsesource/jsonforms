import React from 'react';
import Button from '@material-ui/core/Button';
import Link from '@docusaurus/Link';

export default ({ to, label }) => {
  return (<Button variant='contained' to={to} component={Link} color='primary'>{label}</Button>);
}
