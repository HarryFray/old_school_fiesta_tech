import React, { useState, useEffect } from "react";
import styled from "styled-components";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { getDatabase, ref, child, get, remove } from "firebase/database";

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

          padding: 0 0 0 20px;

          :first-child {
            padding: 0 0 0 20px;
          }

          :last-child {
            display: flex;
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
  const [currentEventName, setCurrentEventName] = useState("");
  const [allSales, setAllSales] = useState([]);

  const [selectedSale, setSelectedSale] = useState({});
  const [filterText, setFilterText] = useState("");

  const [createOrEditSaleOpen, setCreateOrEditSaleOpen] = useState(false);
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState(false);

  const db = getDatabase();

  useEffect(() => {
    const dbRef = ref(db);

    get(child(dbRef, `events`)).then((snapshot) => {
      if (snapshot.exists()) {
        const eventsSnapshot = snapshot.val();
        const firebaseEvents = firebaseObjectToArray(eventsSnapshot);

        const currentEventName = firebaseEvents.filter(
          (res) => res.currentEvent
        )[0]?.eventName;

        setCurrentEventName(currentEventName);
      }
    });
  });

  useEffect(() => {
    const dbRef = ref(db);

    get(child(dbRef, `events/${currentEventName}/sales`)).then((snapshot) => {
      if (snapshot.exists()) {
        const eventsSnapshot = snapshot.val();
        const firebaseEventSales = firebaseObjectToArray(eventsSnapshot);

        setAllSales(firebaseEventSales);
      } else {
        setAllSales([]);
      }
    });
  });

  const handleDeleteEvent = (saleUID) => {
    remove(ref(db, `events/${currentEventName}/sales/${saleUID}`));
  };

  const filteredSales = filteredSalesBasedOnSearchText(allSales, filterText);

  const loadingSales = false;

  return (
    <>
      <CreateOrEditSale
        createOrEditSaleOpen={createOrEditSaleOpen}
        setCreateOrEditSaleOpen={setCreateOrEditSaleOpen}
        setSelectedSale={setSelectedSale}
        selectedSale={selectedSale}
        currentUser={currentUser}
        currentEventName={currentEventName}
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
            <h1>{currentEventName}</h1>
            <Button
              size="small"
              onClick={() => {
                setCreateOrEditSaleOpen(true);
                setSelectedSale({});
              }}
              variant="contained"
            >
              ADD SALE
            </Button>
          </div>
          <table>
            <thead>
              <tr>
                <th className="large_col">Artist's Name</th>
                <th className="large_col">Art Sold To</th>
                <th className="large_col">Email</th>
                <th className="large_col">Instagram</th>
                <th className="small_col">Tickets</th>
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
                    ticketsBought,
                  } = sale;

                  return (
                    <React.Fragment key={id}>
                      <tr>
                        <td>{artistName}</td>
                        <td>{name}</td>
                        <td>{email}</td>
                        <td>{instagramHandle}</td>
                        <td>{ticketsBought}</td>
                        <td>
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
