import React from 'react';

const ApiLink = ({ link, title, children }) => (
  <a href={link} className='link'>{title || children}</a>
);

export default ApiLink;