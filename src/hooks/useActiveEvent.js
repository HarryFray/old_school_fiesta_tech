import { useState, useEffect } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

import { firebaseObjectToArray } from '../utils';

const getAllTicketsSoldFromSales = (allSales) => {
  const allTicketsSold = [];

  allSales?.forEach((sale) => {
    for (let ticket = 0; ticket < Number(sale?.ticketsBought); ticket++) {
      allTicketsSold.push(sale);
    }
  });

  return allTicketsSold;
};

const useActiveEvent = () => {
  const [allEvents, setAllEvents] = useState([]);
  const [activeEvent, setActiveEvent] = useState({});

  const [loadingEvent, setLoadingEvent] = useState(false);

  useEffect(() => {
    const db = getDatabase();
    const dbRef = ref(db, '/events');

    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const eventsSnapshot = snapshot.val();
        const firebaseEvents = firebaseObjectToArray(eventsSnapshot);

        const event = firebaseEvents?.filter((res) => res.activeEvent)[0];
        const sales = firebaseObjectToArray(event?.sales);

        setActiveEvent({
          ...event,
          guests: firebaseObjectToArray(event?.guests),
          sales,
          tickets: getAllTicketsSoldFromSales(sales),
        });
        setAllEvents(firebaseEvents);
      } else {
        setActiveEvent({});
      }
    });
  }, []);

  return { activeEvent, allEvents, loadingEvent, setLoadingEvent };
};

export default useActiveEvent;
