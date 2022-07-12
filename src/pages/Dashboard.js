import React, { useState, useEffect } from "react";
import styled from "styled-components";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { getDatabase, ref, remove } from "firebase/database";
import copy from "copy-to-clipboard";
import { useDispatch } from "react-redux";

import Layout from "../global/Layout";
import useWindowSize from "../hooks/useWindowSize";
import useActiveEvent from "../hooks/useActiveEvent";
import LoadingSpinner from "../components/LoadingSpinner";
import { openSnackBar } from "../redux/reducers";

import CreateOrEditSale from "../components/modal/CreateOrEditSale";
import ConfirmationModal from "../components/modal/Confirmation";

const filteredSalesBasedOnSearchText = (sales, searchText) => {
  let searchedSales = sales?.filter((sale) => {
    let nameIncludedInSearch = sale.name
      .toLowerCase()
      .includes(searchText.toLowerCase());

    let artistIncludedInSearch = sale.artistName
      .toLowerCase()
      .includes(searchText.toLowerCase());

    return nameIncludedInSearch || artistIncludedInSearch;
  });
  return searchedSales;
};

const StyledDashBoard = styled.div`
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

    .buttons {
      display: flex;
      align-items: end;

      button {
        margin-right: 12px;
      }

      button:last-child {
        margin-right: 0;
      }
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

        .large_col {
          width: 24%;
        }

        .small_col {
          width: 14%;
        }

        .xSmall_col {
          width: 4%;
        }

        .fixed_action_col {
          width: 120px;
        }
      }
    }

    tbody {
      // TODO NICK: REQUIRED FOR TABLE SCROLL (INCOMPLETE)
      // height: calc(100vh - 200px);
      // position: absolute;
      // overflow: scroll;

      tr {
        td {
          border-bottom: 0.5px solid
            ${({ theme }) => theme.palette.secondary.main};
          overflow-wrap: anywhere;
          padding: 0 0 0 20px;

          :first-child {
            padding: 0 0 0 20px;
          }

          :last-child {
            padding: 0;
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

        .mobile_stats {
          min-width: 110px;
        }
      }

      .filter_text_input {
        margin-bottom: 12px;
        width: 100%;
      }

      .buttons {
        width: 100%;
        justify-content: flex-end;
      }
    }

    .sale_cards {
      height: calc(${({ screenheight }) => screenheight}px - 240px);
      overflow: scroll;

      .sale_card {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        padding: 8px;
        border: 1px solid ${({ theme }) => theme.palette.primary.main};
        background: ${({ theme }) => theme.palette.secondary.light};
        border-radius: 4px;

        .action_buttons {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: end;
        }
      }
    }
  }
`;

