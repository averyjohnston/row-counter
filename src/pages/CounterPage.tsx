import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonList, IonPage, IonPopover, IonTitle, IonToolbar } from "@ionic/react";
import { ellipsisVertical, removeCircleOutline, refreshCircleOutline } from 'ionicons/icons';
import { ActionFunction, redirect, useFetcher, useLoaderData } from "react-router-dom";
import { db } from "../db";
import { Counter } from "../types";
import BackButton from "../components/BackButton";
import { clickVibrate, createCounterColorStyles, decrement, increment, reset } from "../utils";
import ContextMenuItem from "../components/ContextMenuItem";
import { useContext } from "react";
import { globalSettingsContext } from "../App";
import { useLiveQuery } from "dexie-react-hooks";
import MiniCounter from "../components/MiniCounter";

import "./CounterPage.scss";

// TODO: sub-counters w/ just names and colors (make counter display from list page into reusable component? should also have reset button, maybe to the side)
// TODO (nice to have): Ravelry integration, including generic login, to link with specific project

export const action: ActionFunction = async ({ params, request }) => {
  const { id } = params;
  const idNum = parseInt(id!); // we already validated ID in loader, no need to do it again

  if (request.method === 'DELETE') {
    if (!confirm('Are you sure you want to delete this counter?')) {
      document.querySelector<HTMLIonPopoverElement>('ion-popover')?.dismiss();
      return false;
    }

    // TODO: also delete all sub-counters
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

        if (formData.get('hapticsEnabled') === 'true') clickVibrate();
        return await reset(idNum);
      }
    }

    throw new Error(`Unknown form intent: ${intent}`);
  }

  throw new Error(`Unknown request type: ${request.method}`);
}

// clickVibrate is called onClick instead of in action to avoid tiny but noticeable delay
function CounterPage() {
  const counter = useLoaderData() as Counter;
  const fetcher = useFetcher();
  const { globalSettings } = useContext(globalSettingsContext);
  const { subCounters: subIDs } = counter;
  const subCounters = useLiveQuery(() => db.subCounters.bulkGet(subIDs));

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
              <IonButton type="submit" onClick={globalSettings.haptics ? clickVibrate : undefined}>
                <IonIcon slot="icon-only" icon={removeCircleOutline} />
              </IonButton>
              <input type="hidden" name="intent" value="decrement" />
            </fetcher.Form>
            <fetcher.Form method="post">
              <IonButton type="submit">
                <IonIcon slot="icon-only" icon={refreshCircleOutline} />
              </IonButton>
              <input type="hidden" name="intent" value="reset" />
              <input type="hidden" name="hapticsEnabled" value={globalSettings.haptics ? "true" : "false"} />
            </fetcher.Form>
            <IonButton id="more-options">
              <IonIcon slot="icon-only" icon={ellipsisVertical} />
            </IonButton>
            <IonPopover trigger="more-options">
              <IonContent>
                <IonList>
                  <ContextMenuItem action="edit">Edit</ContextMenuItem>
                  <ContextMenuItem to="new-sub">New sub-counter</ContextMenuItem>
                  <ContextMenuItem method="delete">Delete</ContextMenuItem>
                </IonList>
              </IonContent>
            </IonPopover>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent scrollY={false}>
        <div className="counter-display">
          <fetcher.Form method="post" className="increment-wrapper" onClick={globalSettings.haptics ? clickVibrate : undefined}>
            <button className="increment-button" name="intent" value="increment">
              <div className="increment-inner" style={createCounterColorStyles(counter)}>{counter.count}</div>
            </button>
          </fetcher.Form>
          {subIDs.length > 0 && <div className="sub-counters">
            {subCounters?.map(sc => sc && <MiniCounter key={sc.id} counter={sc} />)}
          </div>}
        </div>
      </IonContent>
    </IonPage>
  )
}

export default CounterPage;
