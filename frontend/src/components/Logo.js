import * as React from 'react';
import styled from '@emotion/styled';

const StyledLogo = styled.div`
  img {
    display: block;
    margin: auto;
    width: 100%;
    max-width: 200px;
  }
`;
const Logo = () => (
  <StyledLogo>
    <img alt="logo" src="/logo.png" />
  </StyledLogo>
);

export default Logo;
