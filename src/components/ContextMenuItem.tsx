import { IonItem } from '@ionic/react';
import type { PropsWithChildren } from 'react';
import { useRef } from 'react';
import type { FormMethod } from 'react-router-dom';
import { Form, Link } from 'react-router-dom';

import './ContextMenuItem.scss';

// TODO: split into different components for form and link

/**
 * IonItem button={true} type="submit" doesn't work because the button is rendered
 * in the shadow DOM, so submit events don't make it to the Form. Render a hidden
 * button in the light DOM and pass clicks to it instead.
 *
 * Note that the button should NOT be inside the IonItem to avoid nested interactives.
 *
 * If `to` is defined, a Link is rendered instead, without the hidden button.
 */
export default function ContextMenuItem(props: PropsWithChildren<{ method?: FormMethod, action?: string, to?: string }>) {
  const { method, action, children, to } = props;
  const hiddenButtonRef = useRef<HTMLButtonElement>(null);

  if (to === undefined) {
    return (
      <Form method={method} action={action} className="context-menu-item">
        <IonItem lines="none" button={true} onClick={() => hiddenButtonRef.current?.click()}>
          {children}
        </IonItem>
        <button type="submit" className="hidden-button" ref={hiddenButtonRef} />
      </Form>
    );
  } else {
    return (
      <Link to={to} className="context-menu-item">
        <IonItem lines="none" button={true}>
          {children}
        </IonItem>
      </Link>
    )
  }
}
