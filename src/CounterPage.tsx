import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useLiveQuery } from "dexie-react-hooks";
import { Form, useParams } from "react-router-dom";
import { db } from "./db";

function CounterPage() {
  const { id } = useParams();
  const counter = useLiveQuery(() => db.counters.get(parseInt(id!)));
  // TODO: handle unknown counter and non-numeric param

  return (
    <IonPage id="counter-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>{counter?.name}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        counter!
      </IonContent>
    </IonPage>
  )
}

export default CounterPage;
