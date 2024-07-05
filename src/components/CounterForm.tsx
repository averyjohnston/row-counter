import { IonList, IonItem, IonInput, IonButton, IonLabel, IonPopover } from "@ionic/react";
import { Form } from "react-router-dom";
import { CounterFormProps } from "../types";
import { useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";

import './CounterForm.scss';

// TODO: add field for max (should reset to resetValue once counter exceeds max)
// TODO: new color picker can take octal codes; adjust other stuff like getContrastColor to allow for those

function CounterForm(props: CounterFormProps) {
  const { name, color: defaultColor, resetValue } = props;
  const [color, setColor] = useState(defaultColor);

  return (
    <Form method="post" className="counter-form">
      <IonList>
        <IonItem>
          <IonInput label="Name" labelPlacement="floating" name="name" value={name} required></IonInput>
        </IonItem>
        <IonItem>
          <IonLabel>Color</IonLabel>
          <IonButton id="color-picker-button" className="color-button" size="small" style={{
            '--background': color
          }}></IonButton>
          <IonPopover trigger="color-picker-button" className="counter-form__color-popover">
            <HexColorPicker color={color} onChange={setColor} />
            <HexColorInput prefixed={true} color={color} onChange={setColor} />
          </IonPopover>
          <input type="hidden" name="color" value={color} />
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
