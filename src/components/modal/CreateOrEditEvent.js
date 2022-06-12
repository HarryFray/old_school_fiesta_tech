import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useForm, Controller } from "react-hook-form";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { isEmpty } from "lodash";
import { getDatabase, ref, set } from "firebase/database";
import Switch from "@mui/material/Switch";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

import Typography from "../../global/Typography";

const createUsersAndLogOut = (artists, auth, navigate) => {
  const DEFAULT_USER_PASSWORD = "5678OldSolFiesta!";
  const DEFAULT_SUPER_USER_EMAIL = "catjameswork@gmail.com";

  Promise.all(
    artists.map(async (artist) => {
      await createUserWithEmailAndPassword(
        auth,
        artist?.email,
        DEFAULT_USER_PASSWORD
      )
        .then(async (userCredential) => {
          const user = userCredential.user;
          console.log("New user created: ", user);

          await updateProfile(user, {
            displayName: artist?.name,
          })
            .then(() => {
              console.log("Updated username to: ", artist?.name);
            })
            .catch(() => console.log("Error updating user name"));
        })
        .catch((error) => {
          console.log("Error on signUp", error);
        });
    })
  ).then(() =>
    signInWithEmailAndPassword(
      auth,
      DEFAULT_SUPER_USER_EMAIL,
      DEFAULT_USER_PASSWORD
    ).then(() => navigate("/events"))
  );
};

const mergeArtistEmailsAndNames = (data) => {
  const artists = [];

  for (const [key, value] of Object.entries(data)) {
    const artistIndex = Number(key.slice(-1));

    if (!isNaN(artistIndex) && key.includes("artist") && value.length) {
      if (key.includes("name")) {
        artists[artistIndex] = { ...artists[artistIndex], name: value };
      } else if (key.includes("email")) {
        artists[artistIndex] = { ...artists[artistIndex], email: value };
      }
    }
  }

  return artists;
};

const convertArtistsArrayToObject = (data) => {
  if (!data) return;

  const artists = {};

  data.forEach((artist, i) => {
    artists[`artist_name_${i}`] = artist.name;
    artists[`artist_email_${i}`] = artist.email;
  });

  return artists;
};

const StyledCreateOrEditEvent = styled(Modal)`
  .MuiBox-root {
    border-radius: 4px;
    position: absolute;
    left: 50%;
    top: 50%;
    padding: 24px;
    transform: translate(-50%, -50%);
    background-color: ${({ theme }) => theme.colors.white};

    .content_section {
      display: flex;
      flex-direction: column;

      .text_input {
        margin-top: 24px;
        min-width: 260px;
      }

      .current_event_switch {
        margin-top: 24px;
        display: flex;
        align-items: center;
      }
    }

    .artists_section {
      margin-top: 24px;
      border: 1px solid ${({ theme }) => theme.colors.black34};
      padding: 12px;
      border-radius: 4px;

      .artists_inputs {
        .artist_inputs {
          div:first-child {
            margin-right: 12px;
          }
          .text_input {
            margin-top: 12px;
          }
        }
      }

      .manage_artists_buttons {
        display: flex;
        justify-content: space-between;

        .add_artist_button {
          margin-top: 24px;
        }
      }
    }

    .buttons {
      display: flex;
      justify-content: space-between;
      margin-top: 24px;

      button:first-child {
        margin-right: 24px;
      }
    }
  }
`;

