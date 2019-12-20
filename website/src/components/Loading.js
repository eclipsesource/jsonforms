import React from 'react';
import styled from 'styled-components'
import { CircularProgress } from '@material-ui/core';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
`

export default () => {
  return (
    <Wrapper>
      <CircularProgress disableShrink />
    </Wrapper>
  );
}