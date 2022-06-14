import React from "react";
import styled from "styled-components";

import faveIcon from "../images/favicon.ico";

const StyledLoadingSpinner = styled.div`
  img {
    animation: rotation 2s infinite linear;
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
      <img src={faveIcon} alt="Loading Spinner" width="36" height="36" />
    </StyledLoadingSpinner>
  );
};

export default LoadingSpinner;
