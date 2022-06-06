import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import { getDatabase, ref, child, get } from "firebase/database";
import { random } from "lodash";

import Layout from "../global/Layout";
import { firebaseObjectToArray } from "../utils";

const getAllTicketsSoldFromSales = (allSales) => {
  const allTicketsSold = [];

  allSales.forEach((sale) => {
    for (let ticket = 0; ticket < Number(sale?.ticketsBought); ticket++) {
      allTicketsSold.push(sale);
    }
  });

  return allTicketsSold;
};

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
          width: 60px;
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
  const [activeEvent, setActiveEvent] = useState("");

  const [allTicketsSold, setAllTicketsSold] = useState([]);
  const [winners, setWinners] = useState([]);

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

  // GETTING ALL SALES FOR EVENT AND CONVERTING TO TOTAL TICEKTS SOLD
  useEffect(() => {
    const dbRef = ref(db);

    get(child(dbRef, `events/${activeEvent?.eventName}/sales`)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          const eventsSnapshot = snapshot.val();
          const allFirebaseEventSales = firebaseObjectToArray(eventsSnapshot);

          const allTicketsSold = getAllTicketsSoldFromSales(
            allFirebaseEventSales
          );

          setAllTicketsSold(allTicketsSold);
        } else {
          setAllTicketsSold([]);
        }
      }
    );
  });

  const handleSelectWinner = () => {
    const randomWinnerInt = random(0, allTicketsSold?.length);
    const newWinner = allTicketsSold[randomWinnerInt];

    setWinners([...winners, newWinner]);
  };

  const handleDeleteWinner = (winnerID) => {
    const winnersBeforeDelted = winners.slice(0, winnerID);
    const winnersAfterDelted = winners.slice(winnerID + 1);

    setWinners([...winnersBeforeDelted, ...winnersAfterDelted]);
  };

  return (
    <Layout auth={auth} currentUser={currentUser}>
      <StyledLottery>
        <div className="table_management_heading">
          <h1>Lottery</h1>
          <h1>{activeEvent?.eventName}</h1>
          {activeEvent?.eventName && (
            <div className="buttons">
              <Button
                size="small"
                onClick={handleSelectWinner}
                variant="contained"
                disabled={!activeEvent?.lockedEvent}
              >
                Randomly Select Winner!
              </Button>
            </div>
          )}
        </div>
        <table>
          <thead>
            <tr>
              <th className="fixed_action_col">Order</th>
              <th className="small_col">Name</th>
              <th className="large_col">Email</th>
              <th className="small_col">Instagram</th>
              <th className="large_col">Artist Bought From</th>
              <th className="fixed_action_col">Action</th>
            </tr>
          </thead>
          {Boolean(winners?.length) && (
            <tbody>
              {winners?.map((sale, id) => {
                const { name, email, instagramHandle, artistName } = sale;

                return (
                  <React.Fragment key={id}>
                    <tr>
                      <td>{id}</td>
                      <td>{name}</td>
                      <td>{email}</td>
                      <td>{instagramHandle}</td>
                      <td>{artistName}</td>
                      <td>
                        <div className="action_buttons">
                          <Button
                            size="small"
                            onClick={() => handleDeleteWinner(id)}
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
        {Boolean(!winners?.length) && (
          <div className="empty_search_text">
            <h2>{`No winners selected yet for "${activeEvent?.eventName}"`}</h2>
            <h6 className="subtitle-2">{`Please lock "${activeEvent?.eventName}" and select winners once event is complete (winners can not be selected untill event is locked)`}</h6>
          </div>
        )}
      </StyledLottery>
    </Layout>
  );
};

export default Lottery;
