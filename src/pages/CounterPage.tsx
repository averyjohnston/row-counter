import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonList, IonPage, IonPopover, IonTitle, IonToolbar } from "@ionic/react";
import { ellipsisVertical } from 'ionicons/icons';
import { ActionFunction, redirect, useFetcher, useLoaderData } from "react-router-dom";
import { db } from "../db";
import { Counter } from "../types";
import BackButton from "../components/BackButton";
import { increment } from "../utils";
import ContextMenuItem from "../components/ContextMenuItem";

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

    if (intent === 'increment') {
      return await increment(idNum);
    }
  }
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
      <IonContent className="ion-padding">
        <fetcher.Form method="post">
          <button name="intent" value="increment">{counter.count}</button>
        </fetcher.Form>
      </IonContent>
    </IonPage>
  )
}

export default CounterPage;
