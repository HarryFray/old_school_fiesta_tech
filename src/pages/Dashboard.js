import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { getDatabase, ref, child, get, remove } from "firebase/database";
import copy from "copy-to-clipboard";

import Layout from "../global/Layout";
import { firebaseObjectToArray } from "../utils";
import useWindowSize from "../hooks/useWindowSize";

import CreateOrEditSale from "../components/modal/CreateOrEditSale";
import DeleteConfirmation from "../components/modal/DeleteConfirmation";

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

const getAllEmailsSoldToo = (allSales) => {
  const uniqueEmails = {};

  allSales.forEach(({ email }) => (uniqueEmails[email] = email));

  return Object.keys(uniqueEmails);
};

const StyledDashBoard = styled.div`
  height: 100%;
  width: 100%;

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

      button:first-child {
        margin-right: 12px;
      }
    }
  }

  table {
    width: 100%;
    table-layout: fixed;

    thead {
      background: ${({ theme }) => theme.colors.black12};

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

        .fixed_action_col {
          width: 120px;
        }
      }
    }

    tbody {
      tr {
        td {
          border-bottom: 0.5px solid ${({ theme }) => theme.colors.black34};
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
        justify-content: space-between;
      }
    }

    .sale_cards {
      height: calc(100vh - 240px);
      overflow: scroll;

      .sale_card {
        display: flex;
        justify-content: space-between;
        margin-bottom: 12px;
        padding: 8px;
        border: 1px solid ${({ theme }) => theme.colors.black60};
        border-radius: 4px;

        .action_buttons {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
      }
    }
  }
`;

const DashBoard = ({ auth, currentUser }) => {
  const { isSmall } = useWindowSize();

  const [activeEvent, setActiveEvent] = useState("");
  const [allSales, setAllSales] = useState([]);

  const [selectedSale, setSelectedSale] = useState({});
  const [filterText, setFilterText] = useState("");

  const [createOrEditSaleOpen, setCreateOrEditSaleOpen] = useState(false);
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState(false);

  const [loadingSales, setLoadingSales] = useState(true);

  const db = getDatabase();

  // GETTING ACTIVE EVENT NAME
  useEffect(() => {
    setLoadingSales(true);

    const dbRef = ref(db);
    get(child(dbRef, `events`)).then((snapshot) => {
      if (snapshot.exists()) {
        const eventsSnapshot = snapshot.val();
        const firebaseEvents = firebaseObjectToArray(eventsSnapshot);

        const activeEvent = firebaseEvents.filter((res) => res.activeEvent)[0];

        setActiveEvent(activeEvent);
        setTimeout(() => setLoadingSales(false), 1000);
      } else {
        setActiveEvent([]);
        setTimeout(() => setLoadingSales(false), 1000);
      }
    });
  }, [setLoadingSales, setActiveEvent, db]);

  // GETTING RELEVANT SALES FOR ACTIVE EVENT AND USER
  useEffect(() => {
    const dbRef = ref(db);

    get(child(dbRef, `events/${activeEvent?.eventName}/sales`)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          const eventsSnapshot = snapshot.val();
          const allFirebaseEventSales = firebaseObjectToArray(eventsSnapshot);

          if (currentUser?.superUser) {
            setAllSales(allFirebaseEventSales);
          } else {
            const eventSalesForCurrentUser = allFirebaseEventSales.filter(
              ({ artistName }) => artistName === currentUser?.email
            );

            setAllSales(eventSalesForCurrentUser);
          }
        } else {
          setAllSales([]);
        }
      }
    );
  });

  // manage view for cleaner mobile experience 
  useEffect(() => {
    window.scrollTo(0, 0);
    setLoadingSales(true);
    setTimeout(() => setLoadingSales(false), 1000);
  }, [createOrEditSaleOpen]);

  const handleDeleteEvent = (saleUID) => {
    remove(ref(db, `events/${activeEvent?.eventName}/sales/${saleUID}`));
  };

  const filteredSales = filteredSalesBasedOnSearchText(allSales, filterText);

  const totalTicketsSold = filteredSales.reduce(
    (acc, cur) => acc + Number(cur.ticketsBought),
    0
  );
  const totalSales = filteredSales.reduce(
    (acc, cur) => acc + Number(cur.costOfSale),
    0
  );

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
      <DeleteConfirmation
        deleteConfirmationModalOpen={deleteConfirmationModalOpen}
        setDeleteConfirmationModalOpen={setDeleteConfirmationModalOpen}
        handleDeletion={() => handleDeleteEvent(selectedSale?.saleUID)}
      />
      <Layout auth={auth} currentUser={currentUser}>
        <StyledDashBoard>
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
                  <th className="large_col">Artist's Name</th>
                  <th className="small_col">Art Sold To</th>
                  <th className="large_col">Email</th>
                  <th className="small_col">Instagram</th>
                  <th className="small_col">{`Sales: $${totalSales}.00`}</th>
                  <th className="small_col">{`Tickets: ${totalTicketsSold}`}</th>
                  <th className="fixed_action_col">Action</th>
                </tr>
              </thead>
              {Boolean(filteredSales?.length && !loadingSales) && (
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
                          <td>{artistName}</td>
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
            Boolean(filteredSales?.length && !loadingSales) && (
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
                        <Button
                          size="small"
                          onClick={() => {
                            setSelectedSale({ ...sale, id });
                            setDeleteConfirmationModalOpen(true);
                          }}
                        >
                          Delete
                        </Button>
                        <Button
                          size="small"
                          onClick={() => {
                            setSelectedSale({ ...sale, id });
                            setCreateOrEditSaleOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}
          {Boolean(loadingSales) && (
            <div className="loading_icon">
              <CircularProgress color="inherit" />
            </div>
          )}
          {Boolean(!filteredSales?.length && !loadingSales) && (
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
