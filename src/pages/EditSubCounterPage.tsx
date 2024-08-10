import { IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import type { ActionFunction, LoaderFunction } from 'react-router-dom';
import { redirect, useLoaderData, useNavigation, useParams } from 'react-router-dom';

import BackButton from '../components/BackButton';
import CounterForm from '../components/CounterForm';
import { db } from '../db';
import type { SubCounter } from '../types';
import { parseFormData } from '../utils';

export const loader: LoaderFunction = async ({ request }) => {
  const params = new URL(request.url).searchParams;
  const id = params.get('counterID')?.toString();
  const idNum = parseInt(id || '');
  if (isNaN(idNum)) {
    throw new Error(`Invalid sub-counter ID: ${id}`);
  }

  const subCounter = await db.subCounters.get(idNum);
  if (subCounter === undefined) {
    throw new Error(`No sub-counter matching ID: ${id}`);
  }

  return subCounter;
};

export const action: ActionFunction = async ({ params, request }) => {
  const { id: idFromParams } = params;
  const parentID = parseInt(idFromParams!); // we already validated ID in counterLoader, no need to do it again

  const formData = await request.formData();
  const idFromForm = formData.get('counterID')?.toString();
  const subID = parseInt(idFromForm!); // also already validated, but in this component's loader

  await db.subCounters.update(subID, parseFormData(formData));
  return redirect(`/counters/${parentID}`);
};

function EditSubCounterPage() {
  const subCounter = useLoaderData() as SubCounter;
  const navigation = useNavigation();
  const { id: parentID } = useParams();

  // optimistic UI -- if a counter update is being submitted, show the values entered by the user
  // ensures form doesn't flicker to old values on submit since the update isn't instantaneous
  const displayedCounter = navigation.formData ? parseFormData(navigation.formData) : subCounter;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <BackButton to={`/counters/${parentID}`} />
          </IonButtons>
          <IonTitle>Edit Sub-Counter: {subCounter.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <CounterForm {...displayedCounter} counterID={subCounter.id} submitText="Save Changes" />
      </IonContent>
    </IonPage>
  )
}

export default EditSubCounterPage;
