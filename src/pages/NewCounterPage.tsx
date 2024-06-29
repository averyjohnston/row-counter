import { IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { ActionFunction, redirect } from "react-router-dom";
import { db } from "../db";
import CounterForm from "../components/CounterForm";
import BackButton from "../components/BackButton";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { name, color } = Object.fromEntries(formData);

  await db.counters.add({
    name: name.toString(),
    color: color.toString(),
    count: 0
  });

  return redirect('/');
};

function NewCounterPage() {
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
        <CounterForm />
      </IonContent>
    </IonPage>
  )
}

export default NewCounterPage;
