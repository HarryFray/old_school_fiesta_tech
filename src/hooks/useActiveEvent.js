import { useState, useEffect } from "react";
import { getDatabase, ref, child, get, onValue } from "firebase/database";

import { firebaseObjectToArray } from "../utils";

const useActiveEvent = ({ currentUser }) => {
  let party = {};

  const db = getDatabase();
  const dbRef = ref(db, "/events");

  onValue(dbRef, (snapshot) => {
    const data = snapshot.val();

    console.log({ data });
    if (snapshot.exists()) {
      const eventsSnapshot = snapshot.val();
      const firebaseEvents = firebaseObjectToArray(eventsSnapshot);

      const activeEvent = firebaseEvents.filter((res) => res.activeEvent)[0];

      const allFirebaseEventSales = firebaseObjectToArray(activeEvent?.sales);

      const guests = firebaseObjectToArray(activeEvent?.guests);
      let sales = [];

      if (currentUser?.superUser) {
        sales = allFirebaseEventSales;
      } else {
        const eventSalesForCurrentUser = allFirebaseEventSales.filter(
          ({ artistName }) => artistName === currentUser?.displayName
        );

        sales = eventSalesForCurrentUser;
      }

      // setActiveEvent({ ...activeEvent, guests, sales });
      party = { ...activeEvent, guests, sales };
      // setTimeout(() => setLoadingEvent(false), 1000);
    } else {
      // setActiveEvent([]);
      party = {};

      // setTimeout(() => setLoadingEvent(false), 1000);
    }
  });
  console.log({ party });

  return {
    activeEvent: party,
    loadingEvent: false,
    setLoadingEvent: () => {},
    db,
  };
};

export default useActiveEvent;
