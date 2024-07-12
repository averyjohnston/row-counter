import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonList, IonPage, IonPopover, IonTitle, IonToolbar } from "@ionic/react";
import { ellipsisVertical, removeCircleOutline, refreshCircleOutline } from 'ionicons/icons';
import { ActionFunction, redirect, useFetcher, useLoaderData } from "react-router-dom";
import { db } from "../db";
import { CounterLoaderResults } from "../types";
import BackButton from "../components/BackButton";
import { clickVibrate, createCounterColorStyles, decrement, increment, reset } from "../utils";
import ContextMenuItem from "../components/ContextMenuItem";
import { useContext } from "react";
import { globalSettingsContext } from "../App";
import MiniCounter from "../components/MiniCounter";
import BasicSettingToggle from "../components/BasicSettingToggle";

import "./CounterPage.scss";

// TODO (nice to have): Ravelry integration, including generic login, to link with specific project

export const action: ActionFunction = async ({ params, request }) => {
  const formData = await request.formData();
  let id: string;

  // if there's an ID specified in the form, we're dealing with a sub-counter
  // otherwise, it's the main counter, so just use the ID in the URL
  const idFromForm = formData.get('counterID');
  if (idFromForm !== null) {
    id = idFromForm.toString();
  } else {
    id = params.id!; // we already validated ID in loader, no need to do it again
  }

  const idNum = parseInt(id);
  const isSub = formData.get('isSubCounter') === 'true';

  // TODO: update confirm messages to account for it being a sub-counter
  if (request.method === 'DELETE') {
    if (!confirm('Are you sure you want to delete this counter?')) {
      document.querySelector<HTMLIonPopoverElement>('ion-popover')?.dismiss();
      return false;
    }

    // TODO: also delete all sub-counters if this isn't a sub itself
    await db.counters.delete(idNum);
    return redirect('/');
  } else if (request.method === 'POST') {
    const intent = formData.get('intent');

    switch (intent) {
      case 'increment': return await increment(idNum, isSub);
      case 'decrement': return await decrement(idNum, isSub);
      case 'reset': {
        if (!confirm('Are you sure you want to reset this counter to its reset value?')) {
          return false;
        }

        if (formData.get('hapticsEnabled') === 'true') clickVibrate();
        return await reset(idNum, isSub);
      }
    }

    throw new Error(`Unknown form intent: ${intent}`);
  }

  throw new Error(`Unknown request type: ${request.method}`);
}

// clickVibrate is called onClick instead of in action to avoid tiny but noticeable delay
function CounterPage() {
  const { counter, subCounters } = useLoaderData() as CounterLoaderResults;
  const fetcher = useFetcher();
  const { globalSettings } = useContext(globalSettingsContext);

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
                  {subCounters.length > 0 && <IonItem lines="none">
                    <BasicSettingToggle settingKey="showMiniCounterExtraButtons" renderCheckbox={true}>Show sub-counter extras</BasicSettingToggle>
                  </IonItem>}
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
          {subCounters.length > 0 && <div className={`sub-counters ${globalSettings.showMiniCounterExtraButtons ? 'sub-counters--has-extra-buttons' : ''}`}>
            {subCounters?.map(sc => sc && <MiniCounter key={sc.id} counter={sc} showExtraButtons={globalSettings.showMiniCounterExtraButtons} /> )}
          </div>}
        </div>
      </IonContent>
    </IonPage>
  )
}

export default CounterPage;
