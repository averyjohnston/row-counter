import { IonButton, IonInput, IonItem, IonLabel, IonList } from '@ionic/react';
import { useEffect, useRef, useState } from 'react';
import { Form } from 'react-router-dom';

import type { CounterFormProps } from '../types';

import ColorPicker from './ColorPicker';

function CounterForm(props: CounterFormProps & {
  submitText?: string,
  counterID?: number
}) {
  const { name, color: defaultColor, resetValue, submitText, counterID } = props;
  const [color, setColor] = useState(defaultColor);

  const nameInputRef = useRef<HTMLIonInputElement>(null);
  const resetValueInputRef = useRef<HTMLIonInputElement>(null);

  /**
   * If we do this through the input's value prop, there's a bug where changing
   * the color through the popover causes the input to revert to its old value.
   * Almost positive this is an Ionic bug since ion-inputs in React have always
   * been weird about handling default values.
   */
  useEffect(() => {
    if (nameInputRef.current && resetValueInputRef.current) {
      nameInputRef.current.value = name;
      resetValueInputRef.current.value = resetValue;
    }
  }, [nameInputRef, resetValueInputRef, name, resetValue]);

  return (
    <Form method="post" className="counter-form">
      <IonList>
        <IonItem>
          <IonInput label="Name" labelPlacement="stacked" name="name" required ref={nameInputRef} />
        </IonItem>
        <IonItem>
          <IonLabel>Color</IonLabel>
          <ColorPicker color={color} setColor={setColor} />
          <input type="hidden" name="color" value={color} />
        </IonItem>
        <IonItem>
          <IonInput label="Reset Value" labelPlacement="stacked" type="number" name="resetValue" required ref={resetValueInputRef} />
        </IonItem>
        {counterID !== undefined && <input type="hidden" name="counterID" value={counterID} />}
        <IonButton type="submit" expand="block" className="ion-margin-top">{submitText || 'Submit'}</IonButton>
      </IonList>
    </Form>
  );
}

export default CounterForm;
