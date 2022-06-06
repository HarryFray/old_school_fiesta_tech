import React, { useState, useEffect } from "react";
import styled from "styled-components";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { getDatabase, ref, child, get, remove } from "firebase/database";

import Layout from "../global/Layout";
import { firebaseObjectToArray } from "../utils";

import DeleteConfirmation from "../components/modal/DeleteConfirmation";

const StyledLottery = styled.div`
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

const Lottery = ({ auth, currentUser }) => {
  const [activeEventName, setActiveEventName] = useState("");
  const [allSales, setAllSales] = useState([]);

  const [selectedSale, setSelectedSale] = useState({});
  const [filterText, setFilterText] = useState("");

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

        const activeEventName = firebaseEvents.filter(
          (res) => res.activeEvent
        )[0]?.eventName;

        setActiveEventName(activeEventName);
      }
    });
  });

  // GETTING RELEVANT SALES FOR ACTIVE EVENT AND USER
  useEffect(() => {
    const dbRef = ref(db);

    get(child(dbRef, `events/${activeEventName}/sales`)).then((snapshot) => {
      if (snapshot.exists()) {
        const eventsSnapshot = snapshot.val();
        const allFirebaseEventSales = firebaseObjectToArray(eventsSnapshot);

        setAllSales(allFirebaseEventSales);
      } else {
        setAllSales([]);
      }
    });
  });

  const handleDeleteEvent = (saleUID) => {
    remove(ref(db, `events/${activeEventName}/sales/${saleUID}`));
  };

  return (
    <>
      <DeleteConfirmation
        deleteConfirmationModalOpen={deleteConfirmationModalOpen}
        setDeleteConfirmationModalOpen={setDeleteConfirmationModalOpen}
        handleDeletion={() => handleDeleteEvent(selectedSale?.saleUID)}
      />
      <Layout auth={auth} currentUser={currentUser}>
        <StyledLottery>
          <div className="table_management_heading">
            <h1>{activeEventName}</h1>
            {activeEventName && (
              <div className="buttons">
                <Button
                  size="small"
                  onClick={() => alert("winner selected")}
                  variant="contained"
                >
                  Randomly Select Winner!
                </Button>
              </div>
            )}
          </div>
          <table>
            <thead>
              <tr>
                <th className="large_col">Winner Order</th>
                <th className="small_col">Name</th>
                <th className="large_col">Email</th>
                <th className="small_col">Instagram</th>
                <th className="small_col">Artist Bought From</th>
              </tr>
            </thead>
            {Boolean([]?.length) && (
              <tbody>
                {[]?.map((sale, id) => {
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
          {Boolean(![]?.length) && (
            <div className="empty_search_text">
              <h2>{`No winners selected yet for "${activeEventName}"`}</h2>
              <h6 className="subtitle-2">{`Please lock "${activeEventName}" and select winners once event is complete (winners can not be selected untill event is locked)`}</h6>
            </div>
          )}
        </StyledLottery>
      </Layout>
    </>
  );
};

export default Lottery;
