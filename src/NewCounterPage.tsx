import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonList, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { ActionFunction, Form, redirect } from "react-router-dom";
import { db } from "./db";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const { name } = Object.fromEntries(formData);
  await db.counters.add({ name: name.toString(), count: 0 });
  return redirect('/');
};

function NewCounterPage() {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>New Counter</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <Form method="post">
          <IonList>
            <IonItem>
              <IonInput label="Name" labelPlacement="floating" name="name" required></IonInput>
            </IonItem>
            <IonButton type="submit" expand="block" className="ion-margin-top">Submit</IonButton>
          </IonList>
        </Form>
      </IonContent>
    </IonPage>
  )
}

export default NewCounterPage;
