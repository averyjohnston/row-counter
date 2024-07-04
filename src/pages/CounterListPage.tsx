import { Link } from 'react-router-dom';
import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { add, removeCircleOutline, addCircleOutline } from 'ionicons/icons';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { createCounterColorStyles, decrement, increment } from '../utils';

import './CounterListPage.scss';

function CounterListPage() {
  /**
   * We use Dexie's hook here instead of React Router's loader API so the rest of the
   * page (header, FAB) can still be displayed while the counters are loading. We
   * could instead make a separate index component showing just the other stuff and
   * have the list on a sibling route to that, but this seemed easier.
   *
   * Note that starting the app on other pages, like the counter page, will show a
   * totally white screen while loading. This is a less likely case, so covering it
   * felt unnecessary.
   */
  const counters = useLiveQuery(() => db.counters.toArray());

  const countersLoading = counters === undefined;
  const countersEmpty = counters !== undefined && counters.length === 0;

  return (
    <IonPage id="counter-list-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>All Counters</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {countersLoading && <p className="message">Loading...</p>}
        {countersEmpty && <p className="message">Click the <IonIcon icon={add} /> button to create a new counter!</p>}
        <div className="counters">
          {counters?.map((counter) => (
            <div key={counter.id} className="counter" style={createCounterColorStyles(counter)}>
              <button className="counter__button" onClick={() => decrement(counter.id)}>
                <IonIcon icon={removeCircleOutline} />
              </button>
              <Link className="counter__info" to={`counters/${counter.id}`}>
                <p>{counter.name}</p>
                <p>{counter.count}</p>
              </Link>
              <button className="counter__button" onClick={() => increment(counter.id)}>
                <IonIcon icon={addCircleOutline} />
              </button>
            </div>
          ))}
        </div>
        <IonFab slot="fixed" horizontal="end" vertical="bottom">
          <Link to="counters/new">
            <IonFabButton>
              <IonIcon icon={add}></IonIcon>
            </IonFabButton>
          </Link>
        </IonFab>
      </IonContent>
    </IonPage>
  );
}

export default CounterListPage;
