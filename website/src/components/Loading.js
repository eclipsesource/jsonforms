import React from 'react';
import styled from 'styled-components'
import { CircularProgress } from '@material-ui/core';
import Layout from './layout'

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
`

export default () => {
  return (
      <Wrapper>
        <CircularProgress disableShrink />
      </Wrapper>
  );
}