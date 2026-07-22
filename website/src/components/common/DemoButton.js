import React from 'react';
import Button from '@mui/material/Button';
import Link from '@docusaurus/Link';

const CustomLink = React.forwardRef((props, ref) => <Link {...props} />);

export const DemoButton = ({ to, label }) => {
  return (<Button variant='contained' to={to} component={CustomLink} color='primary'>{label}</Button>);
}

export default DemoButton;
