import React, { useState } from "react";
import Button from "@mui/material/Button";
import { signOut } from "firebase/auth";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import ConfirmationModal from "../components/modal/Confirmation";
import useWindowSize from "../hooks/useWindowSize";
import Logo from "../images/Logo.ico";

const StyledTopBarNavigation = styled.div`
  background: ${({ theme }) => theme.palette.secondary.light};
  border-bottom: 1px solid ${({ theme }) => theme.palette.primary.main};

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 24px;

  .logo_and_text {
    display: flex;
    align-items: center;

    img {
      margin-right: 4px;
    }

    h1 {
      color: ${({ theme }) => theme.palette.primary.dark};
    }
  }

  h5 {
    color: black;
  }

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
      color: ${({ theme }) => theme.palette.primary.dark};

      h5 {
        margin-top: 8px;
      }
    }
  }
`;

const TopBarNavigation = ({ auth, currentUser }) => {
  const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const navigate = useNavigate();

  const { isSmall } = useWindowSize();

  const handleSignOut = () => {
    signOut(auth).then(() => {
      navigate("/");
    });
  };

  return (
    <>
      <ConfirmationModal
        confirmationModalModalOpen={confirmationModalOpen}
        setConfirmationModalModalOpen={setConfirmationModalOpen}
        confirmationAction={handleSignOut}
        title="Are you sure you want to log out?"
        text="Please don't leave me :("
      />
      <StyledTopBarNavigation>
        {isSmall ? (
          <div className="mobile_heading">
            <div className="logo_and_text">
              <img src={Logo} alt="Logo" width="32" height="32" />
              <h2>Old Sol Fiesta</h2>
            </div>
            <h5>
              {`What up ${
                currentUser?.superUser ? "Super User" : currentUser?.displayName
              }`}
            </h5>
          </div>
        ) : (
          <>
            <div className="logo_and_text">
              <img src={Logo} alt="Logo" width="40" height="40" />
              <h1>Old Sol Fiesta</h1>
            </div>
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
              <h3>
                <Link to="/registration">registration</Link>
              </h3>
            </>
          )}
          <Button
            onClick={() => setConfirmationModalOpen(true)}
            variant="outlined"
            size="small"
          >
            Sign Out
          </Button>
        </div>
      </StyledTopBarNavigation>
    </>
  );
};

export default TopBarNavigation;
