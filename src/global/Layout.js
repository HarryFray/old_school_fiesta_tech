import React, { useState } from "react";
import styled from "styled-components";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import TopBarNavigation from "../components/TopBarNavigation";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const DEFAULT_SNACKBAR = {
  open: false,
  message: "",
  status: "success",
};

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
  const [snackBarConfig, setSnackBarConfig] = useState(DEFAULT_SNACKBAR);

  return (
    <>
      <Snackbar
        open={snackBarConfig?.open}
        autoHideDuration={3000}
        onClose={() => setSnackBarConfig("")}
      >
        <Alert severity={snackBarConfig?.status} sx={{ width: "100%" }}>
          {snackBarConfig?.message}
        </Alert>
      </Snackbar>
      <StyledLayout>
        <TopBarNavigation auth={auth} currentUser={currentUser} />
        <div className="page_content">{children}</div>
      </StyledLayout>
    </>
  );
};

export default Layout;
