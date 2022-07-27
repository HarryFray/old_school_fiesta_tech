import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { signOut } from 'firebase/auth';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import ConfirmationModal from '../components/modal/Confirmation';
import useWindowSize from '../hooks/useWindowSize';
import Logo from '../images/Logo.ico';

const SUPER_USER_NAV_ITEMS = [
  {
    path: 'lottery',
    label: 'Lottery',
  },
  {
    path: 'guests',
    label: 'Guests',
  },
  {
    path: 'registration',
    label: 'Registration',
  },
  {
    path: 'events',
    label: 'Event Management',
  },
  {
    path: 'dashboard',
    label: 'Dashboard',
  },
];

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

    .nav_items {
      display: flex;
      align-items: center;

      > * {
        margin-left: 12px;
      }
    }

    a {
      :hover {
        color: ${({ theme }) => theme.palette.primary.dark};
      }
    }

    .selected_nav_item {
      a {
        color: ${({ theme }) => theme.palette.primary.dark};
      }
    }

    h3:last-child {
      display: none;
    }

    button {
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
    signOut(auth).then(() => navigate('/'));
  };

  const { superUser, displayName } = currentUser;

  const currentPath = window?.location?.pathname;

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
            <h5>{`What up ${superUser ? 'Super User' : displayName}`}</h5>
          </div>
        ) : (
          <>
            <div className="logo_and_text">
              <img src={Logo} alt="Logo" width="40" height="40" />
              <h1>Old Sol Fiesta</h1>
            </div>
            <h4>{`What up ${superUser ? 'SuperUser' : displayName}`}</h4>
          </>
        )}
        <div className="navigation">
          <div className="nav_items">
            {superUser &&
              SUPER_USER_NAV_ITEMS.map(({ path, label }) => {
                return (
                  <React.Fragment key={path}>
                    <h3 className={cx({ selected_nav_item: currentPath?.includes(path) })}>
                      <Link to={`/${path}`}>{label}</Link>
                    </h3>
                    <h3>|</h3>
                  </React.Fragment>
                );
              })}
          </div>
          <Button onClick={() => setConfirmationModalOpen(true)} variant="outlined" size="small">
            Sign Out
          </Button>
        </div>
      </StyledTopBarNavigation>
    </>
  );
};

export default TopBarNavigation;
