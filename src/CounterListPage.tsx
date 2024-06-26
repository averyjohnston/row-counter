import { Link } from 'react-router-dom';
import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { add } from 'ionicons/icons';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from './db';

import './CounterListPage.scss';

function CounterListPage() {
  const counters = useLiveQuery(() => db.counters.toArray());

  return (
    <IonPage id="counter-list-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>All Counters</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {counters?.map((counter) => (
          <div key={counter.id} className="counter">
            <Link className="counter__name" to={`counters/${counter.id}`}>{counter.name}</Link>
            <div className="counter__count" onClick={() => {
              db.counters.update(counter, {
                count: counter.count + 1
              });
            }}>{counter.count}</div>
          </div>
        ))}
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
