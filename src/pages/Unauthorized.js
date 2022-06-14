import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const StyledUnAuthorized = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  align-items: center;
  background: ${({ theme }) => theme.palette.primary.light};

  h2 {
    margin-top: 100px;
  }

  h2,
  h6 {
    text-align: center;
  }
`;

const UnAuthorized = () => {
  return (
    <StyledUnAuthorized>
      <h2>My person! You need to log in</h2>
      <h6 className="subtitle-2">
        Go back to the{" "}
        <Link to="/" className="link">
          log in
        </Link>{" "}
        page porfavor
      </h6>
    </StyledUnAuthorized>
  );
};

export default UnAuthorized;
