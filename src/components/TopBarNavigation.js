import React from "react";
import Button from "@mui/material/Button";
import { signOut } from "firebase/auth";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import useWindowSize from "../hooks/useWindowSize";

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

  @media (max-width: ${({ theme }) => theme.breakPoints.xSmall}) {
    padding: 12px;

    .mobile_heading {
    }
  }
`;

const TopBarNavigation = ({ auth, currentUser }) => {
  const navigate = useNavigate();

  const { isSmall } = useWindowSize();

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate("/auth");
    });
  };

  return (
    <StyledTopBarNavigation>
      {isSmall ? (
        <div className="mobile_heading">
          <h2>Old Sol Fiesta</h2>
          <h5>
            {`What up ${
              currentUser?.superUser ? "Super User" : currentUser?.displayName
            }`}
          </h5>
        </div>
      ) : (
        <>
          <h1>Old Sol Fiesta</h1>
          <h4>
            {`What up ${
              currentUser?.superUser ? "SuperUser" : currentUser?.displayName
            }`}
          </h4>
        </>
      )}
      <div className="navigation">
        {currentUser?.superUser && (
          <>
            <h3>
              <Link to="/lottery">Lottery</Link>
            </h3>
            <h3>
              <Link to="/events">Event Management</Link>
            </h3>
            <h3>
              <Link to="/dashboard">Dashboard</Link>
            </h3>
          </>
        )}
        <Button onClick={handleSignOut} variant="outlined" size="small">
          Sign Out
        </Button>
      </div>
    </StyledTopBarNavigation>
  );
};

export default TopBarNavigation;
