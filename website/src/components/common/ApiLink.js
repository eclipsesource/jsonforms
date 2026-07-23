import React from 'react';

const basePath = "/api/"

export const ApiLink = ({ link, title, children }) => {
  return (<a href={basePath+link} className='link'>{title || children}</a>)
};

export default ApiLink;
