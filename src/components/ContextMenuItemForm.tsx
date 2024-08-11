import { IonItem } from '@ionic/react';
import type { PropsWithChildren } from 'react';
import type { FormMethod } from 'react-router-dom';
import { useSubmit } from 'react-router-dom';
import type { SubmitTarget } from 'react-router-dom/dist/dom';

/**
 * Renders an IonItem meant to be used in a context menu or other interactive
 * list UI. When clicked, it performs an imperative form submit using the
 * specified parameters.
 *
 * A Form component is not used for two reasons:
 * 1. More flexibility regarding data to send along with the submission.
 * 2. IonItem renders a shadow DOM, so clicks to it would not make it out
 *    to the surrounding Form. The workaround would be to render a hidden
 *    button and pass clicks to that instead, but that was deemed unwieldy.
 */
export default function ContextMenuItemForm(props: PropsWithChildren<{ method?: FormMethod, action?: string, formData?: SubmitTarget }>) {
  const { method, action, formData, children } = props;
  const submit = useSubmit();

  return (
    <IonItem lines="none" button={true} onClick={() => {
      submit(formData || null, { method, action });
    }}>{children}</IonItem>
  );
}
