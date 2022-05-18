import React from "react";
import Button from "@mui/material/Button";
import { signOut } from "firebase/auth";
import styled from "styled-components";

const StyledTopBarNavigation = styled.div`
  background: pink;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 8px;
`;

const TopBarNavigation = ({ auth }) => {
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        console.log("User signed out: ", auth);
      })
      .catch((error) => {
        console.log("Error signing out: ", error);
      });
  };

  return (
    <StyledTopBarNavigation>
      <Button onClick={handleSignOut} variant="outlined">
        Sign Out
      </Button>
    </StyledTopBarNavigation>
  );
};

export default TopBarNavigation;
