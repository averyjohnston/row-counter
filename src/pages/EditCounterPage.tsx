import { IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { ActionFunction, redirect, useLoaderData } from "react-router-dom";
import { db } from "../db";
import CounterForm from "../components/CounterForm";
import { Counter } from "../types";
import BackButton from "../components/BackButton";
import { parseFormData } from "../utils";

export const action: ActionFunction = async ({ params, request }) => {
  const { id } = params;
  const idNum = parseInt(id!); // we already validated ID in loader, no need to do it again

  const formData = await request.formData();
  await db.counters.update(idNum, parseFormData(formData));

  return redirect(`/counters/${idNum}`);
};

function EditCounterPage() {
  const counter = useLoaderData() as Counter;

  // TODO: reset value briefly flickers back to old value on submit

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <BackButton to={`/counters/${counter.id}`}></BackButton>
          </IonButtons>
          <IonTitle>Edit Counter: {counter.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <CounterForm {...counter} />
      </IonContent>
    </IonPage>
  )
}

export default EditCounterPage;
