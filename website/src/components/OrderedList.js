import styled from 'styled-components'
import { get } from '../theme';

export const OrderedList = styled.ol`
  & li::before {
    font-weight: bold;
    margin-right: 5px;
  }
`