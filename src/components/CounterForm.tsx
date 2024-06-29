import { IonList, IonItem, IonInput, IonButton, IonLabel } from "@ionic/react";
import { Form } from "react-router-dom";

function CounterForm(props: {
  name?: string,
  color?: string
}) {
  const { name, color } = props;

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
        <IonButton type="submit" expand="block" className="ion-margin-top">Submit</IonButton>
      </IonList>
    </Form>
  );
}

export default CounterForm;
