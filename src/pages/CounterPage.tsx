import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonList, IonPage, IonPopover, IonTitle, IonToolbar } from '@ionic/react';
import { ellipsisVertical, refreshCircleOutline, removeCircleOutline } from 'ionicons/icons';
import { useContext } from 'react';
import type { ActionFunction } from 'react-router-dom';
import { redirect, useLoaderData } from 'react-router-dom';

import { globalSettingsContext } from '../App';
import BackButton from '../components/BackButton';
import BasicSettingToggle from '../components/BasicSettingToggle';
import ButtonAction from '../components/ButtonAction';
import ContextMenuItemAction from '../components/ContextMenuItemAction';
import ContextMenuItemLink from '../components/ContextMenuItemLink';
import MiniCounter from '../components/MiniCounter';
import { db } from '../db';
import type { CounterLoaderResults } from '../types';
import { clickVibrate, createCounterColorStyles, decrement, increment, reset } from '../utils';

import './CounterPage.scss';

// TODO (nice to have): Ravelry integration, including generic login, to link with specific project
// TODO: anything we can do about that error ion-backdrop is generating on popover dismiss?

export const action: ActionFunction = async ({ params, request }) => {
  const formData = await request.formData();
  let id: string;

  // having an ID specified in the form generally means we're dealing with a sub-counter
  // the isSub param has been left separate for better extensibility if needed
  // note that we can't just always set the counterID since that would break direct links to counters
  const idFromForm = formData.get('counterID');
  if (idFromForm !== null) {
    id = idFromForm.toString();
  } else {
    id = params.id!; // we already validated ID in loader, no need to do it again
  }

  const idNum = parseInt(id);
  const isSub = formData.get('isSubCounter') === 'true';
  const counterTypeStr = isSub ? 'sub-counter' : 'counter';

  const intent = formData.get('intent');
  switch (intent) {
    case 'increment': return await increment(idNum, isSub);
    case 'decrement': return await decrement(idNum, isSub);
    case 'reset': {
      if (!confirm(`Are you sure you want to reset this ${counterTypeStr} to its reset value?`)) {
        return false;
      }

      if (formData.get('hapticsEnabled') === 'true') clickVibrate();
      return await reset(idNum, isSub);
    }
    case 'delete': {
      if (!confirm(`Are you sure you want to delete this ${counterTypeStr}?`)) {
        void document.querySelector<HTMLIonPopoverElement>('ion-popover')?.dismiss();
        return false;
      }

      // if it's a sub-counter, remove it from the parent's ID list
      if (isSub) {
        const parentID = parseInt(params.id!);
        await db.counters.where({ id: parentID }).modify(parentCounter => {
          const index = parentCounter.subCounters.indexOf(idNum);
          if (index === -1) return;
          parentCounter.subCounters.splice(index, 1);
        });
      } else {
        // if it's not a sub-counter, first delete any sub-counters it had
        const counter = await db.counters.get(idNum);
        const subCounters = counter?.subCounters;
        await db.subCounters.bulkDelete(subCounters || []);
      }

      // now delete the counter we originally interacted with
      const table = isSub ? 'subCounters' : 'counters';
      await db[table].delete(idNum);

      return isSub ? true : redirect('/');
    }
  }

  throw new Error(`Unknown form intent: ${intent?.toString()}`);
}

// clickVibrate is called onClick instead of in action to avoid tiny but noticeable delay
function CounterPage() {
  const { counter, subCounters } = useLoaderData() as CounterLoaderResults;
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
            <ButtonAction ionButton={true} haptics={true} formData={{ intent: 'decrement' }}>
              <IonIcon slot="icon-only" icon={removeCircleOutline} />
            </ButtonAction>
            <ButtonAction ionButton={true} formData={{
              intent: 'reset',
              hapticsEnabled: globalSettings.haptics + '',
            }}>
              <IonIcon slot="icon-only" icon={refreshCircleOutline} />
            </ButtonAction>
            <IonButton id="more-options">
              <IonIcon slot="icon-only" icon={ellipsisVertical} />
            </IonButton>
            <IonPopover trigger="more-options">
              <IonContent>
                <IonList>
                  <ContextMenuItemAction action="edit">Edit</ContextMenuItemAction>
                  <ContextMenuItemLink to="new-sub">New sub-counter</ContextMenuItemLink>
                  <IonItem lines="none">
                    <BasicSettingToggle settingKey="showMiniCounterExtraButtons" renderCheckbox={true}>Show sub-counter extras</BasicSettingToggle>
                  </IonItem>
                  <ContextMenuItemAction method="post" formData={{ intent: 'delete' }}>Delete</ContextMenuItemAction>
                </IonList>
              </IonContent>
            </IonPopover>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent scrollY={false}>
        <div className="counter-display">
          <ButtonAction className="increment-button" haptics={true} formData={{ intent: 'increment' }}>
            <div className="increment-inner" style={createCounterColorStyles(counter)}>{counter.count}</div>
          </ButtonAction>
          {subCounters.length > 0 && <div className={`sub-counters ${globalSettings.showMiniCounterExtraButtons ? 'sub-counters--has-extra-buttons' : ''}`}>
            {subCounters?.map(sc => sc && <MiniCounter key={sc.id} counter={sc} showExtraButtons={globalSettings.showMiniCounterExtraButtons} /> )}
          </div>}
        </div>
      </IonContent>
    </IonPage>
  )
}

export default CounterPage;
