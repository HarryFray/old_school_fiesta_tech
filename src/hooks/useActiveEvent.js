import { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

import { firebaseObjectToArray } from "../utils";

const useActiveEvent = ({ currentUser }) => {
  const [activeEvent, setActiveEvent] = useState({});
  const [loadingEvent, setLoadingEvent] = useState(false);

  useEffect(() => {
    const db = getDatabase();
    const dbRef = ref(db, "/events");

    onValue(dbRef, (snapshot) => {
      setLoadingEvent(true);

      if (snapshot.exists()) {
        const eventsSnapshot = snapshot.val();
        const firebaseEvents = firebaseObjectToArray(eventsSnapshot);

        const event = firebaseEvents.filter((res) => res.activeEvent)[0];

        const allFirebaseEventSales = firebaseObjectToArray(event?.sales);

        const guests = firebaseObjectToArray(event?.guests);
        let sales = [];

        if (currentUser?.superUser) {
          sales = allFirebaseEventSales;
        } else {
          const eventSalesForCurrentUser = allFirebaseEventSales.filter(
            ({ artistName }) => artistName === currentUser?.displayName
          );

          sales = eventSalesForCurrentUser;
        }

        setActiveEvent({ ...event, guests, sales });
        setTimeout(() => setLoadingEvent(false), 1000);
      } else {
        setActiveEvent({});

        setTimeout(() => setLoadingEvent(false), 1000);
      }
    });
  }, [currentUser]);

  return { activeEvent, loadingEvent, setLoadingEvent };
};

export default useActiveEvent;
