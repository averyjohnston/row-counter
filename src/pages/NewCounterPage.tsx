import { IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import type { ActionFunction } from 'react-router-dom';
import { redirect } from 'react-router-dom';

import BackButton from '../components/BackButton';
import CounterForm from '../components/CounterForm';
import { db } from '../db';
import { createDefaultCounter, parseFormData } from '../utils';

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { id: _, ...defaultCounterNoId } = createDefaultCounter();

  // don't specify the ID so Dexie can get it from auto-incrementing
  await db.counters.add({
    ...defaultCounterNoId,
    ...parseFormData(formData),
  });

  return redirect('/');
};

function NewCounterPage() {
  const defaultCounter = createDefaultCounter();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <BackButton />
          </IonButtons>
          <IonTitle>New Counter</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <CounterForm {...defaultCounter} submitText="Create New Counter" />
      </IonContent>
    </IonPage>
  )
}

export default NewCounterPage;
