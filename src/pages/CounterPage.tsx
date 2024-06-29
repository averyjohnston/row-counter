import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { create, trash } from 'ionicons/icons';
import { ActionFunction, Form, redirect, useLoaderData } from "react-router-dom";
import { db } from "../db";
import { Counter } from "../types";
import BackButton from "../components/BackButton";

export const action: ActionFunction = async ({ params, request }) => {
  const { id } = params;
  const idNum = parseInt(id!); // we already validated ID in loader, no need to do it again

  if (request.method === 'DELETE') {
    if (!confirm('Are you sure you want to delete this counter?')) {
      return false;
    }

    await db.counters.delete(idNum);
    return redirect('/');
  }
}

function CounterPage() {
  const counter = useLoaderData() as Counter;

  return (
    <IonPage id="counter-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <BackButton />
          </IonButtons>
          <IonTitle>{counter?.name}</IonTitle>
          <IonButtons slot="primary">
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
