import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonList, IonPage, IonPopover, IonTitle, IonToolbar } from "@ionic/react";
import { ellipsisVertical, removeCircleOutline, refreshCircleOutline } from 'ionicons/icons';
import { ActionFunction, redirect, useFetcher, useLoaderData } from "react-router-dom";
import { db } from "../db";
import { Counter } from "../types";
import BackButton from "../components/BackButton";
import { createCounterColorStyles, decrement, increment, reset } from "../utils";
import ContextMenuItem from "../components/ContextMenuItem";

import "./CounterPage.scss";

// TODO: sub-counters w/ just names and colors (make counter display from list page into reusable component?)
// TODO (nice to have): Ravelry integration, including generic login, to link with specific project
// TODO: haptics?

export const action: ActionFunction = async ({ params, request }) => {
  const { id } = params;
  const idNum = parseInt(id!); // we already validated ID in loader, no need to do it again

  if (request.method === 'DELETE') {
    if (!confirm('Are you sure you want to delete this counter?')) {
      document.querySelector<HTMLIonPopoverElement>('ion-popover')?.dismiss();
      return false;
    }

    await db.counters.delete(idNum);
    return redirect('/');
  } else if (request.method === 'POST') {
    const formData = await request.formData();
    const intent = formData.get('intent');

    switch (intent) {
      case 'increment': return await increment(idNum);
      case 'decrement': return await decrement(idNum);
      case 'reset': {
        if (!confirm('Are you sure you want to reset this counter to its reset value?')) {
          return false;
        }

        return await reset(idNum);
      }
    }

    throw new Error(`Unknown form intent: ${intent}`);
  }

  throw new Error(`Unknown request type: ${request.method}`);
}

function CounterPage() {
  const counter = useLoaderData() as Counter;
  const fetcher = useFetcher();

  return (
    <IonPage id="counter-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <BackButton />
          </IonButtons>
          <IonTitle>{counter?.name}</IonTitle>
          <IonButtons slot="primary">
            <fetcher.Form method="post">
              <IonButton type="submit">
                <IonIcon slot="icon-only" icon={removeCircleOutline} />
              </IonButton>
              <input type="hidden" name="intent" value="decrement" />
            </fetcher.Form>
            <fetcher.Form method="post">
              <IonButton type="submit">
                <IonIcon slot="icon-only" icon={refreshCircleOutline} />
              </IonButton>
              <input type="hidden" name="intent" value="reset" />
            </fetcher.Form>
            <IonButton id="more-options">
              <IonIcon slot="icon-only" icon={ellipsisVertical} />
            </IonButton>
            <IonPopover trigger="more-options">
              <IonContent>
                <IonList>
                  <ContextMenuItem action="edit">Edit</ContextMenuItem>
                  <ContextMenuItem method="delete">Delete</ContextMenuItem>
                </IonList>
              </IonContent>
            </IonPopover>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent scrollY={false}>
        <fetcher.Form method="post" className="increment-wrapper">
          <button className="increment-button" name="intent" value="increment">
            <div className="increment-inner" style={createCounterColorStyles(counter)}>{counter.count}</div>
          </button>
        </fetcher.Form>
      </IonContent>
    </IonPage>
  )
}

export default CounterPage;
