import React from "react";
import styled from "styled-components";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useSelector, useDispatch } from "react-redux";

import TopBarNavigation from "../components/TopBarNavigation";
import { closeSnackBar } from "../redux/reducers";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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
  const dispatch = useDispatch();

  const { open, message, status } = useSelector((state) => state.snackBar);

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => dispatch(closeSnackBar())}
      >
        <Alert severity={status} sx={{ width: "100%" }}>
          {message}
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
