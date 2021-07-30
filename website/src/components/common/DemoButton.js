import React from 'react';
import Button from '@material-ui/core/Button';
import Link from '@docusaurus/Link';

export const DemoButton = ({ to, label }) => {
  return (<Button variant='contained' to={to} component={Link} color='primary'>{label}</Button>);
}

export default DemoButton;
