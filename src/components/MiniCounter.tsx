import { IonButton, IonContent, IonIcon, IonItem, IonList, IonPopover } from '@ionic/react';
import { addCircleOutline, ellipsisVertical, refreshCircleOutline, removeCircleOutline } from 'ionicons/icons';
import { useContext } from 'react';
import { Link, useFetcher, useSubmit } from 'react-router-dom';

import { globalSettingsContext } from '../App';
import type { Counter, SubCounter } from '../types';
import { clickVibrate, createCounterColorStyles, isSubCounter } from '../utils';

import './MiniCounter.scss';

export default function MiniCounter(props: {
  counter: Counter | SubCounter,
  showExtraButtons?: boolean
}) {
  const { counter, showExtraButtons } = props;
  const { globalSettings } = useContext(globalSettingsContext);
  const isSub = isSubCounter(counter);
  const fetcher = useFetcher();
  const submit = useSubmit();

  const info = (
    <>
      <p>{counter.name}</p>
      <p>{counter.count}</p>
    </>
  );

  // avoids needing to render a million hidden inputs in forms
  const submitWithoutNavigation = (intent: string, vibrate: boolean = false) => {
    // vibrate before action gets called to avoid tiny but noticeable delay
    if (vibrate && globalSettings.haptics) clickVibrate();

    fetcher.submit({
      intent,
      counterID: counter.id,
      isSubCounter: isSub + '',
      hapticsEnabled: globalSettings.haptics ? 'true' : 'false',
    }, {
      method: 'post',
    })
  };

  const moreOptionsButtonID = `more-options-${counter.id}`;

  return (
    <div className="mini-counter">
      {showExtraButtons && <div className="mini-counter__extra-buttons">
        <IonButton type="submit" fill="clear" onClick={() => submitWithoutNavigation('reset')}>
          <IonIcon slot="icon-only" size="large" icon={refreshCircleOutline} />
        </IonButton>
      </div>}
      <div className="mini-counter__counter" style={createCounterColorStyles(counter)}>
        <button className="mini-counter__button" onClick={() => submitWithoutNavigation('decrement', true)}>
          <IonIcon icon={removeCircleOutline} />
        </button>
        {/* TODO: consider doing this instead https://stackoverflow.com/a/69831173 */}
        {isSub ?
          <div className="mini-counter__info">{info}</div> :
          <Link className="mini-counter__info" to={`counters/${(counter as Counter).id}`}>{info}</Link>
        }
        <button className="mini-counter__button" onClick={() => submitWithoutNavigation('increment', true)}>
          <IonIcon icon={addCircleOutline} />
        </button>
      </div>
      {showExtraButtons && <div className="mini-counter__extra-buttons">
        <IonButton fill="clear" id={moreOptionsButtonID}>
          <IonIcon slot="icon-only" icon={ellipsisVertical} />
        </IonButton>
        <IonPopover trigger={moreOptionsButtonID}>
          <IonContent>
            <IonList>
              {/* TODO: consider replacing with some version of ContextMenuItem */}
              <IonItem lines="none" button={true} onClick={() => {
                submit({
                  counterID: counter.id,
                }, {
                  action: 'edit-sub',
                })
              }}>Edit</IonItem>
              <IonItem lines="none" button={true} onClick={() => submitWithoutNavigation('delete')}>Delete</IonItem>
            </IonList>
          </IonContent>
        </IonPopover>
      </div>}
    </div>
  );
}
