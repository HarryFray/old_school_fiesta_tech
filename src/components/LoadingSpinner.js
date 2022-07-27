import React from 'react';
import styled from 'styled-components';

import Logo from '../images/Logo.ico';

const StyledLoadingSpinner = styled.div`
  img {
    animation: rotation 2s infinite linear;
    height: 44px;
    width: 44px;
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
`;

const LoadingSpinner = () => {
  return (
    <StyledLoadingSpinner>
      <img src={Logo} alt="Loading Spinner" />
    </StyledLoadingSpinner>
  );
};

export default LoadingSpinner;
