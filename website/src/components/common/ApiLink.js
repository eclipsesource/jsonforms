import React from 'react';

const basePath = "/api/"

const ApiLink = ({ link, title, children }) => (
  <a href={basePath+link} className='link'>{title || children}</a>
);

export default ApiLink;