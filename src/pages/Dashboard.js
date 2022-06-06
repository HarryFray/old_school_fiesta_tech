import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { getDatabase, ref, child, get, remove } from "firebase/database";
import copy from "copy-to-clipboard";

import Layout from "../global/Layout";
import { firebaseObjectToArray } from "../utils";

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
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;

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

  @media (max-width: ${({ theme }) => theme.breakPoints.small}) {
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
`;

const DashBoard = ({ auth, currentUser }) => {
  const [activeEvent, setActiveEvent] = useState("");
  const [allSales, setAllSales] = useState([]);

  const [selectedSale, setSelectedSale] = useState({});
  const [filterText, setFilterText] = useState("");

  const [createOrEditSaleOpen, setCreateOrEditSaleOpen] = useState(false);
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState(false);

  const db = getDatabase();

  // GETTING ACTIVE EVENT NAME
  useEffect(() => {
    const dbRef = ref(db);

    get(child(dbRef, `events`)).then((snapshot) => {
      if (snapshot.exists()) {
        const eventsSnapshot = snapshot.val();
        const firebaseEvents = firebaseObjectToArray(eventsSnapshot);

        const activeEvent = firebaseEvents.filter((res) => res.activeEvent)[0];

        setActiveEvent(activeEvent);
      }
    });
  });

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

  const loadingSales = false;

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
            <TextField
              label="Search Sales"
              className="filter_text_input"
              variant="outlined"
              size="small"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            <h1>{activeEvent?.eventName}</h1>
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
