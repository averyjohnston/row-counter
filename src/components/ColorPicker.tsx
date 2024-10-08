import { IonButton, IonPopover } from '@ionic/react';
import type { Dispatch, MouseEventHandler, SetStateAction } from 'react';
import { useRef, useState } from 'react';
import { HexColorInput, HexColorPicker } from 'react-colorful';

import { createContrastColorStyles } from '../utils';

import './ColorPicker.scss';

const DEFAULT_COLORS = [
  '#e71c1c', // red
  '#ebe716', // yellow
  '#65de1b', // light green
  '#229d09', // green
  '#0a8a8a', // teal
  '#12d2d2', // light blue
  '#1a16e4', // blue
  '#6131d3', // purple
  '#dd4de4', // pink
  '#8a4003', // brown
  '#000', // black
  '#fff', // white
];

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
      <IonButton onClick={openPopover} className="color-picker__main-button" size="small" style={{
        '--background': color,
      }} />
      <IonPopover ref={popover} isOpen={isOpen} onDidDismiss={() => setIsOpen(false)} className="color-picker__popover" keepContentsMounted={true}>
        <div className="color-picker__default-buttons">
          {DEFAULT_COLORS.map((defaultColor, i) => (
            <IonButton key={i} onClick={() => setColor(defaultColor)} className="color-picker__default-button" size="small" style={{
              '--background': defaultColor,
            }} />
          ))}
        </div>
        <HexColorPicker color={color} onChange={setColor} />
        <HexColorInput style={createContrastColorStyles(color)} prefixed={true} color={color} onChange={setColor} className="color-picker__input" />
      </IonPopover>
    </>
  );
}
