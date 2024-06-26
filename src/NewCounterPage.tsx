import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";

function NewCounterPage() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>New Counter</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        new counter page!
      </IonContent>
    </IonPage>
  )
}

export default NewCounterPage;
