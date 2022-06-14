import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const StyledNotFound = styled.div`
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

const NotFound = () => {
  return (
    <StyledNotFound>
      <h2>This page does not exist for you</h2>
      <h6 className="subtitle-2">
        Go back to the{" "}
        <Link to="/dashboard" className="link">
          dashboard
        </Link>{" "}
        page porfavor
      </h6>
    </StyledNotFound>
  );
};

export default NotFound;