const CreateOrEditEvent = ({
  createOrEditEventOpen,
  setCreateOrEditEventOpen,
  setSelectedEvent,
  selectedEvent,
  auth,
  allEvents,
}) => {
  const [artistEditFields, setArtistEditFields] = useState([{}]);

  const { register, handleSubmit, reset, getValues, control } = useForm();

  const navigate = useNavigate();

  const isNewEvent = isEmpty(selectedEvent);
  const db = getDatabase();

  useEffect(() => {
    if (isNewEvent) {
      reset({
        eventName: "",
        dateOccuring: "",
        activeEvent: false,
        lockedEvent: false,
      });
    } else {
      if (selectedEvent?.artists) setArtistEditFields(selectedEvent?.artists);

      reset({
        ...selectedEvent,
        ...convertArtistsArrayToObject(selectedEvent?.artists),
      });
    }
  }, [isNewEvent, reset, selectedEvent]);

  const updateOrCreateEvent = (data) => {
    const artistArray = mergeArtistEmailsAndNames(data);

    const {
      activeEvent,
      lockedEvent,
      dateOccuring,
      eventName,
      sales = false,
    } = data;

    const relevantEventData = {
      artists: artistArray,
      activeEvent,
      lockedEvent,
      dateOccuring,
      eventName,
      sales,
    };

    const nameOfEventExists = Boolean(
      allEvents?.find(
        (event) => event?.eventName?.toLowerCase() === eventName?.toLowerCase()
      )
    );

    if (!eventName) {
      alert("CREATING AN EVENT WITHOUT A NAME WILL DESTROY THE DB");
      return;
    }

    if (isNewEvent && nameOfEventExists) {
      alert("THIS EVENT EXISTS ALREADY CHOOSE A DIFFERENT NAME");
      return;
    }

    set(ref(db, `events/${data?.eventName}`), relevantEventData).then(() => {
      setSelectedEvent({});
      setArtistEditFields([{}]);
      setCreateOrEditEventOpen(false);
      createUsersAndLogOut(artistArray, auth, navigate);
    });
  };

  return (
    <StyledCreateOrEditEvent open={createOrEditEventOpen}>
      <Box>
        <Typography>
          <form onSubmit={handleSubmit(updateOrCreateEvent)}>
            <h3>{isNewEvent ? "Create New Event" : "Edit Existing Event"}</h3>
            <div className="content_section">
              <TextField
                {...register("eventName", { required: true })}
                label="Event Name (once created this can not be changed)"
                className="text_input"
                variant="outlined"
                size="small"
                disabled={!isNewEvent}
              />
              <TextField
                {...register("dateOccuring")}
                label="Date Of Event"
                className="text_input"
                variant="outlined"
                size="small"
              />
              <div className="current_event_switch">
                <Controller
                  name="activeEvent"
                  control={control}
                  render={({ field }) => (
                    <Switch checked={field?.value} {...field} />
                  )}
                />
                <h4>
                  {getValues("activeEvent")
                    ? "This is the current event"
                    : "Make this the current event"}
                </h4>
              </div>
              <div className="current_event_switch">
                <Controller
                  name="lockedEvent"
                  control={control}
                  render={({ field }) => (
                    <Switch checked={field?.value} {...field} />
                  )}
                />
                <h4>
                  {getValues("lockedEvent")
                    ? "This event is locked"
                    : "Lock this event"}
                </h4>
              </div>
              <div className="artists_section">
                <h4>Artists:</h4>
                <div className="artists_inputs">
                  {artistEditFields?.map((_, i) => {
                    return (
                      <div className="artist_inputs" key={i}>
                        <TextField
                          {...register(`artist_name_${i}`)}
                          label="Name"
                          className="text_input"
                          variant="outlined"
                          size="small"
                        />
                        <TextField
                          {...register(`artist_email_${i}`)}
                          label="Email"
                          className="text_input"
                          variant="outlined"
                          size="small"
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="manage_artists_buttons">
                  <Button
                    className="add_artist_button"
                    onClick={() =>
                      setArtistEditFields(artistEditFields.slice(1))
                    }
                    variant="outlined"
                  >
                    Delete Artist
                  </Button>
                  <Button
                    className="add_artist_button"
                    onClick={() =>
                      setArtistEditFields([...artistEditFields, {}])
                    }
                    variant="outlined"
                  >
                    Add Artist
                  </Button>
                </div>
              </div>
            </div>
            <div className="buttons">
              <Button
                onClick={() => {
                  setCreateOrEditEventOpen(false);
                  setSelectedEvent({});
                }}
                variant="outlined"
              >
                Never Mind
              </Button>
              <Button variant="contained" type="submit" size="small">
                {isNewEvent ? "Create Event" : "Update Event"}
              </Button>
            </div>
          </form>
        </Typography>
      </Box>
    </StyledCreateOrEditEvent>
  );
};

export default CreateOrEditEvent;
