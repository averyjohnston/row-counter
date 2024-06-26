import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { create, trash } from 'ionicons/icons';
import { useLiveQuery } from "dexie-react-hooks";
import { ActionFunction, Form, redirect, useParams } from "react-router-dom";
import { db } from "./db";

export const action: ActionFunction = async ({ params, request }) => {
  const { id } = params;
  const idNum = parseInt(id || '');
  if (isNaN(idNum)) {
    return false; // TODO: better error behavior
  }

  if (request.method === 'DELETE') {
    if (!confirm('Are you sure you want to delete this counter?')) {
      return true;
    }

    await db.counters.delete(idNum);
    return redirect('/');
  }
}

function CounterPage() {
  const { id } = useParams();
  const counter = useLiveQuery(() => db.counters.get(parseInt(id!)));
  // TODO: handle unknown counter and non-numeric param (redirect to 404 page?)

  return (
    <IonPage id="counter-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>{counter?.name}</IonTitle>
          <IonButtons slot="secondary">
            <Form action="edit">
              <IonButton type="submit">
                <IonIcon slot="icon-only" icon={create}></IonIcon>
              </IonButton>
            </Form>
            <Form method="delete">
              <IonButton type="submit">
                <IonIcon slot="icon-only" icon={trash}></IonIcon>
              </IonButton>
            </Form>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        counter!
      </IonContent>
    </IonPage>
  )
}

export default CounterPage;
