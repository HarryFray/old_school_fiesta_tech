import { useState, useEffect } from "react";
import { getDatabase, ref, child, get } from "firebase/database";

import { firebaseObjectToArray } from "../utils";

const useActiveEvent = ({ currentUser }) => {
  const [activeEvent, setActiveEvent] = useState("");
  const [allSales, setAllSales] = useState([]);

  const [loadingEvent, setLoadingEvent] = useState(true);

  const db = getDatabase();
  const dbRef = ref(db);

  useEffect(() => {
    setLoadingEvent(true);

    get(child(dbRef, `events`)).then((snapshot) => {
      if (snapshot.exists()) {
        const eventsSnapshot = snapshot.val();
        const firebaseEvents = firebaseObjectToArray(eventsSnapshot);

        const activeEvent = firebaseEvents.filter((res) => res.activeEvent)[0];

        const guests = firebaseObjectToArray(activeEvent?.guests);

        setActiveEvent({ ...activeEvent, guests });
        setTimeout(() => setLoadingEvent(false), 1000);
      } else {
        setActiveEvent([]);
        setTimeout(() => setLoadingEvent(false), 1000);
      }
    });
  }, [setLoadingEvent, setActiveEvent, dbRef]);

  // GETTING RELEVANT SALES FOR ACTIVE EVENT AND USER
  useEffect(() => {
    get(child(dbRef, `events/${activeEvent?.eventName}/sales`)).then(
      (snapshot) => {
        if (snapshot.exists()) {
          const eventsSnapshot = snapshot.val();
          const allFirebaseEventSales = firebaseObjectToArray(eventsSnapshot);

          if (currentUser?.superUser) {
            setAllSales(allFirebaseEventSales);
          } else {
            const eventSalesForCurrentUser = allFirebaseEventSales.filter(
              ({ artistName }) => artistName === currentUser?.displayName
            );

            setAllSales(eventSalesForCurrentUser);
          }
        } else {
          setAllSales([]);
        }
      }
    );
  });

  return {
    activeEvent: { ...activeEvent, sales: allSales },
    loadingEvent,
    setLoadingEvent,
    db,
  };
};

export default useActiveEvent;
