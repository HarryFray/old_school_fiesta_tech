import { useState, useEffect } from "react";
import { getDatabase, ref, child, get } from "firebase/database";

import { firebaseObjectToArray } from "../utils";

const useActiveEvent = () => {
  const [activeEvent, setActiveEvent] = useState("");

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

        const sales = firebaseObjectToArray(activeEvent?.sales);

        setActiveEvent({ ...activeEvent, sales });
        setTimeout(() => setLoadingEvent(false), 1000);
      } else {
        setActiveEvent([]);
        setTimeout(() => setLoadingEvent(false), 1000);
      }
    });
  }, [setLoadingEvent, setActiveEvent, dbRef]);

  return { activeEvent, loadingEvent, setLoadingEvent };
};

export default useActiveEvent;
