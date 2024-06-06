import { useState } from 'react';
import type { Counter } from './types';

import './CounterListPage.scss';
import { Link } from 'react-router-dom';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

function CounterListPage() {
  const [counters, setCounters] = useState<Counter[]>([
    {
      id: 0,
      name: 'Example 1',
      count: 0
    },
    {
      id: 1,
      name: 'Example 2',
      count: 5
    }
  ]);

  const updateCount = (index: number, newCount: number) => {
    const newCounters = [...counters];
    newCounters[index].count = newCount;
    setCounters(newCounters);
  };

  return (
    <IonPage id="counter-list-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>All Counters</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {counters.map((counter, index) => (
          <div key={counter.id} className="counter">
            <Link className="counter__name" to={`counters/${counter.id}`}>{counter.name}</Link>
            <div className="counter__count" onClick={() => {
              updateCount(index, counter.count + 1);
            }}>{counter.count}</div>
          </div>
        ))}
      </IonContent>
    </IonPage>
  );
}

export default CounterListPage;
