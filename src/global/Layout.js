import React from "react";

import styled from "styled-components";

const StyledLayout = styled.div`
  width: 100vw;
  height: 100vh;

  background: violet;

  .top_bar_navigation {
    height: 80px;

    background: white;
  }
`;

const Layout = ({ children }) => {
  return (
    <StyledLayout>
      <div className="top_bar_navigation" />
      {children}
    </StyledLayout>
  );
};

export default Layout;
