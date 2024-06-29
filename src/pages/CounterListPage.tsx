import { Link } from 'react-router-dom';
import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { add, removeCircleOutline, addCircleOutline } from 'ionicons/icons';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { getContrastColor } from '../utils';

import './CounterListPage.scss';

function CounterListPage() {
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
            <div key={counter.id} className="counter" style={{
                '--background': counter.color,
                '--color': getContrastColor(counter.color)
              }}>
              <button className="counter__button" onClick={() => {
                db.counters.update(counter, {
                  count: counter.count - 1
                });
              }}>
                <IonIcon icon={removeCircleOutline} />
              </button>
              <Link className="counter__info" to={`counters/${counter.id}`}>
                <p>{counter.name}</p>
                <p>{counter.count}</p>
              </Link>
              <button className="counter__button" onClick={() => {
                db.counters.update(counter, {
                  count: counter.count + 1
                });
              }}>
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
