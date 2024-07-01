import { IonList, IonItem, IonInput, IonButton, IonLabel } from "@ionic/react";
import { Form } from "react-router-dom";
import { CounterFormProps } from "../types";

function CounterForm(props: Partial<CounterFormProps>) {
  const { name, color, resetValue } = props;

  // TODO: make a util that creates a default counter, so new counter page can just pass that
  // that way you can put default values there, and all values will be defined

  return (
    <Form method="post">
      <IonList>
        <IonItem>
          <IonInput label="Name" labelPlacement="floating" name="name" value={name} required></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel>Color</IonLabel>
          <input slot="end" type="color" name="color" defaultValue={color || '#f5f5f5'} />
        </IonItem>
        <IonItem>
          <IonInput label="Reset Value" labelPlacement="floating" type="number" name="resetValue" value={resetValue || 0} required></IonInput>
        </IonItem>
        <IonButton type="submit" expand="block" className="ion-margin-top">Submit</IonButton>
      </IonList>
    </Form>
  );
}

export default CounterForm;
