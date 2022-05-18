import React from "react";
import styled from "styled-components";

import TopBarNavigation from "../components/TopBarNavigation";

const StyledLayout = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${({ theme }) => theme.colors.white};

  .page_content {
    padding: 24px;
  }
`;

const Layout = ({ children, auth }) => {
  return (
    <StyledLayout>
      <TopBarNavigation auth={auth} />
      <div className="page_content">{children}</div>
    </StyledLayout>
  );
};

export default Layout;
