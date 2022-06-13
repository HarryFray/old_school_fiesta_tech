import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

const StyledNotFound = styled.div`
  display: flex;
  flex-direction: column;
  margin: 100px 0 0 0;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const NotFound = () => {
  return (
    <StyledNotFound>
      <h2>This page does not exist for you</h2>
      <h6 className="subtitle-2">
        Go back to your{" "}
        <Link to="/dashboard" className="link">
          dashboard
        </Link>{" "}
        page porfavor
      </h6>
    </StyledNotFound>
  );
};

export default NotFound;
