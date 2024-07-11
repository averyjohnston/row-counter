import { Link, LoaderFunction, useLoaderData } from 'react-router-dom';
import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { add, settingsOutline } from 'ionicons/icons';
import { db } from '../db';
import MiniCounter from '../components/MiniCounter';
import { Counter } from '../types';

import './CounterListPage.scss';

export const loader: LoaderFunction = async () => {
  const counters = await db.counters.toArray();
  return counters;
};

function CounterListPage() {
  const counters = useLoaderData() as Counter[];
  const countersEmpty = counters.length === 0;
  // TODO: loading message (maybe render at app level instead?)

  return (
    <IonPage id="counter-list-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>All Counters</IonTitle>
          <IonButtons slot="primary">
            <Link to="/settings">
              <IonButton>
                <IonIcon slot="icon-only" icon={settingsOutline} />
              </IonButton>
            </Link>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {countersEmpty && <p className="message">Click the <IonIcon icon={add} /> button to create a new counter!</p>}
        <div className="counters">
          {counters?.map((counter) => <MiniCounter key={counter.id} counter={counter} />)}
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
