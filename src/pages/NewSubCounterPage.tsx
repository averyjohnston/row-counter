import { IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import type { ActionFunction } from 'react-router-dom';
import { redirect, useLoaderData } from 'react-router-dom';

import BackButton from '../components/BackButton';
import CounterForm from '../components/CounterForm';
import { db } from '../db';
import type { CounterLoaderResults } from '../types';
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
  // TODO: make separate loader that doesn't grab subs for better performance
  const { counter: parentCounter } = useLoaderData() as CounterLoaderResults;
  const defaultSubCounter = createDefaultSubCounter(parentCounter);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <BackButton to={`/counters/${parentCounter.id}`} />
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
