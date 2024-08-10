import { IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { add, settingsOutline } from 'ionicons/icons';
import type { ActionFunction, LoaderFunction} from 'react-router-dom';
import { Link, useLoaderData } from 'react-router-dom';

import MiniCounter from '../components/MiniCounter';
import { db } from '../db';
import type { Counter } from '../types';
import { decrement, increment } from '../utils';

import './CounterListPage.scss';

export const loader: LoaderFunction = async () => {
  const counters = await db.counters.toArray();
  return counters;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get('intent');
  const counterID = formData.get('counterID');
  if (counterID === null) throw new Error('Missing counter ID');
  const idNum = parseInt(counterID.toString());
  const isSub = formData.get('isSubCounter') === 'true';

  switch (intent) {
    case 'increment': return await increment(idNum, isSub);
    case 'decrement': return await decrement(idNum, isSub);
  }

  throw new Error(`Unknown form intent: ${intent?.toString()}`);
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
              <IonIcon icon={add} />
            </IonFabButton>
          </Link>
        </IonFab>
      </IonContent>
    </IonPage>
  );
}

export default CounterListPage;
