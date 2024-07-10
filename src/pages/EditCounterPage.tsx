import { IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { ActionFunction, redirect, useLoaderData, useNavigation } from "react-router-dom";
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
  const navigation = useNavigation();

  // optimistic UI -- if a counter update is being submitted, show the values entered by the user
  // ensures form doesn't flicker to old values on submit since the update isn't instantaneous
  const displayedCounter = navigation.formData ? parseFormData(navigation.formData) : counter;

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
        <CounterForm {...displayedCounter} submitText="Save Changes" />
      </IonContent>
    </IonPage>
  )
}

export default EditCounterPage;
