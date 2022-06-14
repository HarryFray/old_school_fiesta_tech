import React from "react";
import styled from "styled-components";

import TopBarNavigation from "../components/TopBarNavigation";

const StyledLayout = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${({ theme }) => theme.palette.primary.light};

  .page_content {
    padding: 24px;
  }

  @media (max-width: ${({ theme }) => theme.breakPoints.small}) {
    .page_content {
      padding: 12px;
    }
  }
`;

const Layout = ({ children, auth, currentUser }) => {
  return (
    <StyledLayout>
      <TopBarNavigation auth={auth} currentUser={currentUser} />
      <div className="page_content">{children}</div>
    </StyledLayout>
  );
};

export default Layout;
