import { IonItem } from "@ionic/react";
import { PropsWithChildren, useRef } from "react";
import { Form, FormMethod } from "react-router-dom";

import "./ContextMenuItem.scss";

/**
 * IonItem button={true} type="submit" doesn't work because the button is rendered
 * in the shadow DOM, so submit events don't make it to the Form. Render a hidden
 * button in the light DOM and pass clicks to it instead.
 *
 * Note that the button should NOT be inside the IonItem to avoid nested interactives.
 */
export default function ContextMenuItem(props: PropsWithChildren<{ method?: FormMethod, action?: string }>) {
  const { method, action } = props;
  const hiddenButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <Form method={method} action={action} className="context-menu-item">
      <IonItem lines="none" button={true} onClick={() => hiddenButtonRef.current?.click()}>
        {props.children}
      </IonItem>
      <button type="submit" className="hidden-button" ref={hiddenButtonRef} />
    </Form>
  );
}
