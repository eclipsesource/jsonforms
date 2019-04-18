import styled from 'styled-components'

export const UnorderedList = styled.ul`
  list-style: none;
  & li::before {
    font-weight: bold;
    margin-right: 5px;
  }
  ul li {
    padding-left: 25px;
  }
`