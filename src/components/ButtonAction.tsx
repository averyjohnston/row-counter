import { IonButton } from '@ionic/react';
import { type PropsWithChildren, useContext } from 'react';
import { useFetcher } from 'react-router-dom';
import type { SubmitTarget } from 'react-router-dom/dist/dom';

import { globalSettingsContext } from '../App';
import { clickVibrate } from '../utils';

/**
 * Renders a button that, when clicked, performs an imperative form
 * submit using the specified form data. Note that for now, the submits
 * are done in place (i.e. without navigation), though this functionality
 * could be added in the future if needed.
 *
 * A Form component is not used to avoid needing to render extra
 * unnecessary hidden inputs.
 *
 * If the ionButton prop is true, an IonButton component will be rendered.
 * Otherwise, a normal button element will be used instead.
 *
 * If the haptics prop is true, clicking the button will cause the device
 * to vibrate, if the global haptics setting is enabled. (Triggering haptics
 * before form submission is sometimes necessary to avoid a tiny but
 * noticeable delay.)
 *
 * The click event is used by default, but this can be customized with the
 * event prop. For example, a large clickable area may want pointerDown
 * instead so the event still triggers even if the user slightly moves their
 * finger while tapping on a phone.
 */
export default function ButtonAction(props: PropsWithChildren<{
  formData?: SubmitTarget,
  ionButton?: boolean,
  haptics?: boolean,
  className?: string,
  event?: 'onClick' | 'onPointerDown',
}>) {
  const { formData, ionButton, haptics, className, event, children } = props;
  const { globalSettings } = useContext(globalSettingsContext);
  const fetcher = useFetcher();
  const eventType = event || 'onClick';

  const submit = () => {
    if (haptics && globalSettings.haptics) clickVibrate();
    fetcher.submit(formData || null, { method: 'post' });
  };

  const handler = { [eventType]: submit };

  return ionButton ?
    <IonButton className={className} fill="clear" {...handler}>{children}</IonButton> :
    <button className={className} {...handler}>{children}</button>
  ;
}
