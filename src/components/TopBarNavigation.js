import React from "react";
import Button from "@mui/material/Button";
import { signOut } from "firebase/auth";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const StyledTopBarNavigation = styled.div`
  background: ${({ theme }) => theme.colors.black12};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 24px;

  .navigation {
    display: flex;
    align-items: center;

    > * {
      margin-left: 12px;
    }
  }
`;

const TopBarNavigation = ({ auth }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate("/auth");
    });
  };

  return (
    <StyledTopBarNavigation>
      <h1>Old_Sol_Fiesta</h1>
      <div className="navigation">
        <h3>
          <Link to="/events">Event Management</Link>
        </h3>
        <h3>
          <Link to="/dashboard">Dashboard</Link>
        </h3>
        <Button onClick={handleSignOut} variant="outlined">
          Sign Out
        </Button>
      </div>
    </StyledTopBarNavigation>
  );
};

export default TopBarNavigation;
