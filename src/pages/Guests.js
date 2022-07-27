import React, { useState } from 'react';
import styled from 'styled-components';
import TextField from '@mui/material/TextField';

import Layout from '../global/Layout';
import useWindowSize from '../hooks/useWindowSize';
import useActiveEvent from '../hooks/useActiveEvent';
import LoadingSpinner from '../components/LoadingSpinner';

const filteredGuestsBasedOnSearchText = (guest, searchText) => {
  let searchedGuest = guest?.filter((guest) => {
    let nameIncludedInSearch = guest.fullName?.toLowerCase().includes(searchText.toLowerCase());

    return nameIncludedInSearch;
  });
  return searchedGuest;
};

const StyledGuests = styled.div`
  height: 100%;
  width: 100%;

  h1 {
    color: ${({ theme }) => theme.palette.primary.main};
  }

  .table_management_heading {
    height: 40px;
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: end;

    .filter_text_input {
      width: 180px;
    }
  }

  table {
    width: 100%;
    table-layout: fixed;

    thead {
      background: ${({ theme }) => theme.palette.secondary.light};

      tr {
        th {
          padding: 14px 0 14px 20px;
          font-weight: normal;
          text-align: start;

          :first-child {
            border-radius: 4px;
            padding: 0 0 0 20px;
            border-radius: 4px 0 0 4px;
          }
        }

        .xSmall_col {
          width: 4%;
        }

        .large_col {
          width: 24%;
        }
      }
    }

    tbody {
      tr {
        td {
          border-bottom: 0.5px solid ${({ theme }) => theme.palette.secondary.main};
          overflow-wrap: anywhere;
          padding: 4px 0 4px 20px;

          :first-child {
            padding: 0 0 0 20px;
          }
        }
      }
    }
  }

  .loading_icon,
  .empty_search_text {
    display: flex;
    flex-direction: column;
    margin: 48px 0 0 0;
    width: 100%;
    align-items: center;
    justify-content: center;

    h6 {
      margin: 8px 0 0 0;
      text-align: center;
    }
  }

  @media (max-width: ${({ theme }) => theme.breakPoints.medium}) {
    margin: 0 20px 0 0;

    table {
      table-layout: unset;

      thead {
        tr {
          th {
            padding: 14px 0 14px 8px;
          }
        }
      }

      tbody {
        tr {
          td {
            padding: 10px 0 10px 8px;
          }
        }
      }
    }
  }

  @media (max-width: ${({ theme }) => theme.breakPoints.small}) {
    .table_management_heading {
      flex-direction: column;
      height: unset;

      .title_and_stats {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 12px;

        h1 {
          width: 100%;
          margin-right: 12px;
        }
      }

      .filter_text_input {
        margin-bottom: 12px;
        width: 100%;
      }
    }

    .guest_cards {
      height: calc(${({ screenheight }) => screenheight}px - 240px);
      overflow: scroll;

      .guest_card {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        padding: 8px;
        border: 1px solid ${({ theme }) => theme.palette.primary.main};
        background: ${({ theme }) => theme.palette.secondary.light};
        border-radius: 4px;
      }
    }
  }
`;

const Guests = ({ auth, currentUser }) => {
  const [filterText, setFilterText] = useState('');

  const { activeEvent, loadingEvent } = useActiveEvent();

  const { isSmall } = useWindowSize();

  const filteredGuests = filteredGuestsBasedOnSearchText(activeEvent?.guests, filterText);

  // DEALS WITH IOS NAVIGATION BOTTOM BAR
  const screenHeight = String(document.documentElement.clientHeight);

  return (
    <Layout auth={auth} currentUser={currentUser}>
      <StyledGuests screenheight={screenHeight}>
        <div className="table_management_heading">
          {isSmall && (
            <div className="title_and_stats">
              <h1>{activeEvent?.eventName}</h1>
            </div>
          )}
          <TextField
            label="Search guest"
            className="filter_text_input"
            variant="outlined"
            size="small"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          {!isSmall && <h1>{activeEvent?.eventName}</h1>}
        </div>
        {!isSmall ? (
          <table>
            <thead>
              <tr>
                <th className="xSmall_col">#</th>
                <th className="large_col">Guest Name</th>
                <th className="large_col">Email</th>
                <th className="large_col">Instagram</th>
              </tr>
            </thead>
            {Boolean(filteredGuests?.length && !loadingEvent) && (
              <tbody>
                {filteredGuests?.map((guest, id) => {
                  const { fullName, email, instagramHandle } = guest;

                  return (
                    <React.Fragment key={id}>
                      <tr>
                        <td>{id + 1}</td>
                        <td>{fullName}</td>
                        <td>{email}</td>
                        <td>{instagramHandle}</td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            )}
          </table>
        ) : (
          Boolean(filteredGuests?.length && !loadingEvent) && (
            <div className="guest_cards">
              {filteredGuests?.map((guest, id) => {
                const { fullName, email, instagramHandle } = guest;

                return (
                  <div key={id} className="guest_card">
                    <div>
                      <h5 className="caption">
                        <span className="bold">Name: </span>
                        {fullName}
                      </h5>
                      <h5 className="caption">
                        <span className="bold">Email: </span>
                        {email}
                      </h5>
                      <h5 className="caption">
                        <span className="bold">Insta: </span>
                        {instagramHandle}
                      </h5>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
        {Boolean(loadingEvent) && (
          <div className="loading_icon">
            <LoadingSpinner />
          </div>
        )}
        {Boolean(!filteredGuests?.length && !loadingEvent) && (
          <div className="empty_search_text">
            <h2>No guest available</h2>
            <h6 className="subtitle-2">Guests must register through the registration page</h6>
          </div>
        )}
      </StyledGuests>
    </Layout>
  );
};

export default Guests;
