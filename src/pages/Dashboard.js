import React from "react";
import styled from "styled-components";

import Layout from "../global/Layout";

const StyledDashBoard = styled.div`
  background: orange;
  height: 100%;
  width: 100%;
`;

const DashBoard = ({ auth }) => {
  return (
    <Layout auth={auth}>
      <StyledDashBoard>
        <h1>Dashboard</h1>
      </StyledDashBoard>
    </Layout>
  );
};

export default DashBoard;
