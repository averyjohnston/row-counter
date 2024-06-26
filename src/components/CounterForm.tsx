import { IonList, IonItem, IonInput, IonButton } from "@ionic/react";
import { Form } from "react-router-dom";

function CounterForm() {
  return (
    <Form method="post">
      <IonList>
        <IonItem>
          <IonInput label="Name" labelPlacement="floating" name="name" required></IonInput>
        </IonItem>
        <IonButton type="submit" expand="block" className="ion-margin-top">Submit</IonButton>
      </IonList>
    </Form>
  );
}

export default CounterForm;
