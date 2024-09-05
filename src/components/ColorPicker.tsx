import { IonButton, IonPopover } from '@ionic/react';
import type { Dispatch, MouseEventHandler, SetStateAction } from 'react';
import { useRef, useState } from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';

import './ColorPicker.scss';

// TODO: add buttons for common colors (roy g biv stuff plus brown, black, and white)

export default function ColorPicker(props: {
  color: string,
  setColor: Dispatch<SetStateAction<string>>
}) {
  const { color, setColor } = props;
  const [isOpen, setIsOpen] = useState(false);
  const popover = useRef<HTMLIonPopoverElement>(null);

  const openPopover: MouseEventHandler = (e) => {
    if (!popover.current) return;
    popover.current.event = e;
    setIsOpen(true);
  };

  /**
   * The popover uses isOpen instead of trigger to avoid needing an ID on the button,
   * so the component can be used multiple times on a page without collisions.
   */
  return (
    <>
      <IonButton onClick={openPopover} className="color-picker__button" size="small" style={{
        '--background': color,
      }} />
      <IonPopover ref={popover} isOpen={isOpen} onDidDismiss={() => setIsOpen(false)} className="color-picker__popover" keepContentsMounted={true}>
        <HexColorPicker color={color} onChange={setColor} />
        <HexColorInput prefixed={true} color={color} onChange={setColor} className="color-picker__input" />
      </IonPopover>
    </>
  );
}
