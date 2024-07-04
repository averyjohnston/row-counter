import { IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { ActionFunction, redirect } from "react-router-dom";
import { db } from "../db";
import CounterForm from "../components/CounterForm";
import BackButton from "../components/BackButton";
import { createDefaultCounter } from "../utils";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { name, color, resetValue } = Object.fromEntries(formData);

  // TODO: make a util that takes formData and converts it to a properly typed Counter (can also use in edit page)
  await db.counters.add({
    name: name.toString(),
    color: color.toString(),
    resetValue: parseInt(resetValue.toString()),
    count: 0
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
        <CounterForm {...defaultCounter} />
      </IonContent>
    </IonPage>
  )
}

export default NewCounterPage;
