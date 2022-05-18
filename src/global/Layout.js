import React from "react";
import styled from "styled-components";

import TopBarNavigation from "../components/TopBarNavigation";

const StyledLayout = styled.div`
  width: 100vw;
  height: 100vh;

  background: violet;
`;

const Layout = ({ children, auth }) => {
  return (
    <StyledLayout>
      <TopBarNavigation auth={auth} />
      {children}
    </StyledLayout>
  );
};

export default Layout;
