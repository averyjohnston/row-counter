import { IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import type { ActionFunction } from 'react-router-dom';
import { redirect, useParams } from 'react-router-dom';

import BackButton from '../components/BackButton';
import CounterForm from '../components/CounterForm';
import { db } from '../db';
import { createDefaultSubCounter, parseFormData } from '../utils';

// TODO: consider defaulting color to that of the parent counter

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();
  const { id: _, ...defaultSubCounterNoId } = createDefaultSubCounter();
  const { id } = params;
  const parentID = parseInt(id!);

  // don't specify the ID so Dexie can get it from auto-incrementing
  const subID = await db.subCounters.add({
    ...defaultSubCounterNoId,
    ...parseFormData(formData),
  });

  await db.counters.where({ id: parentID }).modify(parentCounter => {
    parentCounter.subCounters.push(subID);
  });

  return redirect(`/counters/${parentID}`);
};

export default function NewSubCounterPage() {
  const defaultSubCounter = createDefaultSubCounter();
  const { id: parentID } = useParams();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <BackButton to={`/counters/${parentID}`} />
          </IonButtons>
          <IonTitle>New Sub-Counter</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <CounterForm {...defaultSubCounter} submitText="Add Sub-Counter" />
      </IonContent>
    </IonPage>
  )
}
