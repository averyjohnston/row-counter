import { IonList, IonItem, IonInput, IonButton, IonLabel } from "@ionic/react";
import { Form } from "react-router-dom";
import { CounterFormProps } from "../types";

function CounterForm(props: CounterFormProps) {
  const { name, color, resetValue } = props;

  return (
    <Form method="post">
      <IonList>
        <IonItem>
          <IonInput label="Name" labelPlacement="floating" name="name" value={name} required></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel>Color</IonLabel>
          <input slot="end" type="color" name="color" defaultValue={color} />
        </IonItem>
        <IonItem>
          <IonInput label="Reset Value" labelPlacement="floating" type="number" name="resetValue" value={resetValue} required></IonInput>
        </IonItem>
        <IonButton type="submit" expand="block" className="ion-margin-top">Submit</IonButton>
      </IonList>
    </Form>
  );
}

export default CounterForm;
