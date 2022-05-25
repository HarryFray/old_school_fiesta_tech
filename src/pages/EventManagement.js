import React, { useState } from "react";
import styled from "styled-components";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import Layout from "../global/Layout";

import CreateOrEditEvent from "../components/modal/CreateOrEditEvent";
import DeleteConfirmation from "../components/modal/DeleteConfirmation";

const filteredEventsBasedOnSearchText = (events, searchText) => {
  let searchedEvents = events?.filter((event) => {
    let nameIncludedInSearch = event.eventName
      .toLowerCase()
      .includes(searchText.toLowerCase());

    return nameIncludedInSearch;
  });
  return searchedEvents;
};

const DEFAULT_EVENTS_DUMMY_DATA = [
  {
    eventName: "Summer Solstice",
    dateOccuring: "06/20/2022",
    artists: [{ name: "Court long name", email: "court_long@court.com" }],
  },
  {
    eventName: "Winter Solstice",
    dateOccuring: "08/05/2022",
    artists: [{ name: "Cor s name", email: "court@court.com" }],
  },
];

const StyledEventManagement = styled.div`
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
          width: 50%;
        }

        .small_col {
          width: 20%;
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

const EventManagement = ({ auth, currentUser }) => {
  const [allEvents, setAllEvents] = useState(DEFAULT_EVENTS_DUMMY_DATA);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [filterText, setFilterText] = useState("");

  const [createOrEditEventOpen, setCreateOrEditEventOpen] = useState(false);
  const [deleteConfirmationModalOpen, setDeleteConfirmationModalOpen] =
    useState(false);

  const handleCreateEvent = (newEvent) => {
    setAllEvents([...allEvents, newEvent]);
  };

  const handleUpdateEvent = (id, updatedEvent) => {
    const beforeUpdatedEvents = allEvents.slice(0, id);
    const afterUpdatedEvents = allEvents.slice(id + 1);

    setAllEvents([...beforeUpdatedEvents, updatedEvent, ...afterUpdatedEvents]);
  };

  const handleDeleteEvent = (id) => {
    const beforeDeletedEvent = allEvents.slice(0, id);
    const afterDeletedEvent = allEvents.slice(id + 1);

    setAllEvents([...beforeDeletedEvent, ...afterDeletedEvent]);
  };

  const filteredEvents = filteredEventsBasedOnSearchText(allEvents, filterText);

  const loadingEvents = false;

  return (
    <>
      <CreateOrEditEvent
        createOrEditEventOpen={createOrEditEventOpen}
        setCreateOrEditEventOpen={setCreateOrEditEventOpen}
        setSelectedEvent={setSelectedEvent}
        selectedEvent={selectedEvent}
        handleUpdateEvent={handleUpdateEvent}
        handleCreateEvent={handleCreateEvent}
        currentUser={currentUser}
      />

      <DeleteConfirmation
        deleteConfirmationModalOpen={deleteConfirmationModalOpen}
        setDeleteConfirmationModalOpen={setDeleteConfirmationModalOpen}
        handleDeletion={() => handleDeleteEvent(selectedEvent?.id)}
      />
      <Layout auth={auth} currentUser={currentUser}>
        <StyledEventManagement>
          <div className="table_management_heading">
            <TextField
              label="Search"
              className="filter_text_input"
              variant="outlined"
              size="small"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            <h1>Event Management</h1>
            <Button
              size="small"
              onClick={() => {
                setCreateOrEditEventOpen(true);
                setSelectedEvent({});
              }}
              variant="contained"
            >
              Create Event
            </Button>
          </div>
          <table>
            <thead>
              <tr>
                <th className="small_col">Event Name</th>
                <th className="small_col">Date Occuring</th>
                <th className="large_col">Artists</th>
                <th className="fixed_action_col">Action</th>
              </tr>
            </thead>
            {Boolean(filteredEvents?.length && !loadingEvents) && (
              <tbody>
                {filteredEvents?.map((event, id) => {
                  const { eventName, dateOccuring, artists } = event;

                  return (
                    <React.Fragment key={id}>
                      <tr>
                        <td>{eventName}</td>
                        <td>{dateOccuring}</td>
                        <td>
                          {artists?.map((artist, id) => {
                            return <h4 key={id}>{artist?.name}</h4>;
                          })}
                        </td>
                        <td>
                          <Button
                            size="small"
                            onClick={() => {
                              setSelectedEvent({ ...event, id });
                              setCreateOrEditEventOpen(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            onClick={() => {
                              setSelectedEvent({ ...event, id });
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
          {Boolean(loadingEvents) && (
            <div className="loading_icon">
              <CircularProgress color="inherit" />
            </div>
          )}
          {Boolean(!filteredEvents?.length && !loadingEvents) && (
            <div className="empty_search_text">
              <h2>No events available</h2>
              <h6 className="subtitle-2">Either create a new event or STFU</h6>
            </div>
          )}
        </StyledEventManagement>
      </Layout>
    </>
  );
};

export default EventManagement;