const DashBoard = ({ auth, currentUser }) => {
  const { isSmall } = useWindowSize();

  const [selectedSale, setSelectedSale] = useState({});
  const [filterText, setFilterText] = useState("");

  const [createOrEditSaleOpen, setCreateOrEditSaleOpen] = useState(false);
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState(false);

  const db = getDatabase();

  const { activeEvent, loadingEvent, setLoadingEvent } = useActiveEvent();

  const allSales = activeEvent?.sales;

  // manage loading and scroll for cleaner mobile experience
  useEffect(() => {
    window.scrollTo(0, 0);

    if (createOrEditSaleOpen || deleteConfirmationModalOpen) return;

    setLoadingEvent(true);
    setTimeout(() => setLoadingEvent(false), 1000);
  }, [createOrEditSaleOpen, deleteConfirmationModalOpen, setLoadingEvent]);

  const handleDeleteSale = (saleUID) => {
    remove(ref(db, `events/${activeEvent?.eventName}/sales/${saleUID}`));
  };

  const filteredSales = filteredSalesBasedOnSearchText(allSales, filterText);

  const totalTicketsSold = filteredSales?.reduce(
    (acc, cur) => acc + Number(cur.ticketsBought),
    0
  );
  const totalSales = filteredSales?.reduce(
    (acc, cur) => acc + Number(cur.costOfSale),
    0
  );

  const dispatch = useDispatch();

  const getAllEmailsSoldToo = (allSales) => {
    dispatch(
      openSnackBar({ message: "Copied all emails of clients you sold to :)" })
    );

    const uniqueEmails = {};

    allSales.forEach(({ email }) => (uniqueEmails[email] = email));

    return Object.keys(uniqueEmails);
  };

  const getAllIntaHandlesSoldTo = (allSales) => {
    dispatch(
      openSnackBar({
        message: "Copied all Instagram handles of clients you sold to ;)",
      })
    );

    const uniqueIntaHandles = {};

    allSales.forEach(
      ({ instagramHandle }) =>
        (uniqueIntaHandles[instagramHandle] = instagramHandle)
    );

    return Object.keys(uniqueIntaHandles);
  };

  // DEALS WITH IOS NAVIGATION BOTTOM BAR
  const screenHeight = String(document.documentElement.clientHeight);

  return (
    <>
      <CreateOrEditSale
        createOrEditSaleOpen={createOrEditSaleOpen}
        setCreateOrEditSaleOpen={setCreateOrEditSaleOpen}
        setSelectedSale={setSelectedSale}
        selectedSale={selectedSale}
        currentUser={currentUser}
        activeEventName={activeEvent?.eventName}
      />
      <ConfirmationModal
        confirmationModalModalOpen={deleteConfirmationModalOpen}
        setConfirmationModalModalOpen={setDeleteConfirmationModalOpen}
        confirmationAction={() => handleDeleteSale(selectedSale?.saleUID)}
      />
      <Layout auth={auth} currentUser={currentUser}>
        <StyledDashBoard screenheight={screenHeight}>
          <div className="table_management_heading">
            {isSmall && (
              <div className="title_and_stats">
                <h1>{activeEvent?.eventName}</h1>
                <div className="mobile_stats">
                  <h5 className="small_col">{`Sales: $${totalSales}.00`}</h5>
                  <h5 className="small_col">{`Tickets: ${totalTicketsSold}`}</h5>
                </div>
              </div>
            )}
            <TextField
              label="Search Sales"
              className="filter_text_input"
              variant="outlined"
              size="small"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            {!isSmall && <h1>{activeEvent?.eventName}</h1>}
            {activeEvent?.eventName && (
              <div className="buttons">
                <Button
                  size="small"
                  onClick={() => copy(getAllIntaHandlesSoldTo(allSales))}
                  variant="outlined"
                >
                  COPY INSTAS
                </Button>
                <Button
                  size="small"
                  onClick={() => copy(getAllEmailsSoldToo(allSales))}
                  variant="outlined"
                >
                  COPY EMAILS
                </Button>
                <Button
                  size="small"
                  onClick={() => {
                    setCreateOrEditSaleOpen(true);
                    setSelectedSale({});
                  }}
                  variant="contained"
                  disabled={activeEvent?.lockedEvent}
                >
                  ADD SALE
                </Button>
              </div>
            )}
          </div>
          {!isSmall ? (
            <table>
              <thead>
                <tr>
                  <th className="xSmall_col">#</th>
                  {currentUser?.superUser && (
                    <th className="large_col">Artist's Name</th>
                  )}
                  <th className="small_col">Art Sold To</th>
                  <th className="large_col">Email</th>
                  <th className="small_col">Instagram</th>
                  <th className="small_col">{`Sales: $${totalSales}.00`}</th>
                  <th className="small_col">{`Tickets: ${totalTicketsSold}`}</th>
                  <th className="fixed_action_col">Action</th>
                </tr>
              </thead>
              {Boolean(filteredSales?.length && !loadingEvent) && (
                <tbody>
                  {filteredSales?.map((sale, id) => {
                    const {
                      name,
                      artistName,
                      email,
                      instagramHandle,
                      costOfSale,
                      ticketsBought,
                    } = sale;

                    return (
                      <React.Fragment key={id}>
                        <tr>
                          <td>{id + 1}</td>
                          {currentUser?.superUser && <td>{artistName}</td>}
                          <td>{name}</td>
                          <td>{email}</td>
                          <td>{instagramHandle}</td>
                          <td>{costOfSale ? `$${costOfSale}.00` : ""}</td>
                          <td>{ticketsBought}</td>
                          <td>
                            <div className="action_buttons">
                              <Button
                                size="small"
                                onClick={() => {
                                  setSelectedSale({ ...sale, id });
                                  setCreateOrEditSaleOpen(true);
                                }}
                              >
                                Edit
                              </Button>
                              <Button
                                size="small"
                                onClick={() => {
                                  setSelectedSale({ ...sale, id });
                                  setDeleteConfirmationModalOpen(true);
                                }}
                              >
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              )}
            </table>
          ) : (
            Boolean(filteredSales?.length && !loadingEvent) && (
              <div className="sale_cards">
                {filteredSales?.map((sale, id) => {
                  const {
                    name,
                    email,
                    instagramHandle,
                    costOfSale,
                    ticketsBought,
                  } = sale;

                  return (
                    <div key={id} className="sale_card">
                      <div>
                        <h5 className="caption">
                          <span className="bold">Name: </span>
                          {name}
                        </h5>
                        <h5 className="caption">
                          <span className="bold">Email: </span>
                          {email}
                        </h5>
                        <h5 className="caption">
                          <span className="bold">Insta: </span>
                          {instagramHandle}
                        </h5>
                        <h5 className="caption">
                          <span className="bold">Cost: </span>
                          {costOfSale ? "$" + costOfSale + ".00" : ""}
                        </h5>
                        <h5 className="caption">
                          <span className="bold">Tickets: </span>
                          {ticketsBought}
                        </h5>
                      </div>
                      <div className="action_buttons">
                        <h3 className="caption">{`# ${id + 1}`}</h3>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setSelectedSale({ ...sale, id });
                            setCreateOrEditSaleOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        {/* <Button
                          size="small"
                          onClick={() => {
                            setSelectedSale({ ...sale, id });
                            setDeleteConfirmationModalOpen(true);
                          }}
                        >
                          Delete
                        </Button> */}
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
          {Boolean(!filteredSales?.length && !loadingEvent) && (
            <div className="empty_search_text">
              <h2>No sales available</h2>
              <h6 className="subtitle-2">
                Either sell something or update your search
              </h6>
            </div>
          )}
        </StyledDashBoard>
      </Layout>
    </>
  );
};

export default DashBoard;
