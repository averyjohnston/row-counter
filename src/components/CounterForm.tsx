import { IonButton, IonInput, IonItem, IonLabel, IonList, IonPopover } from '@ionic/react';
import { Form } from 'react-router-dom';
import type { CounterFormProps } from '../types';
import { useEffect, useRef, useState } from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';

import './CounterForm.scss';

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
  }, [nameInputRef, resetValueInputRef]);

  return (
    <Form method="post" className="counter-form">
      <IonList>
        <IonItem>
          <IonInput label="Name" labelPlacement="stacked" name="name" required ref={nameInputRef} />
        </IonItem>
        <IonItem>
          <IonLabel>Color</IonLabel>
          <IonButton id="color-picker-button" className="counter-form__color-button" size="small" style={{
            '--background': color,
          }} />
          <IonPopover trigger="color-picker-button" className="counter-form__color-popover" keepContentsMounted={true}>
            <HexColorPicker color={color} onChange={setColor} />
            <HexColorInput prefixed={true} color={color} onChange={setColor} className="counter-form__color-input" />
          </IonPopover>
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
