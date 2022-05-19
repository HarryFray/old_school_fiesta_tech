import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const StyledUnAuthorized = styled.div`
  display: flex;
  flex-direction: column;
  margin: 100px 0 0 0;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const UnAuthorized = () => {
  return (
    <StyledUnAuthorized>
      <h2>My person! You need to log in</h2>
      <h6 className="subtitle-2">
        Go back to the{" "}
        <Link to="auth" className="link">
          /auth
        </Link>{" "}
        page porfavor
      </h6>
    </StyledUnAuthorized>
  );
};

export default UnAuthorized;
